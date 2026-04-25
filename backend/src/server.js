require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const { initDatabase } = require('./config/database');
const { initRedis } = require('./config/redis');
const { initSocket } = require('./config/socket');
const { initKafka } = require('./config/kafka');
const { startEventConsumers } = require('./services/events/event.consumer');

const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./services/auth/auth.routes');
const shipmentRoutes = require('./services/shipment/shipment.routes');
const trackingRoutes = require('./services/tracking/tracking.routes');
const paymentRoutes = require('./services/payment/payment.routes');
const fleetRoutes = require('./services/fleet/fleet.routes');
const driverRoutes = require('./services/driver/driver.routes');
const pricingRoutes = require('./services/pricing/pricing.routes');
const adminRoutes = require('./services/admin/admin.routes');
const notificationRoutes = require('./services/notification/notification.routes');
const optimizationRoutes = require('./services/optimization/optimization.routes');
const warehouseRoutes = require('./services/warehouse/warehouse.routes');
const marketplaceRoutes = require('./services/marketplace/marketplace.routes');
const analyticsRoutes = require('./services/analytics/analytics.routes');
const aiRoutes = require('./services/ai/ai.routes');
const documentRoutes = require('./services/document/document.routes');
const walletRoutes = require('./services/wallet/wallet.routes');
const settlementRoutes = require('./services/settlement/settlement.routes');










const app = express();
const server = http.createServer(app);

// ============================================
// MIDDLEWARE
// ============================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TransportIQ API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/optimization', optimizationRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/settlements', settlementRoutes);









// ============================================
// ERROR HANDLING
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ PostgreSQL connected');

    // Initialize Redis
    await initRedis();
    console.log('✅ Redis connected');

    // Initialize Kafka
    await initKafka();
    await startEventConsumers();

    // Initialize Socket.IO
    initSocket(server);

    console.log('✅ Socket.IO initialized');

    server.listen(PORT, () => {
      console.log(`\n🚀 TransportIQ API running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app, server };
