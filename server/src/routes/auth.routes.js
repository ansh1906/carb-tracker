const userModel = require('../models/user.model');
const Router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

Router.post('/register', authController.registerUser);
Router.post('/login', authController.loginUser);
Router.post('/logout', authController.logoutUser);
Router.get('/me', authMiddleware, authController.getCurrentUser);
module.exports = Router;