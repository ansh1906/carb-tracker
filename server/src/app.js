const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.routes');
const mealRoutes = require('./routes/meal.routes');
const readingRoutes = require('./routes/glucoseReading.routes');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/readings', readingRoutes);



module.exports = app;