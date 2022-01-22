const BLUE = "\x1b[34m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

export const logging = (label: string) => {
	return {
		log: (...args: any[]) => console.log(`${BLUE}[${label.toUpperCase()}]${RESET}:`, ...args),
		error: (...args: any[]) => console.error(`${RED}[${label.toUpperCase()}]${RESET}:`, ...args),
		warn: (...args: any[]) => console.warn(`${YELLOW}[${label.toUpperCase()}]${RESET}:`, ...args),
	};
};
