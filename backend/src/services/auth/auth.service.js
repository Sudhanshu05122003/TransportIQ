const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { sendOTP } = require('../../utils/sms');

class AuthService {
  /**
   * Register a new user
   */
  async register({ phone, email, password, role, first_name, last_name, company_name, gstin }) {
    // Check if phone already exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      const error = new Error('Phone number already registered');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      phone,
      email,
      password_hash,
      role,
      first_name,
      last_name,
      company_name,
      gstin
    });

    const tokens = this.generateTokens(user);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  /**
   * Login with email/phone and password
   */
  async login({ phone, email, password }) {
    const whereClause = phone ? { phone } : { email };
    const user = await User.findOne({ where: whereClause });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error('Account deactivated. Contact support.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const tokens = this.generateTokens(user);
    user.refresh_token = tokens.refreshToken;
    user.last_login_at = new Date();
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  /**
   * Request OTP for phone login
   */
  async requestOTP(phone) {
    let user = await User.findOne({ where: { phone } });
    if (!user) {
      const error = new Error('Phone number not registered');
      error.statusCode = 404;
      throw error;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp_code = otp;
    user.otp_expires_at = otpExpiry;
    await user.save();

    // Send OTP via utility
    await sendOTP(phone, otp);

    return { message: 'OTP sent successfully', expiresIn: 300 };
  }


  /**
   * Verify OTP and login
   */
  async verifyOTP(phone, otp) {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      const error = new Error('Phone number not registered');
      error.statusCode = 404;
      throw error;
    }

    if (!user.otp_code || user.otp_code !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 401;
      throw error;
    }

    if (new Date() > user.otp_expires_at) {
      const error = new Error('OTP expired');
      error.statusCode = 401;
      throw error;
    }

    // Clear OTP
    user.otp_code = null;
    user.otp_expires_at = null;
    user.is_verified = true;
    user.last_login_at = new Date();

    const tokens = this.generateTokens(user);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user || user.refresh_token !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      user.refresh_token = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      throw err;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'otp_code', 'otp_expires_at', 'refresh_token'] }
    });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const allowedFields = ['first_name', 'last_name', 'email', 'company_name', 'gstin', 'avatar_url'];
    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    await user.update(filteredUpdates);
    return this.sanitizeUser(user);
  }

  // Helper: Generate JWT tokens
  generateTokens(user) {
    const payload = { id: user.id, role: user.role, phone: user.phone };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '24h'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    });

    return { accessToken, refreshToken };
  }

  // Helper: Remove sensitive fields
  sanitizeUser(user) {
    const json = user.toJSON();
    delete json.password_hash;
    delete json.otp_code;
    delete json.otp_expires_at;
    delete json.refresh_token;
    return json;
  }
}

module.exports = new AuthService();
