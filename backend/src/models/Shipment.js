const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tracking_id: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  shipper_id: { type: DataTypes.UUID, allowNull: false },
  transporter_id: DataTypes.UUID,
  driver_id: DataTypes.UUID,
  vehicle_id: DataTypes.UUID,

  // Pickup
  pickup_address: { type: DataTypes.TEXT, allowNull: false },
  pickup_city: DataTypes.STRING(100),
  pickup_state: DataTypes.STRING(100),
  pickup_pincode: DataTypes.STRING(6),
  pickup_lat: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  pickup_lng: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  pickup_contact_name: DataTypes.STRING(100),
  pickup_contact_phone: DataTypes.STRING(15),

  // Drop
  drop_address: { type: DataTypes.TEXT, allowNull: false },
  drop_city: DataTypes.STRING(100),
  drop_state: DataTypes.STRING(100),
  drop_pincode: DataTypes.STRING(6),
  drop_lat: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  drop_lng: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  drop_contact_name: DataTypes.STRING(100),
  drop_contact_phone: DataTypes.STRING(15),

  // Multi-stop
  stops: { type: DataTypes.JSONB, defaultValue: [] },

  // Cargo
  weight_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  material_type: DataTypes.STRING(100),
  material_description: DataTypes.TEXT,
  num_packages: { type: DataTypes.INTEGER, defaultValue: 1 },
  is_fragile: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_hazardous: { type: DataTypes.BOOLEAN, defaultValue: false },

  vehicle_type_required: {
    type: DataTypes.ENUM('mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated'),
    allowNull: false
  },

  // Bidding
  selection_method: {
    type: DataTypes.ENUM('auto_assign', 'manual', 'bidding'),
    defaultValue: 'auto_assign'
  },
  bidding_ends_at: DataTypes.DATE,
  winning_bid_id: DataTypes.UUID,
  region: { type: DataTypes.STRING, defaultValue: 'IN-WEST-1' },
  organization_id: DataTypes.UUID, // SaaS Isolation

  // Status
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },

  // POD
  pod_otp: DataTypes.STRING(6),
  pod_image_url: DataTypes.TEXT,
  pod_signature_url: DataTypes.TEXT,
  actual_delivery_at: DataTypes.DATE,

  // Pricing
  distance_km: DataTypes.DECIMAL(10, 2),
  estimated_duration_minutes: DataTypes.INTEGER,
  estimated_fare: DataTypes.DECIMAL(12, 2),
  final_fare: DataTypes.DECIMAL(12, 2),

  // Payment
  payment_method: {
    type: DataTypes.ENUM('upi', 'card', 'wallet', 'cod', 'bank_transfer'),
    defaultValue: 'upi'
  },
  is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },

  // Schedule
  pickup_scheduled_at: DataTypes.DATE,
  pickup_actual_at: DataTypes.DATE,
  delivered_at: DataTypes.DATE,

  // Notes
  shipper_notes: DataTypes.TEXT,
  driver_notes: DataTypes.TEXT,
  cancellation_reason: DataTypes.TEXT
}, {
  tableName: 'shipments',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['tracking_id'] },
    { fields: ['status'] },
    { fields: ['shipper_id'] },
    { fields: ['driver_id'] },
    { fields: ['transporter_id'] },
    { fields: ['pickup_city'] },
    { fields: ['drop_city'] }
  ]
});


module.exports = Shipment;
