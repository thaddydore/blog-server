const jwt = require('jsonwebtoken');
const config = require('dotenv').config;

config();

const auth = async (req, res, next) => {
	try {
		const jwtSecret = process.env.JWT_SECRET;
		const token = req.headers['authorization'];
		const splittedToken = token?.split(' ');
		const bearer = splittedToken?.[0];
		const jwtToken = splittedToken?.[1];

		if (bearer !== 'Bearer') {
			const err = new Error('unauthorised user');
			err.statusCode = 401;
			throw err;
		}

		const decodedToken = await jwt.verify(jwtToken, jwtSecret);
		const userId = decodedToken.id;
		req.id = userId;
		next();
	} catch (error) {
		const message = error?.message;
		const statusCode = error?.statusCode;
		res.status(statusCode ?? 400).json({
			message,
			succeeded: false,
			data: null,
		});
	}
};

module.exports = { auth };
