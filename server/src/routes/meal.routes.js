const Router = require('express').Router();
const mealController = require('../controllers/meal.controller');
const authMiddleware = require('../middleware/auth.middleware');

Router.post('/', authMiddleware, mealController.createMeal);
Router.get('/recents', authMiddleware, mealController.getRecentMeals);

module.exports = Router;