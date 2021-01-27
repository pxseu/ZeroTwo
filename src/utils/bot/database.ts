import mongoose from "mongoose";

const database = async (): Promise<void> => {
	mongoose.connection.on("error", (error) => {
		throw error;
	});
	mongoose.connection.once("open", () =>
		console.log(`> Connected to database: ${mongoose.connection.name}`)
	);

	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
};

export default database;
