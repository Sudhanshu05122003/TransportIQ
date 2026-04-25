const authService = require('./auth.service');

const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, message: 'Registration successful', data: result });
    } catch (error) { next(error); }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, message: 'Login successful', data: result });
    } catch (error) { next(error); }
  },

  async requestOTP(req, res, next) {
    try {
      const result = await authService.requestOTP(req.body.phone);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async verifyOTP(req, res, next) {
    try {
      const result = await authService.verifyOTP(req.body.phone, req.body.otp);
      res.json({ success: true, message: 'OTP verified', data: result });
    } catch (error) { next(error); }
  },

  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.userId);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.userId, req.body);
      res.json({ success: true, message: 'Profile updated', data: user });
    } catch (error) { next(error); }
  }
};

module.exports = authController;
