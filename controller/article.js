const { Article } = require('../model/user');
const Joi = require('joi');

const createArticleValidationSchema = Joi.object({
	title: Joi.string().required('title is required'),
	content: Joi.string().required(''),
});

const createArticle = async (req, res) => {
	try {
		const { title, content } = req.body;
		const userId = req.id;
		const { error } = await createArticleValidationSchema.validateAsync({ title, content });

		if (error) {
			const message = error.details[0].message?.replaceAll(' \\ ').replaceAll(' "" ');
			const err = new Error(message);
			err.statusCode = 400;
			throw err;
		}

		const article = await Article.create({ title, content, author: userId });

		res.json({
			message: 'article created successfully',
			succeeded: true,
			data: article,
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

const getArticle = async (req, res) => {
	try {
		const article = await Article.find({});

		res.status(200).json({
			message: 'article  successfully retrieved',
			succeeded: true,
			data: article,
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

const updateArticleById = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id) throw new Error('id param is required');

		let article = await Article.findOne({ _id: id });

		if (!article) {
			let error = new Error('article does not exist');
			error.statusCode = 404;
			throw error;
		}

		res.json({
			message: 'article successully retrieved',
			succeeded: true,
			data: article,
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

const getArticleById = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id) throw new Error('id param is required');

		let article = await Article.findOne({ _id: id });

		if (!article) {
			let error = new Error('article does not exist');
			error.statusCode = 404;
			throw error;
		}

		res.json({
			message: 'article successully retrieved',
			succeeded: true,
			data: article,
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

const deleteArticleById = async (req, res) => {
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

module.exports = { createArticle, getArticle, deleteArticleById, getArticleById, updateArticleById };
