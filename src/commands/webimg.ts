import { MessageAttachment } from "discord.js";
import { MessageEmbed } from "discord.js";
import puppeteer from "puppeteer";
import { embedColorInfo } from "../utils/config";

module.exports = {
	name: "webimg",
	description: "Capture a website!",
	async execute(message, args) {
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
		await page.setViewport({ width: 1920, height: 1080 });

		try {
			await page.goto(url, { timeout: 10 * 1000 });
		} catch (e) {
			message.error("Failed to load the page.");
			message.channel.stopTyping();
			return;
		}

		await page.waitForNavigation();
		const screenshot = await page.screenshot({ fullPage: true });
		await browser.close();

		const attachment = new MessageAttachment(screenshot, "uwu.png");
		const embed = new MessageEmbed();
		embed.attachFiles([attachment]);
		embed.setColor(embedColorInfo);
		embed.setDescription(`Screenshot from [${url}](${url})`);
		embed.setImage("attachment://uwu.png");

		message.channel.send(embed);
		message.channel.stopTyping();
	},
	type: 2,
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
