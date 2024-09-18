const { Comment } = require('../model/user');
const Joi = require('joi');

const createArticleValidationSchema = Joi.object({
	articleId: Joi.string().required('title is required'),
	content: Joi.string().required('content is required'),
});

const createComment = async (req, res) => {
	try {
		const { content, articleId } = req.body;
		const userId = req.id;
		const { error } = await createArticleValidationSchema.validateAsync({ articleId, content });

		if (error) {
			const message = error.details[0].message;
			const err = new Error(message);
			err.statusCode = 400;
			throw err;
		}

		const comment = await Comment.create({ content, user: userId, article: articleId });

		res.json({
			message: 'comments created successfully',
			succeeded: true,
			data: comment,
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

const getComments = async (req, res) => {
	const { pageNumber, pageSize } = req.query;

	let page = pageNumber || 1;
	let size = pageSize || 10;
	let limit = pageSize;
	let skip = (pageNumber - 1) * limit;

	try {
		const comments = await Comment.find({})
			.populate({
				path: 'user',
				select: '_id email firstName lastName',
			})
			.populate({
				path: 'article',
				select: '_id title author',
				populate: {
					path: 'author',
					select: '_id firstName lastName email',
				},
			})
			.skip(skip)
			.limit(limit)
			.exec();
		const totalCount = await Comment.countDocuments().exec();

		res.status(200).json({
			message: 'comments  successfully retrieved',
			succeeded: true,
			data: comments,
			totalCount,
			pageNumber: page,
			pageSize: size,
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

module.exports = { createComment, getComments };
