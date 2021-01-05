import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export type guildConf = Document & {
	prefix: string;
	serverid: string;
};

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

const schema = mongoose.model("server", serverSchema);

export default schema;

export const findOrCreate = async (guildId: string): Promise<guildConf> => {
	const isFound = (await schema.findOne({ serverid: guildId })) as guildConf;
	if (isFound) return isFound;

	const guild = (await new schema({ serverid: guildId }).save()) as guildConf;
	return guild;
};
