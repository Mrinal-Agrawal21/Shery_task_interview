const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    verifyEmail,
    loginUser,
    getUserProfile
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a user & generate verification token
router.post('/register', registerUser);

// @route   POST /api/auth/verify-email
// @desc    Verify email with token
router.post('/verify-email', verifyEmail);

// @route   POST /api/auth/login
// @desc    Auth user & get token
router.post('/login', loginUser);

// @route   GET /api/profile
// @desc    Get user profile (protected)
router.get('/profile', protect, getUserProfile);

module.exports = router;
