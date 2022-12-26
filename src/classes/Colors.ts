type ColorsString = Exclude<keyof Colors, symbol | number | "toNumber">;

export class Colors {
	public readonly pink = "#FFAAFF";
	public readonly red: string = "#FF5555";

	public toNumber(color: ColorsString) {
		return Number(this[color].replace("#", "0x"));
	}
}
