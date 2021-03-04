import { Document, model, Schema } from "mongoose";

export interface botStaffType extends Document {
	id?: string;
	role: string;
	permLvl: number;
}

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

export default model<botStaffType>("staff", staff);
