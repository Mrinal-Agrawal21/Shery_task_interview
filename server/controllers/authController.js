const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register a user & generate verification token
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a random token for email verification
        const verificationToken = crypto.randomBytes(20).toString('hex');

        const user = await User.create({
            name,
            email,
            password,
            verificationToken
        });

        if (user) {
            const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
            const message = `
                <h1>You have requested to register an account</h1>
                <p>Please go to this link to verify your email:</p>
                <a href=${verificationUrl} clicktracking=off>${verificationUrl}</a>
            `;

            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Email Verification',
                    html: message
                });

                res.status(201).json({
                    message: 'Registration successful. A verification link has been sent to your email.'
                });
            } catch (error) {
                console.error(error);
                await User.findByIdAndDelete(user._id);
                res.status(500).json({ message: 'Email could not be sent' });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify email with token
// @route   POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first. Check your email inbox for the verification link.' });
            }

            res.json({
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/profile
const getUserProfile = (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    });
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    getUserProfile
};
