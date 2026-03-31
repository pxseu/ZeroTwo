import type { CommandInteraction, CommandInteractionOption } from "discord.js";
import { type ArgumentDefinition, Command, OptionTypes } from "../classes/Command.js";

const REGISTRY_URL = "https://registry.npmjs.org/";
const NPM_URL = "https://www.npmjs.com/package/";

interface RegistryPackage {
	name?: string;
	description?: string;
	homepage?: string;
	types?: string;
	typings?: string;
	"dist-tags"?: Record<string, string>;
	versions?: Record<string, VersionInfo>;
	author?: { name?: string } | string;
	license?: string;
}

interface VersionInfo {
	type?: string;
	main?: string;
	module?: string;
	types?: string;
	typings?: string;
	exports?: unknown;
}

function deepSome(value: unknown, predicate: (node: unknown) => boolean): boolean {
	if (predicate(value)) return true;
	if (Array.isArray(value)) return value.some((v) => deepSome(v, predicate));
	if (typeof value === "object" && value !== null) {
		return Object.values(value).some((v) => deepSome(v, predicate));
	}
	return false;
}

const hasKey = (value: unknown, key: string) =>
	deepSome(value, (v) => typeof v === "object" && v !== null && !Array.isArray(v) && key in v);

const hasExt = (value: unknown, ext: string) =>
	deepSome(value, (v) => typeof v === "string" && v.toLowerCase().endsWith(ext));

export default class Npm extends Command {
	public description = "Query npm for a package";

	public ephermal = (_: unknown, args: readonly CommandInteractionOption[] = []) =>
		(args.find((a) => a.name === this.options[1].name)?.value as boolean) || false;

	public options: ArgumentDefinition[] = [
		{
			name: "name",
			description: "Query NPM for a specific package name",
			type: OptionTypes.STRING,
			required: true,
		},
		{
			name: "ephermal",
			description: "If the command should be ephermal",
			type: OptionTypes.BOOLEAN,
		},
	];

	public async execute(
		interaction: CommandInteraction,
		args: readonly CommandInteractionOption[] = [],
	) {
		const query = args.find((a) => a.name === this.options[0].name)?.value as string;
		if (!query) return this.errorReply(interaction, "No package name provided");

		const response = await this.client._zerotwo.apiFetch(
			`${REGISTRY_URL}${encodeURIComponent(query)}`,
		);
		if (!response.ok) return this.errorReply(interaction, `Error: ${response.statusText}`);

		const pkg = await (response.json() as Promise<RegistryPackage>).catch(() => null);
		if (!pkg) return this.errorReply(interaction, "Error: invalid npm response");

		return interaction.editReply({
			embeds: [await this.buildEmbed(pkg, query)],
		});
	}

	private async buildEmbed(pkg: RegistryPackage, query: string) {
		const tags = pkg["dist-tags"] ?? {};
		const name = pkg.name ?? query;
		const latest = tags.latest;
		const version = latest
			? pkg.versions?.[latest]
			: Object.values(pkg.versions ?? {})[0];
		const npmUrl = `${NPM_URL}${name}`;
		const author = typeof pkg.author === "string" ? pkg.author : (pkg.author?.name ?? "Unknown");
		const types = await this.resolveTypesSupport(name, pkg, version);
		const modules = Npm.resolveModuleSupport(version);
		const tagList = Object.keys(tags)
			.map((t) => `\`${t}\``)
			.join(", ");

		return this.client._zerotwo.embed({
			title: name,
			description: pkg.description ?? "No description provided",
			url: pkg.homepage || npmUrl,
			fields: [
				{ name: "Latest", value: `\`${latest ?? "unknown"}\``, inline: true },
				{ name: "Types", value: `\`${types}\``, inline: true },
				{ name: "Modules", value: `\`${modules}\``, inline: true },
				{ name: "Tags", value: tagList || "`none`", inline: false },
				{ name: "Author", value: `\`${author}\``, inline: true },
				{ name: "License", value: `\`${pkg.license ?? "Unknown"}\``, inline: true },
				{ name: "Homepage", value: pkg.homepage ?? "Not provided" },
				{ name: "NPM", value: npmUrl },
			],
		});
	}

	private errorReply(interaction: CommandInteraction, description: string) {
		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					color: this.client._zerotwo.colors.toNumber("red"),
					description,
				}),
			],
		});
	}

	private async resolveTypesSupport(
		name: string,
		pkg: RegistryPackage,
		ver?: VersionInfo,
	): Promise<string> {
		if (name.startsWith("@types/")) return "DefinitelyTyped";
		if (Npm.hasBundledTypes(pkg, ver)) return "Bundled";

		const dtName = `@types/${name.startsWith("@") ? name.slice(1).replaceAll("/", "__") : name}`;
		const res = await this.client._zerotwo
			.apiFetch(`${REGISTRY_URL}${encodeURIComponent(dtName)}`)
			.catch(() => null);

		return res?.ok ? "DefinitelyTyped" : "No";
	}

	private static resolveModuleSupport(ver?: VersionInfo): string {
		if (!ver) return "Unknown";

		const esm =
			ver.type === "module" ||
			typeof ver.module === "string" ||
			hasKey(ver.exports, "import") ||
			hasExt(ver.main, ".mjs") ||
			hasExt(ver.exports, ".mjs");

		const cjs =
			ver.type === "commonjs" ||
			hasKey(ver.exports, "require") ||
			hasExt(ver.main, ".cjs") ||
			hasExt(ver.exports, ".cjs") ||
			(ver.type !== "module" && typeof ver.main === "string");

		if (esm && cjs) return "CJS + ESM";
		if (esm) return "ESM only";
		if (cjs) return "CJS only";
		return "Unknown";
	}

	private static hasBundledTypes(pkg: RegistryPackage, ver?: VersionInfo): boolean {
		return !!(
			pkg.types ||
			pkg.typings ||
			ver?.types ||
			ver?.typings ||
			hasKey(ver?.exports, "types")
		);
	}
}
