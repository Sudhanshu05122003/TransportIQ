const { getRedis } = require('../config/redis');

/**
 * Advanced Redis-based Rate Limiter
 * Implements sliding window counter
 */
const rateLimiter = (options) => {
  const { 
    windowMs = 60000, 
    max = 100, 
    message = 'Too many requests, please try again later.' 
  } = options;

  return async (req, res, next) => {
    const redis = getRedis();
    const key = `ratelimit:${req.userId || req.ip}:${req.originalUrl}`;
    
    try {
      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.pexpire(key, windowMs);
      }

      const ttl = await redis.pttl(key);
      
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl).toISOString());

      if (current > max) {
        return res.status(429).json({
          status: 'error',
          message,
          retry_after: Math.ceil(ttl / 1000)
        });
      }

      next();
    } catch (error) {
      console.error('Rate Limiter Error:', error);
      next(); // Fail open in production or handle differently
    }
  };
};

module.exports = {
  rateLimiter,
  authLimiter: rateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts. Please try again in 15 minutes.' }),
  otpLimiter: rateLimiter({ windowMs: 60 * 60 * 1000, max: 5, message: 'OTP limit reached. Please try again in an hour.' }),
  // High-performance driver-sync limiter (allows frequent GPS updates but caps spam)
  driverSyncLimiter: rateLimiter({ windowMs: 1000, max: 5, message: 'Burst sync detected. Throttling GPS updates.' }),
  apiLimiter: rateLimiter({ windowMs: 60 * 1000, max: 1000 }) // Tiered for enterprise load
};


