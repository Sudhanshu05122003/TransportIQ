const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: { type: DataTypes.UUID, allowNull: false },
  type: {
    type: DataTypes.ENUM('shipment_update', 'payment', 'trip_update', 'system', 'promotion'),
    defaultValue: 'system'
  },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  data: { type: DataTypes.JSONB, defaultValue: {} },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  read_at: DataTypes.DATE
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

const PricingRule = sequelize.define('PricingRule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vehicle_type: {
    type: DataTypes.ENUM('mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated'),
    allowNull: false
  },
  base_fare: { type: DataTypes.DECIMAL(10, 2), defaultValue: 500 },
  per_km_rate: { type: DataTypes.DECIMAL(8, 2), defaultValue: 15 },
  per_kg_rate: { type: DataTypes.DECIMAL(8, 2), defaultValue: 2 },
  loading_charge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 200 },
  unloading_charge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 200 },
  min_fare: { type: DataTypes.DECIMAL(10, 2), defaultValue: 800 },
  surge_multiplier: { type: DataTypes.DECIMAL(4, 2), defaultValue: 1.00 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'pricing_rules',
  timestamps: true,
  underscored: true
});

const DriverEarning = sequelize.define('DriverEarning', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  driver_id: { type: DataTypes.UUID, allowNull: false },
  trip_id: DataTypes.UUID,
  shipment_id: DataTypes.UUID,
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  commission_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 10 },
  commission_amount: DataTypes.DECIMAL(12, 2),
  net_earning: DataTypes.DECIMAL(12, 2),
  status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
  paid_at: DataTypes.DATE
}, {
  tableName: 'driver_earnings',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = { Notification, PricingRule, DriverEarning };
