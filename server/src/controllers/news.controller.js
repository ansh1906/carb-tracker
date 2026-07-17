const {getDiabetesNews,} = require('../services/news.service');

const{getNutritionTip} = require('../services/nutrition.service');

async function getNews(req, res) {
    try {
        const articles = await getDiabetesNews();
        return res.status(200).json(articles);
    } catch (err) {
        console.error('GET NEWS ERROR:', err);
        return res.status(500).json({ message: err.message });
    }
}


async function getNutritionTipController(req, res) {
    try {
        const tip = await getNutritionTip();
        return res.status(200).json(tip);
    } catch (err) {
        console.error('GET NUTRITION TIP ERROR:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getNews,
    getNutritionTipController,
};