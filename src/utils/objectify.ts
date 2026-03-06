const isObject = (object: unknown) => typeof object === "object" && object !== null;

export const objectify = (
	object: Record<string, unknown>,
	...props: Record<string, string | boolean>[]
): Record<string, unknown> => {
	if (!isObject(object)) return object;

	const objProps = Object.keys(object)
		.filter((key) => !key.startsWith("_"))
		.map((key) => ({ [key]: true }));

	const availableProps: Record<string, string | boolean> = objProps.length
		? Object.assign({}, ...objProps, ...props)
		: Object.assign({}, ...props);

	const out: Record<string, unknown> = {};

	for (const [prop, newProp] of Object.entries(availableProps)) {
		if (newProp) {
			const currProp = newProp === true ? prop : newProp;

			const element = (object as Record<string, unknown>)[prop] as unknown;
			const elemIsObj = isObject(element);
			// biome-ignore lint/suspicious/noExplicitAny: dynamic property access on unknown shaped objects
			const elemAny = element as any;
			const elemValueOf =
				elemIsObj && typeof elemAny.valueOf === "function" ? elemAny.valueOf() : null;
			const toJson = elemIsObj && typeof elemAny.toJSON === "function" ? elemAny.toJSON() : null;

			if (Array.isArray(element))
				out[currProp] = element.map((e) => objectify(e as Record<string, unknown>));
			else if (typeof elemValueOf !== "object") out[currProp] = elemValueOf;
			else if (toJson !== null) out[currProp] = toJson;
			else if (!elemIsObj) out[currProp] = element;
		}
	}

	return out;
};
