const mongoose = require('mongoose');

const connectDb = async connectionUrl => {
	try {
		const conn = await mongoose.connect(connectionUrl);
		console.log(`db connect on ${conn.connection.host}`);
	} catch (error) {
		console.log(`error connecting db: ${error}`);
		process.exit(1);
	}
};

module.exports = { connectDb };
