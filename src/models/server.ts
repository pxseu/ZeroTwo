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

export default mongoose.model("server", serverSchema);
