const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to request
      req.userId = decoded.id;
      req.userRole = decoded.role;
      req.userEmail = decoded.email;
      
      // Also set req.user for broader compatibility
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      };

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = {
  authenticate
};

