const BLUE = "\x1b[34m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

export const logging = (label: string) => {
	const parsed = label.toUpperCase();

	return {
		label: parsed,
		log: (...args: unknown[]) => console.log(`${BLUE}[${parsed}]${RESET}:`, ...args),
		error: (...args: unknown[]) => console.error(`${RED}[${parsed}]${RESET}:`, ...args),
		warn: (...args: unknown[]) => console.warn(`${YELLOW}[${parsed}]${RESET}:`, ...args),
	};
};
