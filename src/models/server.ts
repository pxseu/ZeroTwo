import { Document, model, Schema } from "mongoose";

export interface guildConf extends Document {
	prefix: string;
	serverid: string;
}

const serverSchema = new Schema({
	prefix: {
		type: String,
		default: "zt!",
	},
	serverid: {
		type: String,
		required: true,
	},
});

const schema = model<guildConf>("server", serverSchema);

export const findOrCreate = async (guildId: string): Promise<guildConf> => {
	const isFound = await schema.findOne({ serverid: guildId });
	if (isFound) return isFound;

	return await new schema({ serverid: guildId }).save();
};

export default schema;
