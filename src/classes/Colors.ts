export class Colors {
	public readonly pink = "#FFAAFF";
	public readonly red: string = "#FF5555";

	public toNumber(color: string) {
		return Number(color.replace("#", "0x"));
	}
}
