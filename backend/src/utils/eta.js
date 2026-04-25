const { HistoricalTripData } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');


// Average speed by vehicle type (km/h) for Indian road conditions
const VEHICLE_SPEEDS = {

  mini_truck: { city: 25, highway: 45, night: 35 },
  lcv: { city: 22, highway: 42, night: 32 },
  hcv: { city: 18, highway: 38, night: 30 },
  trailer: { city: 15, highway: 35, night: 28 },
  container: { city: 15, highway: 35, night: 28 },
  tanker: { city: 18, highway: 38, night: 30 },
  refrigerated: { city: 20, highway: 40, night: 30 }
};

// Time-of-day speed multipliers (IST hours)
const TIME_MULTIPLIERS = {
  0: 1.3, 1: 1.4, 2: 1.4, 3: 1.3, 4: 1.2, 5: 1.1,   // Night: faster
  6: 0.9, 7: 0.7, 8: 0.6, 9: 0.7, 10: 0.8, 11: 0.85,  // Morning rush
  12: 0.85, 13: 0.9, 14: 0.9, 15: 0.85, 16: 0.8,       // Afternoon
  17: 0.6, 18: 0.55, 19: 0.6, 20: 0.7, 21: 0.9,        // Evening rush
  22: 1.1, 23: 1.2                                        // Late night
};

/**
 * Predict ETA based on distance, vehicle type, and current time
 * @returns {Object} { eta_minutes, eta_hours, arrival_time, confidence }
 */
async function predictETA(distanceKm, vehicleType = 'lcv', currentTime = null, pickupCity = null, dropCity = null) {
  const now = currentTime || new Date();
  const hour = now.getHours();
  let historicalTrafficFactor = 1.0;

  // 1. Check historical data for this route/hour
  if (pickupCity && dropCity) {
    try {
      const historical = await HistoricalTripData.findOne({
        where: {
          pickup_city: pickupCity,
          drop_city: dropCity,
          hour_of_day: hour
        },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('traffic_factor')), 'avg_traffic']
        ]
      });
      if (historical && historical.getDataValue('avg_traffic')) {
        historicalTrafficFactor = parseFloat(historical.getDataValue('avg_traffic'));
      }
    } catch (err) { /* ignore and use defaults */ }
  }

  const speeds = VEHICLE_SPEEDS[vehicleType] || VEHICLE_SPEEDS.lcv;
  const timeMultiplier = (TIME_MULTIPLIERS[hour] || 0.8) * (1 / historicalTrafficFactor);


  // Determine road type based on distance
  let baseSpeed;
  if (distanceKm < 30) {
    baseSpeed = speeds.city;
  } else if (distanceKm < 200) {
    // Mix of city and highway
    const cityPortion = 30; // Assume 30 km in city
    const highwayPortion = distanceKm - 30;
    const cityTime = cityPortion / speeds.city;
    const highwayTime = highwayPortion / speeds.highway;
    const totalTime = cityTime + highwayTime;
    baseSpeed = distanceKm / totalTime;
  } else {
    // Long haul - mostly highway
    const cityPortion = 50;
    const highwayPortion = distanceKm - 50;
    const cityTime = cityPortion / speeds.city;
    const highwayTime = highwayPortion / speeds.highway;
    baseSpeed = distanceKm / (cityTime + highwayTime);
  }

  // Apply time-of-day multiplier
  const effectiveSpeed = baseSpeed * timeMultiplier;

  // Calculate ETA
  const etaHours = distanceKm / effectiveSpeed;
  const etaMinutes = Math.ceil(etaHours * 60);

  // Add buffer for rest stops on long trips (30 min every 4 hours)
  const restStops = Math.floor(etaHours / 4);
  const totalMinutes = etaMinutes + (restStops * 30);

  // Calculate arrival time
  const arrivalTime = new Date(now.getTime() + totalMinutes * 60000);

  // Confidence level based on distance
  let confidence;
  if (distanceKm < 50) confidence = 0.85;
  else if (distanceKm < 200) confidence = 0.75;
  else if (distanceKm < 500) confidence = 0.65;
  else confidence = 0.55;

  return {
    eta_minutes: totalMinutes,
    eta_hours: Math.round(totalMinutes / 60 * 10) / 10,
    arrival_time: arrivalTime.toISOString(),
    effective_speed_kmh: Math.round(effectiveSpeed * 10) / 10,
    rest_stops: restStops,
    confidence: confidence,
    distance_km: distanceKm
  };
}

module.exports = { predictETA };
