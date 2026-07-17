const Router = require('express').Router();
const newsController = require('../controllers/news.controller');
const authMiddleware = require('../middleware/auth.middleware');

Router.get('/', newsController.getNews);
Router.get('/nutrition-tip', newsController.getNutritionTipController);

module.exports = Router;