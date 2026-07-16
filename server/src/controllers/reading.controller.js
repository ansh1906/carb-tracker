const GlucoseReadingModel = require('../models/glucoseReading.model');

async function createReading(req, res) {
    try {
        const { reading, context, note } = req.body;

        // Create a new glucose reading entry in the database
        const glucoseReading = await GlucoseReadingModel.create({
            user: req.user._id,
            reading,
            context,
            note
        });

        return res.status(201).json({
            message: 'Glucose reading created successfully.',
            glucoseReading
        });
    } catch (err) {
        console.error('CREATE GLUCOSE READING ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function getRecentReadings(req, res) {
    try {
        const readings = await GlucoseReadingModel.find({ user: req.user._id }).sort({ date: -1 }).limit(10);
        return res.status(200).json(readings);
    } catch (err) {
        console.error('GET RECENT GLUCOSE READINGS ERROR:', err);
        return res.status(500).json({
            message: err.message
        });
    }
}

async function getReadingsByRange(req, res) {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
        return res.status(400).json({ message: 'Please provide start and end dates.' });
        }
        const readings = await GlucoseReadingModel.find({
            user: req.user._id,
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        }).sort({ date: 1 });

        return res.status(200).json(readings);
    } catch (err) {
        console.error('GET READINGS BY RANGE ERROR:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createReading,
    getRecentReadings,
    getReadingsByRange
};