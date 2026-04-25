const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  warehouse_id: { type: DataTypes.UUID, allowNull: false },
  inventory_id: { type: DataTypes.UUID, allowNull: false },
  shipment_id: DataTypes.UUID,
  type: {
    type: DataTypes.ENUM('inbound', 'outbound', 'adjustment', 'transfer'),
    allowNull: false
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  reference_number: DataTypes.STRING,
  notes: DataTypes.TEXT,
  performed_by: DataTypes.UUID
}, {
  tableName: 'stock_movements',
  timestamps: true,
  underscored: true
});

module.exports = StockMovement;
