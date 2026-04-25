const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Dispute = sequelize.define('Dispute', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipment_id: { type: DataTypes.UUID, allowNull: false },
  raised_by: { type: DataTypes.UUID, allowNull: false },
  reason: {
    type: DataTypes.ENUM('damage', 'delay', 'misconduct', 'payment_issue', 'lost_cargo', 'other'),
    allowNull: false
  },
  description: { type: DataTypes.TEXT, allowNull: false },
  evidence_urls: DataTypes.JSONB, // Array of photo/doc links
  status: {
    type: DataTypes.ENUM('open', 'under_investigation', 'resolved', 'rejected'),
    defaultValue: 'open'
  },
  resolution_type: {
    type: DataTypes.ENUM('refund', 'penalty_applied', 'dismissed', 'compensation'),
    allowNull: true
  },
  resolution_notes: DataTypes.TEXT,
  resolved_by: DataTypes.UUID,
  resolved_at: DataTypes.DATE
}, {
  tableName: 'disputes',
  timestamps: true,
  underscored: true
});

module.exports = Dispute;
