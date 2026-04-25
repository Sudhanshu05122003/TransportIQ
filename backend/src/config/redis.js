const { createClient } = require('redis');

let redisClient = null;

async function initRedis() {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });

    await redisClient.connect();
  } catch (error) {
    console.warn('⚠️  Redis connection failed, continuing without cache:', error.message);
    // Create a mock client for development without Redis
    redisClient = createMockRedisClient();
  }
}

function getRedis() {
  return redisClient;
}

// Mock Redis client for development when Redis is not available
function createMockRedisClient() {
  const store = new Map();
  return {
    get: async (key) => store.get(key) || null,
    set: async (key, value, options) => { store.set(key, value); return 'OK'; },
    setEx: async (key, ttl, value) => { store.set(key, value); return 'OK'; },
    del: async (key) => { store.delete(key); return 1; },
    exists: async (key) => store.has(key) ? 1 : 0,
    expire: async () => 1,
    incr: async (key) => {
      const val = parseInt(store.get(key) || '0') + 1;
      store.set(key, String(val));
      return val;
    },
    hSet: async (key, field, value) => { 
      const h = store.get(key) || {};
      h[field] = value;
      store.set(key, h);
      return 1;
    },
    hGet: async (key, field) => {
      const h = store.get(key);
      return h ? h[field] : null;
    },
    hGetAll: async (key) => store.get(key) || {},
    publish: async () => 0,
    subscribe: async () => {},
    isOpen: true,
    quit: async () => 'OK'
  };
}

module.exports = { initRedis, getRedis };
