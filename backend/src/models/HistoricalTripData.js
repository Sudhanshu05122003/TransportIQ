const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HistoricalTripData = sequelize.define('HistoricalTripData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  pickup_city: DataTypes.STRING,
  drop_city: DataTypes.STRING,
  vehicle_type: DataTypes.STRING,
  distance_km: DataTypes.DECIMAL(10, 2),
  actual_duration_minutes: DataTypes.INTEGER,
  hour_of_day: DataTypes.INTEGER,
  day_of_week: DataTypes.INTEGER,
  traffic_factor: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 1.0
  },
  trip_id: DataTypes.UUID
}, {
  tableName: 'historical_trip_data',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['pickup_city', 'drop_city'] },
    { fields: ['vehicle_type'] },
    { fields: ['hour_of_day'] }
  ]
});

module.exports = HistoricalTripData;
