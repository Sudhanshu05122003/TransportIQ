const { calculateDistance } = require('../../utils/distance');
const { Trip, Shipment, User } = require('../../models');
const { Op } = require('sequelize');

class OptimizationService {
  /**
   * Greedy TSP Algorithm for Route Optimization
   * Re-sequences stops to minimize total travel distance
   */
  optimizeRoute(pickup, stops, drop) {
    if (!stops || stops.length <= 1) return stops;

    let unvisited = [...stops];
    let optimizedStops = [];
    let currentPoint = pickup;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = calculateDistance(
        currentPoint.lat, currentPoint.lng,
        unvisited[0].lat, unvisited[0].lng
      );

      for (let i = 1; i < unvisited.length; i++) {
        const dist = calculateDistance(
          currentPoint.lat, currentPoint.lng,
          unvisited[i].lat, unvisited[i].lng
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      const nextStop = unvisited.splice(nearestIndex, 1)[0];
      optimizedStops.push(nextStop);
      currentPoint = nextStop;
    }

    return optimizedStops;
  }

  /**
   * Calculate Load Score for a driver
   * Factors: Active trips, distance covered today, remaining duty hours
   */
  async getDriverLoadScore(driverId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get active trips
    const activeTripsCount = await Trip.count({
      where: {
        driver_id: driverId,
        status: { [Op.notIn]: ['completed', 'cancelled'] }
      }
    });

    // Get completed trips today to calculate fatigue
    const tripsToday = await Trip.findAll({
      where: {
        driver_id: driverId,
        status: 'completed',
        end_time: { [Op.gte]: today }
      }
    });

    let distanceToday = 0;
    tripsToday.forEach(t => {
      // In a real app, we'd use actual distance from location history
      // Here we use the estimated distance from the trip record
      distanceToday += parseFloat(t.distance_km || 0);
    });

    // Score: 0 (Fresh) to 100 (Overloaded)
    let score = (activeTripsCount * 40) + (distanceToday / 10); // 40 pts per active trip, 1 pt per 10km
    
    return Math.min(Math.round(score), 100);
  }

  /**
   * Load-balanced Driver Selection
   * Filters the nearest drivers by their load score
   */
  async balanceLoad(drivers) {
    const balancedDrivers = await Promise.all(drivers.map(async (item) => {
      const loadScore = await this.getDriverLoadScore(item.driver.id);
      return {
        ...item,
        loadScore,
        // Combined score: lower is better (distance + load penalty)
        rankScore: item.distance + (loadScore * 0.5) 
      };
    }));

    return balancedDrivers.sort((a, b) => a.rankScore - b.rankScore);
  }
}

module.exports = new OptimizationService();
