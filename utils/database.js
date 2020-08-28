const mongoose = require('mongoose');

const database = async (dburl = '') => {
	try {
		mongoose.connect(dburl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		mongoose.connection.on('error', (error) => console.error(error));
		mongoose.connection.once('open', () =>
			console.log('Connected to database')
		);
	} catch (error) {
		console.error(error);
	}
};

module.exports = database;
