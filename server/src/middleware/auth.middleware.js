const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

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

const authMiddleware = async (req, res, next) => {
    const accessToken = req.cookies.token;
    const refreshTokenValue = req.cookies.refreshToken;

    if (!accessToken && !refreshTokenValue) {
        return res.status(401).json({
            message: 'No token found.'
        });
    }

    try {
        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            req.user = user;
            return next();
        }

        throw new Error('No access token');
    } catch (err) {
        if (!refreshTokenValue) {
            console.error('AUTH MIDDLEWARE ERROR:', err);
            return res.status(401).json({
                message: 'Invalid token.'
            });
        }

        try {
            const decoded = jwt.verify(refreshTokenValue, getJwtSecret(true));
            const user = await userModel.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            const newAccessToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
            const newRefreshToken = jwt.sign(
                { id: user._id, type: 'refresh' },
                getJwtSecret(true),
                { expiresIn: '7d' }
            );

            setAuthCookies(res, newAccessToken, newRefreshToken);
            req.user = user;
            return next();
        } catch (refreshErr) {
            console.error('AUTH MIDDLEWARE ERROR:', refreshErr);
            return res.status(401).json({
                message: 'Invalid token.'
            });
        }
    }
};

module.exports = authMiddleware;