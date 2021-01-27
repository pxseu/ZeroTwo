import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;

export type botStaffType = Document & {
	id: string;
	role: string;
	permLvl: number;
};

const staff = new Schema({
	id: {
		type: String,
	},
	role: {
		type: String,
		required: true,
	},
	permLvl: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("staff", staff);
