const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                message: 'User already exists.'
            });
        }

        const user = await userModel.create({
            name,
            email,
            password
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
        });

        return res.status(201).json({
            message: 'User registered successfully.'
        });
    } catch (err) {
        console.error('REGISTER ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Invalid email or password.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'User logged in successfully.',
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    registerUser,loginUser
};