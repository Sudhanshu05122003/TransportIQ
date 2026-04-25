const { User } = require('../models');
const { errorResponse } = require('../utils/response');

/**
 * Public API Key Authentication
 * Used for external business integrations
 */
const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (!apiKey || !apiSecret) {
    return errorResponse(res, 'Missing API Credentials', 401);
  }

  try {
    const user = await User.findOne({ 
      where: { api_key: apiKey, api_secret: apiSecret, is_active: true } 
    });

    if (!user) {
      return errorResponse(res, 'Invalid API Credentials', 401);
    }

    // Set request context
    req.userId = user.id;
    req.userRole = user.role;
    req.organizationId = user.organization_id;

    next();
  } catch (error) {
    console.error('API Auth Error:', error);
    return errorResponse(res, 'Internal Server Error', 500);
  }
};

module.exports = apiKeyAuth;
