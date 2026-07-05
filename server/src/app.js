const express = require('express');
const app = express();
authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);




module.exports = app;