const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  warehouse_id: { type: DataTypes.UUID, allowNull: false },
  sku_code: { type: DataTypes.STRING, allowNull: false },
  item_name: { type: DataTypes.STRING, allowNull: false },
  category: DataTypes.STRING,
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  unit: { type: DataTypes.STRING, defaultValue: 'pcs' },
  batch_number: DataTypes.STRING,
  expiry_date: DataTypes.DATE,
  reorder_level: { type: DataTypes.INTEGER, defaultValue: 10 }
}, {
  tableName: 'inventory',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['warehouse_id', 'sku_code', 'batch_number'] }
  ]
});

module.exports = Inventory;
