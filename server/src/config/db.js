const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB() {
    try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectDB;