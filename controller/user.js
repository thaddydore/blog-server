const Joi = require('joi');
const config = require('dotenv').config;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

config();

const validationSchema = Joi.object({
	password: Joi.string().required('password is required').alphanum('character must be alphanumeric'),
	email: Joi.string().email().required('email is required'),
});

const updateValidationSchema = Joi.object({
	firstName: Joi.string(),
	lastName: Joi.string(),
	bio: Joi.string(),
});

const createUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const { error } = await validationSchema.validateAsync({ email, password });

		if (error) {
			const message = error.details[0].message;
			const err = new Error(message);
			err.statusCode = 400;
			throw err;
		}

		let user = await User.findOne({ email });

		if (user) throw new Error('user already exist');

		const saltRound = 10;
		const salt = await bcrypt.genSalt(saltRound);
		const hashedPassword = await bcrypt.hash(password, salt);

		user = new User({ email, password });
		user.password = hashedPassword;
		await user.save();

		user.password = undefined;

		res.json({
			message: 'user created successfully',
			succeeded: true,
			data: user,
		});
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

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const { error } = await validationSchema.validateAsync({ email, password });

		if (error) {
			const message = error.details[0].message;
			const err = new Error(message);
			err.statusCode = 400;
			throw err;
		}

		let user = await User.findOne({ email });

		if (!user) throw new Error('incorrect email or password');

		const hashedPassword = user.password;

		const isCorrectPassword = await bcrypt.compare(password, hashedPassword);

		if (!isCorrectPassword) throw new Error('incorrect email or password');

		const jwtSecret = process.env.JWT_SECRET;
		const token = await jwt.sign({ email: user.email, id: user?._id }, jwtSecret);

		res.status(200).json({
			message: 'login successful',
			succeeded: true,
			data: {
				email: user.email,
				token: token,
			},
		});
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

const getUser = async (req, res) => {
	try {
		const id = req.id;

		const user = await User.findOne({ _id: id }).select(['email', 'bio', '_id', 'createdAt', 'updatedAt']).exec();

		user.password = undefined;

		if (!user) throw new Error('unuathorised user');

		res.status(200).json({
			message: 'profile successful',
			succeeded: true,
			data: user,
		});
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

const updateUser = async (req, res) => {
	try {
		const { firstName, lastName, bio } = req.body;
		const id = req.id;

		const userToUpdate = {};

		if (firstName) userToUpdate.firstName = firstName;
		if (lastName) userToUpdate.lastName = lastName;
		if (bio) userToUpdate.bio = bio;

		const { error } = await updateValidationSchema.validateAsync(userToUpdate);

		if (error) {
			const message = error.details[0].message;
			const err = new Error(message);
			err.statusCode = 400;
			throw err;
		}

		let user = await User.findOneAndUpdate({ _id: id }, userToUpdate);

		user.password = undefined;

		if (!user) throw new Error('invalid user');

		res.json({
			message: 'user updated successfully',
			succeeded: true,
			data: user,
		});
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

const deleteUser = async (req, res) => {
	try {
		const id = req.id;

		let user = await User.findOneAndDelete({ _id: id });

		if (!user) throw new Error('invalid user');

		user.password = undefined;

		res.json({
			message: 'user deleted successfully',
			succeeded: true,
			data: user,
		});
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

module.exports = { createUser, login, getUser, updateUser, deleteUser };
