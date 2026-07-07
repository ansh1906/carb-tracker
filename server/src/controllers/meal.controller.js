const mealModel = require('../models/meal.model');
const {getNutritionInfo} = require('../services/nutrition.service');

async function createMeal(req, res) {
    try {
        const { description } = req.body;

        // Get nutrition info from the external API
        const nutritionInfo = await getNutritionInfo(description);

        // Create a new meal entry in the database
        const meal = await mealModel.create({
            user: req.user._id,
            description,
            nutrients: nutritionInfo.nutrients,
            glycemicLoad: nutritionInfo.glycemicLoad,
            assumptions: nutritionInfo.assumptions
        });

        return res.status(201).json({
            message: 'Meal created successfully.',
            meal
        });
    } catch (err) {
        console.error('CREATE MEAL ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function getRecentMeals(req, res) {
    try {
        const meals = await mealModel.find({ user: req.user._id }).sort({ date: -1 }).limit(10);
        return res.status(200).json(meals);
    } catch (err) {
        console.error('GET RECENT MEALS ERROR:', err);
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    createMeal,
    getRecentMeals
};