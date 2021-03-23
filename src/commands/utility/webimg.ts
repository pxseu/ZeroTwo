import { MessageAttachment } from "discord.js";
import { MessageEmbed } from "discord.js";
import puppeteer from "puppeteer";
import { embedColorInfo } from "../../utils/config";

module.exports = {
	name: "webimg",
	description: "Capture a website!",
	async execute(message, args) {
		const res = {
			x: 1920,
			y: 1080,
		};

		if (args.find((arg) => arg.toLowerCase() === "--highres")) {
			args = args.filter((arg) => arg.toLowerCase() !== "--highres");
			(res.x = 3840), (res.y = 2160);
		}

		const url = args.join(" ");
		if (!validURL(url)) {
			message.error("You didn't provide a valid URL");
			return;
		}

		message.channel.startTyping();

		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			defaultViewport: null,
		});
		const page = await browser.newPage();
		await page.setViewport({ width: res.x, height: res.y });

		try {
			await page.goto(url, { timeout: 10 * 1000 });
		} catch (e) {
			message.error("Failed to load the page.");
			message.channel.stopTyping();
			return;
		}

		const screenshot = await page.screenshot({ fullPage: true, omitBackground: true });
		await browser.close();

		if (!screenshot) {
			message.error("Failed to send an embed");
			return;
		}

		const embed = new MessageEmbed();
		const attachment = new MessageAttachment(screenshot, "uwu.png");

		embed.attachFiles([attachment]);
		embed.setColor(embedColorInfo);
		embed.setDescription(`Screenshot from [${url}](${url})`);
		embed.setImage("attachment://uwu.png");
		message.channel.send(embed);
		message.channel.stopTyping();
	},
	type: 2,
	args: [{ name: "--highres", desc: "Optional, if you want to make the screenshot be in 4k." }],
} as Command;

function validURL(str: string) {
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" +
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
			"((\\d{1,3}\\.){3}\\d{1,3}))" +
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
			"(\\?[;&a-z\\d%_.~+=-]*)?" +
			"(\\#[-a-z\\d_]*)?$",
		"i"
	);

	return !!pattern.test(str);
}
