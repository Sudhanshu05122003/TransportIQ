const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  trip_id: { type: DataTypes.UUID, allowNull: false },
  driver_id: { type: DataTypes.UUID, allowNull: false },
  lat: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  lng: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  speed: DataTypes.DECIMAL(5, 2),
  heading: DataTypes.DECIMAL(5, 2),
  accuracy: DataTypes.DECIMAL(8, 2),
  altitude: DataTypes.DECIMAL(10, 2),
  recorded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'locations',
  timestamps: false,
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['driver_id'] },
    { fields: ['recorded_at'] }
  ]
});

module.exports = Location;
