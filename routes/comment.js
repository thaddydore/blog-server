const { Router } = require('express');
const { createComment, getComments } = require('../controller/comment');
const { auth } = require('../middleware/middleware');

const commentRoute = Router();

commentRoute.post('/comment', auth, createComment).get('/comment', auth, getComments);

module.exports = { commentRoute };
