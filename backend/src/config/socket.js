const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { getRedis } = require('./redis');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.userRole})`);
    const redis = getRedis();

    // Join user's personal room
    socket.join(`user:${socket.userId}`);
    socket.join(`role:${socket.userRole}`);

    // Driver-specific: handle location updates
    if (socket.userRole === 'driver') {
      // Add to online drivers set
      redis.sAdd('online_drivers', socket.userId);

      socket.on('driver:location', async (data) => {
        const { lat, lng, speed, heading, tripId } = data;

        // Cache latest position in Redis
        await redis.hSet(`driver:${socket.userId}:location`, 'lat', String(lat));
        await redis.hSet(`driver:${socket.userId}:location`, 'lng', String(lng));
        await redis.hSet(`driver:${socket.userId}:location`, 'speed', String(speed || 0));
        await redis.hSet(`driver:${socket.userId}:location`, 'heading', String(heading || 0));
        await redis.hSet(`driver:${socket.userId}:location`, 'timestamp', new Date().toISOString());

        // Broadcast to shipment tracking room
        if (tripId) {
          io.to(`trip:${tripId}`).emit('tracking:location', {
            driverId: socket.userId,
            lat,
            lng,
            speed,
            heading,
            timestamp: new Date().toISOString()
          });
        }

        // Broadcast to admin room
        io.to('role:admin').emit('driver:moved', {
          driverId: socket.userId,
          lat,
          lng,
          speed
        });
      });

      // Driver status toggle
      socket.on('driver:status', async (data) => {
        const { isOnline } = data;
        await redis.hSet(`driver:${socket.userId}:status`, 'online', String(isOnline));
        
        if (isOnline) {
          await redis.sAdd('online_drivers', socket.userId);
        } else {
          await redis.sRem('online_drivers', socket.userId);
        }

        io.to('role:admin').emit('driver:statusChanged', {
          driverId: socket.userId,
          isOnline
        });
      });
    }

    // Join shipment tracking room
    socket.on('tracking:join', (data) => {
      const { tripId } = data;
      socket.join(`trip:${tripId}`);
      console.log(`📍 User ${socket.userId} tracking trip ${tripId}`);
    });

    // Leave shipment tracking room
    socket.on('tracking:leave', (data) => {
      const { tripId } = data;
      socket.leave(`trip:${tripId}`);
    });

    // Notifications
    socket.on('notification:read', async (data) => {
      const { notificationId } = data;
      // Mark notification as read (handled by API)
    });

    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.userId}`);
      if (socket.userRole === 'driver') {
        await redis.hSet(`driver:${socket.userId}:status`, 'online', 'false');
        await redis.sRem('online_drivers', socket.userId);
      }
    });

  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

// Emit to a specific user
function emitToUser(userId, event, data) {
  if (io) io.to(`user:${userId}`).emit(event, data);
}

// Emit to a role group
function emitToRole(role, event, data) {
  if (io) io.to(`role:${role}`).emit(event, data);
}

// Emit to a trip tracking room
function emitToTrip(tripId, event, data) {
  if (io) io.to(`trip:${tripId}`).emit(event, data);
}

module.exports = { initSocket, getIO, emitToUser, emitToRole, emitToTrip };
