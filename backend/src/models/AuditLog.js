const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: DataTypes.UUID,
  action: { type: DataTypes.STRING, allowNull: false },
  module: { type: DataTypes.STRING, allowNull: false },
  resource_id: DataTypes.UUID,
  old_values: DataTypes.JSONB,
  new_values: DataTypes.JSONB,
  ip_address: DataTypes.STRING,
  user_agent: DataTypes.TEXT,
  status: { type: DataTypes.STRING, defaultValue: 'success' }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false, // Audit logs are immutable
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['module'] },
    { fields: ['resource_id'] }
  ]
});

module.exports = AuditLog;
