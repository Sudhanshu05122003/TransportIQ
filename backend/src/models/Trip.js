const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipment_id: { type: DataTypes.UUID, allowNull: false },
  driver_id: { type: DataTypes.UUID, allowNull: false },
  vehicle_id: { type: DataTypes.UUID, allowNull: false },
  status: {
    type: DataTypes.ENUM('assigned', 'en_route_pickup', 'at_pickup', 'in_transit', 'at_drop', 'completed', 'cancelled'),
    defaultValue: 'assigned'
  },
  route_polyline: DataTypes.TEXT,
  planned_route: DataTypes.JSONB,
  current_lat: DataTypes.DECIMAL(10, 8),
  current_lng: DataTypes.DECIMAL(11, 8),
  current_speed: DataTypes.DECIMAL(5, 2),
  current_heading: DataTypes.DECIMAL(5, 2),
  distance_covered_km: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  estimated_arrival: DataTypes.DATE,
  start_time: DataTypes.DATE,
  pickup_reached_at: DataTypes.DATE,
  pickup_completed_at: DataTypes.DATE,
  drop_reached_at: DataTypes.DATE,
  end_time: DataTypes.DATE
}, {
  tableName: 'trips',
  timestamps: true,
  underscored: true
});

module.exports = Trip;
