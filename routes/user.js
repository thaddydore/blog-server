const { Router } = require('express');
const { createUser, login, getUser, updateUser, deleteUser } = require('../controller/user');
const { auth } = require('../middleware/middleware');

const userRoute = Router();

userRoute
	.post('/user', createUser)
	.get('/user', auth, getUser)
	.put('/user', auth, updateUser)
	.delete('/user', auth, deleteUser)
	.post('/user/login', login);

module.exports = { userRoute };
