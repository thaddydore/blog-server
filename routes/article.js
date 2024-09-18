const { Router } = require('express');
const {
	createArticle,
	getArticle,
	getArticleById,
	deleteArticleById,
	updateArticleById,
} = require('../controller/article');
const { auth } = require('../middleware/middleware');

const articleRoute = Router();

articleRoute
	.post('/article', auth, createArticle)
	.get('/article', auth, getArticle)
	.put('/article/:id', auth, updateArticleById)
	.get('/article/:id', auth, getArticleById)
	.delete('/article/:id', auth, deleteArticleById);

module.exports = { articleRoute };
