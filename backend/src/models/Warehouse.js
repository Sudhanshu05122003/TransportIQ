const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  pincode: { type: DataTypes.STRING(6), allowNull: false },
  lat: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  lng: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  capacity_sqft: DataTypes.DECIMAL(10, 2),
  available_sqft: DataTypes.DECIMAL(10, 2),
  manager_id: DataTypes.UUID,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'warehouses',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['code'] },
    { fields: ['city'] }
  ]
});

module.exports = Warehouse;
