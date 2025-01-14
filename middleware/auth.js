const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { errorResponse } = require('../utils/response');

/**
 * Authentication middleware
 * Verifies JWT token from auth-token header
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    
    if (!token) {
      return errorResponse(res, 401, 'Authentication token required');
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      return errorResponse(res, 401, 'Invalid or expired token');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 500, 'Authentication error');
  }
};

module.exports = auth;