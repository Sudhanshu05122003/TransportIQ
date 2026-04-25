const { Shipment, Trip, User, sequelize } = require('../../../models');
const { Op } = require('sequelize');

/**
 * Elite Optimization Engine
 * Implements heuristics for Vehicle Routing Problem (VRP)
 */
class OptimizationEngine {
  /**
   * Solve Multi-Shipment VRP
   * Uses Clarke-Wright Savings Algorithm to group shipments
   */
  async optimizeNetwork(region) {
    const pendingShipments = await Shipment.findAll({
      where: { status: 'pending', region: region || 'IN-WEST-1' },
      attributes: ['id', 'pickup_city', 'drop_city', 'weight', 'pickup_lat', 'pickup_lng', 'drop_lat', 'drop_lng']
    });

    if (pendingShipments.length < 2) return { message: 'Insufficient shipments for global optimization' };

    // 1. Define Central Hub (Simplified as mean of all pickup points)
    const hub = this.calculateHub(pendingShipments);

    // 2. Calculate "Savings" for each pair of shipments (i, j)
    // Savings(i, j) = Distance(Hub, i) + Distance(Hub, j) - Distance(i, j)
    const savings = [];
    for (let i = 0; i < pendingShipments.length; i++) {
      for (let j = i + 1; j < pendingShipments.length; j++) {
        const s = this.calculateSavings(hub, pendingShipments[i], pendingShipments[j]);
        savings.push({ i, j, value: s });
      }
    }

    // 3. Sort savings in descending order
    savings.sort((a, b) => b.value - a.value);

    // 4. Merge shipments into routes based on savings and constraints (Capacity, Time)
    const routes = this.mergeRoutes(savings, pendingShipments);

    return {
      hub,
      shipment_count: pendingShipments.length,
      optimized_routes: routes,
      summary: `Grouped ${pendingShipments.length} shipments into ${routes.length} optimal vehicle paths.`
    };
  }

  calculateHub(shipments) {
    const lat = shipments.reduce((acc, s) => acc + parseFloat(s.pickup_lat), 0) / shipments.length;
    const lng = shipments.reduce((acc, s) => acc + parseFloat(s.pickup_lng), 0) / shipments.length;
    return { lat, lng };
  }

  calculateSavings(hub, s1, s2) {
    const dHub1 = this.haversine(hub.lat, hub.lng, s1.pickup_lat, s1.pickup_lng);
    const dHub2 = this.haversine(hub.lat, hub.lng, s2.pickup_lat, s2.pickup_lng);
    const d12 = this.haversine(s1.pickup_lat, s1.pickup_lng, s2.pickup_lat, s2.pickup_lng);
    return dHub1 + dHub2 - d12;
  }

  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  mergeRoutes(savings, shipments) {
    const routes = shipments.map((s, index) => [index]);
    const MAX_LOAD = 5000; // 5 Tons max per cluster

    for (const s of savings) {
      const r1Idx = routes.findIndex(r => r.includes(s.i));
      const r2Idx = routes.findIndex(r => r.includes(s.j));

      if (r1Idx !== r2Idx && r1Idx !== -1 && r2Idx !== -1) {
        const r1 = routes[r1Idx];
        const r2 = routes[r2Idx];

        // Check Capacity Constraint
        const totalLoad = [...r1, ...r2].reduce((acc, idx) => acc + parseFloat(shipments[idx].weight || 0), 0);
        
        // Ensure connectivity (only merge if i or j are at the ends of their respective routes)
        const isEnd1 = r1[0] === s.i || r1[r1.length - 1] === s.i;
        const isEnd2 = r2[0] === s.j || r2[r2.length - 1] === s.j;

        if (totalLoad <= MAX_LOAD && isEnd1 && isEnd2) {
          // Merge r2 into r1
          const newRoute = [...r1, ...r2];
          routes.splice(Math.max(r1Idx, r2Idx), 1);
          routes.splice(Math.min(r1Idx, r2Idx), 1, newRoute);
        }
      }
    }

    return routes.map(r => r.map(idx => shipments[idx].id));
  }
}

module.exports = new OptimizationEngine();
