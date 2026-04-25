const { User, Vehicle } = require('../models');
const { calculateDistance } = require('./distance');
const { getRedis } = require('../config/redis');
const OptimizationService = require('../services/optimization/optimization.service');
const { Op } = require('sequelize');

/**
 * Driver Matching Algorithm
 * Finds the nearest available driver based on:
 * 1. Redis cache for online drivers
 * 2. Real-time locations from Redis
 * 3. Load Balancing (Avoiding overloaded drivers)
 * 4. Fallback to DB if Redis fails
 */
async function findNearestDriver(pickupLat, pickupLng, vehicleType, excludeDriverIds = []) {

  const redis = getRedis();
  let onlineDriverIds = [];

  try {
    // 1. Get online drivers from Redis
    onlineDriverIds = await redis.sMembers('online_drivers');
  } catch (err) {
    console.warn('Redis error in matching, falling back to DB:', err.message);
  }

  const whereClause = {
    role: 'driver',
    is_active: true,
    is_verified: true
  };

  // If we have IDs from Redis, filter by them. Otherwise fallback to is_online=true in DB.
  if (onlineDriverIds && onlineDriverIds.length > 0) {
    whereClause.id = { [Op.in]: onlineDriverIds };
  } else {
    whereClause.is_online = true;
    whereClause.current_lat = { [Op.ne]: null };
  }

  if (excludeDriverIds.length > 0) {
    whereClause.id = { 
      [Op.and]: [
        whereClause.id || {},
        { [Op.notIn]: excludeDriverIds }
      ]
    };
  }

  const drivers = await User.findAll({
    where: whereClause,
    include: [{
      model: Vehicle,
      as: 'assignedVehicle',
      where: { vehicle_type: vehicleType, is_active: true },
      required: true
    }],
    attributes: ['id', 'first_name', 'last_name', 'phone', 'current_lat', 'current_lng', 'avatar_url']
  });

  if (drivers.length === 0) return null;

  // 2. Fetch real-time locations from Redis for these drivers
  const driversWithRealtimeData = await Promise.all(drivers.map(async (driver) => {
    let lat = parseFloat(driver.current_lat);
    let lng = parseFloat(driver.current_lng);

    try {
      const redisLocation = await redis.hGetAll(`driver:${driver.id}:location`);
      if (redisLocation && redisLocation.lat && redisLocation.lng) {
        lat = parseFloat(redisLocation.lat);
        lng = parseFloat(redisLocation.lng);
      }
    } catch (err) { /* ignore and use DB location */ }

    const distance = calculateDistance(pickupLat, pickupLng, lat, lng);
    
    return {
      driver: driver.toJSON(),
      distance,
      current_lat: lat,
      current_lng: lng,
      estimatedPickupMinutes: Math.ceil(distance / 30 * 60)
    };
  }));

  // 3. Sort by distance
  driversWithRealtimeData.sort((a, b) => a.distance - b.distance);

  // 4. Apply Load Balancing
  const balancedDrivers = await OptimizationService.balanceLoad(driversWithRealtimeData.slice(0, 10));

  return balancedDrivers.slice(0, 5);
}



/**
 * Auto-assign the nearest driver to a shipment
 */

async function autoAssignDriver(pickupLat, pickupLng, vehicleType) {
  const nearestDrivers = await findNearestDriver(pickupLat, pickupLng, vehicleType);
  if (!nearestDrivers || nearestDrivers.length === 0) return null;
  return nearestDrivers[0]; // Return the closest driver
}

module.exports = { findNearestDriver, autoAssignDriver };
