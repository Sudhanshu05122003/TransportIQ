const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShipmentDocument = sequelize.define('ShipmentDocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipment_id: { type: DataTypes.UUID, allowNull: false },
  document_type: {
    type: DataTypes.ENUM('invoice', 'lorry_receipt', 'eway_bill', 'insurance', 'kyc', 'pod_copy'),
    allowNull: false
  },
  document_number: DataTypes.STRING,
  file_url: { type: DataTypes.TEXT, allowNull: false },
  file_type: DataTypes.STRING, // pdf, jpg, png
  metadata: DataTypes.JSONB,
  uploaded_by: DataTypes.UUID,
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verified_at: DataTypes.DATE,
  verified_by: DataTypes.UUID
}, {
  tableName: 'shipment_documents',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['shipment_id'] },
    { fields: ['document_type'] }
  ]
});

module.exports = ShipmentDocument;
