const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Settlement = sequelize.define('Settlement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: { type: DataTypes.UUID, allowNull: false }, // Transporter/Driver
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  commission_deducted: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
  net_payable: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'INR' },
  status: { 
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  payout_method: { type: DataTypes.STRING, defaultValue: 'bank_transfer' },
  bank_reference: DataTypes.STRING,
  processed_at: DataTypes.DATE,
  metadata: DataTypes.JSONB,
  batch_id: DataTypes.STRING // For bulk payouts
}, {
  tableName: 'settlements',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['batch_id'] }
  ]
});

module.exports = Settlement;
