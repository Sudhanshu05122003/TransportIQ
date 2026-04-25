const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transporter_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  driver_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  registration_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  vehicle_type: {
    type: DataTypes.ENUM('mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated'),
    allowNull: false
  },
  make: DataTypes.STRING(100),
  model: DataTypes.STRING(100),
  year: DataTypes.INTEGER,
  color: DataTypes.STRING(50),
  capacity_tons: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false
  },
  capacity_volume_cbm: DataTypes.DECIMAL(8, 2),
  insurance_number: DataTypes.STRING(50),
  insurance_expiry: DataTypes.DATEONLY,
  fitness_expiry: DataTypes.DATEONLY,
  permit_number: DataTypes.STRING(50),
  permit_expiry: DataTypes.DATEONLY,
  rc_doc_url: DataTypes.TEXT,
  insurance_doc_url: DataTypes.TEXT,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  current_lat: DataTypes.DECIMAL(10, 8),
  current_lng: DataTypes.DECIMAL(11, 8)
}, {
  tableName: 'vehicles',
  timestamps: true,
  underscored: true
});

module.exports = Vehicle;
