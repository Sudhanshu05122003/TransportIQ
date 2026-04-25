const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipment_id: { type: DataTypes.UUID, allowNull: false },
  transporter_id: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'INR' },
  vehicle_id: DataTypes.UUID,
  driver_id: DataTypes.UUID,
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: 'pending'
  },
  notes: DataTypes.TEXT,
  expiry_at: DataTypes.DATE
}, {
  tableName: 'bids',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['shipment_id'] },
    { fields: ['transporter_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Bid;
