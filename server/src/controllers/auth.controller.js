const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const OTPModel = require('../models/otp.model');
const { sendOTPEmail } = require('../services/email.service');

function getJwtSecret(useRefreshSecret = false) {
    return useRefreshSecret && process.env.JWT_REFRESH_SECRET
        ? process.env.JWT_REFRESH_SECRET
        : process.env.JWT_SECRET;
}

function setAuthCookies(res, accessToken, refreshToken) {
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('token', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

async function registerUser(req, res) {
    try {
        const {
            name,
            email,
            password,
            type,
            targetLow,
            targetHigh
        } = req.body;

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                message: 'User already exists.'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTPModel.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                userData: {
                    name,
                    email,
                    password,
                    diabetesType: type,
                    targetBloodSugar: {
                        low: targetLow,
                        high: targetHigh
                    }
                },
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        await sendOTPEmail(email, otp);
        return res.status(200).json({
            message: 'OTP sent successfully.'
        });
    } catch (err) {
        console.error('REGISTER ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTPModel.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'OTP not found or expired.'
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTPModel.deleteOne({ email });

            return res.status(400).json({
                message: 'OTP has expired.'
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP.'
            });
        }

        const user = await userModel.create(otpRecord.userData);

        await OTPModel.deleteOne({ email });

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id, type: 'refresh' },
            getJwtSecret(true),
            { expiresIn: '7d' }
        );

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error('VERIFY OTP ERROR:', err);
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

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id, type: 'refresh' },
            getJwtSecret(true),
            { expiresIn: '7d' }
        );

        setAuthCookies(res, accessToken, refreshToken);

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

async function refreshToken(req, res) {
    try {
        const refreshTokenValue = req.cookies.refreshToken;

        if (!refreshTokenValue) {
            return res.status(401).json({
                message: 'No refresh token found.'
            });
        }

        const decoded = jwt.verify(refreshTokenValue, getJwtSecret(true));
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id, type: 'refresh' },
            getJwtSecret(true),
            { expiresIn: '7d' }
        );

        setAuthCookies(res, accessToken, newRefreshToken);

        return res.status(200).json({
            message: 'Token refreshed successfully.'
        });
    } catch (err) {
        console.error('REFRESH TOKEN ERROR:', err);
        return res.status(401).json({
            message: 'Invalid refresh token.'
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
        res.clearCookie('refreshToken', {
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
    verifyOTP,
    loginUser,
    updateProfile,
    refreshToken,
    logoutUser,
    getCurrentUser
};