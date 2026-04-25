const router = require('express').Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const { validate, registerRules, loginRules } = require('../../middleware/validate');
const { authLimiter, otpLimiter } = require('../../middleware/rateLimiter');

// Public routes
router.post('/register', authLimiter, registerRules, validate, authController.register);
router.post('/login', authLimiter, loginRules, validate, authController.login);
router.post('/otp/request', otpLimiter, authController.requestOTP);
router.post('/otp/verify', authLimiter, authController.verifyOTP);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
