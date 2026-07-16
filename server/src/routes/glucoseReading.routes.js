const Router = require('express').Router();
const readingController = require('../controllers/reading.controller');
const authMiddleware = require('../middleware/auth.middleware');

Router.post('/', authMiddleware, readingController.createReading);
Router.get('/recents', authMiddleware, readingController.getRecentReadings);
Router.get('/range', authMiddleware, readingController.getReadingsByRange);
Router.get('/time-in-range', authMiddleware, readingController.getTimeInRange);

module.exports = Router;