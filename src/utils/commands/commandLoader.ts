import { readdir, stat } from "fs";
import { Collection } from "discord.js";
import path from "path";

const loadCommands = async (): Promise<Collection<string, Command>> => {
	const commands = new Collection<string, Command>();
	try {
		const commandsFiles = await getCommandFiles("./dist/commands");
		console.log(`> Found ${commandsFiles.length} command(s)`);
		for (const file of commandsFiles) {
			const command: Command = await import(file);
			commands.set(command.name, command);
		}
	} catch (e) {
		console.error(e);
		console.log("There was an error while reading command files");
		process.exit(1);
	}
	return commands;
};

/**
 * Recursively walk a directory asynchronously and obtain all file names (with full path).
 *
 * @param dir Folder name you want to recursively process
 * @param done Callback function, returns all files with full path.
 * @param filter Optional filter to specify which files to include,
 *   e.g. for json files: (f: string) => /.json$/.test(f)
 *  @copyright https://gist.github.com/erikvullings/c7eed546a4be0ba43532f8b83048ef38
 *
 */

const walk = (dir: string, done: (err: Error | null, results?: string[]) => void, filter?: (f: string) => boolean) => {
	let results: string[] = [];
	readdir(dir, (err: Error, list: string[]) => {
		if (err) {
			return done(err);
		}
		let pending = list.length;
		if (!pending) {
			return done(null, results);
		}
		list.forEach((file: string) => {
			file = path.resolve(dir, file);
			stat(file, (_, stat) => {
				if (stat && stat.isDirectory()) {
					walk(
						file,
						(_, res) => {
							if (res) {
								results = results.concat(res);
							}
							if (!--pending) {
								done(null, results);
							}
						},
						filter
					);
				} else {
					if (typeof filter === "undefined" || (filter && filter(file))) {
						results.push(file);
					}
					if (!--pending) {
						done(null, results);
					}
				}
			});
		});
	});
};

function getCommandFiles(dir: string): Promise<string[]> {
	const startPath = "../../";
	return new Promise((resolve, reject) => {
		walk(
			dir,
			(e, d) => {
				if (e) return reject(e);
				const relativePath = path.resolve(__dirname, startPath);

				resolve(d.map((path) => startPath + path.slice(relativePath.length + 1, path.length)));
			},
			(file) => /.js$/.test(file)
		);
	});
}

export default loadCommands;
