const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("server", serverSchema);
