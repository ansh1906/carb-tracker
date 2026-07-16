const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    try {
        const { name, email, password, type, targetLow, targetHigh } = req.body;

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                message: 'User already exists.'
            });
        }

        const user = await userModel.create({
            name,
            email,
            password,
            type,
            targetLow,
            targetHigh
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken: token,
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
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function updateProfile(req, res) {
    try {
        const { diabetesType, targetBloodSugar } = req.body;

        // Update the user's profile
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                diabetesType,
                targetBloodSugar
            },
            { returnDocument: 'after'}
        );

        return res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (err) {
        console.error('UPDATE PROFILE ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({
            message: 'Logged out successfully.'
        });
    } catch (err) {
        console.error('LOGOUT ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};
module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    logoutUser,
    getCurrentUser
};