import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;

export type guildConf = Document & {
	prefix: string;
	logchannel: string;
	roleafterver: string;
	serverid: string;
	adminRole: string;
	modRole: string;
	verification: boolean;
	logging: boolean;
};

const serverSchema = new Schema({
	prefix: {
		type: String,
		default: "zt!",
	},
	logchannel: {
		type: String,
		default: "",
	},
	roleafterver: {
		type: String,
		default: "",
	},
	serverid: {
		type: String,
		required: true,
	},
	adminRole: {
		type: String,
		default: "Admin",
	},
	modRole: {
		type: String,
		default: "Moderator",
	},
	verification: {
		type: Boolean,
		default: false,
	},
	logging: {
		type: Boolean,
		default: false,
	},
});

export default mongoose.model("server", serverSchema);
