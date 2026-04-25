/**
 * Cache Middleware for Scalability
 * Implements HTTP Cache-Control and Redis-based caching
 */
const { getRedis } = require('../config/redis');

const cacheMiddleware = (duration) => async (req, res, next) => {
  if (req.method !== 'GET') return next();

  const key = `cache:${req.originalUrl || req.url}`;
  const redis = getRedis();

  try {
    // 1. Try to serve from Redis
    const cachedData = await redis.get(key);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${duration}`);
      return res.json(JSON.parse(cachedData));
    }

    // 2. Wrap res.json to capture response and store in Redis
    res.originalJson = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${duration}`);
      res.originalJson(body);
    };

    next();
  } catch (error) {
    console.error('Cache Middleware Error:', error);
    next();
  }
};

module.exports = cacheMiddleware;
