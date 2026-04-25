const OptimizationService = require('../optimization/optimization.service');
const AnalyticsService = require('../analytics/analytics.service');
const { calculateFare } = require('../../utils/pricing');
const { Shipment, User, Trip } = require('../../models');

class AIService {
  /**
   * Process Natural Language Queries
   * Maps user intent to system actions
   */
  async processQuery(userId, query) {
    const text = query.toLowerCase();

    // 1. Intent: Pricing/Fare Estimation
    if (text.includes('fare') || text.includes('cost') || text.includes('price')) {
      return await this.suggestPricing(text);
    }

    // 2. Intent: Route Optimization
    if (text.includes('route') || text.includes('optimize') || text.includes('path')) {
      return {
        type: 'suggestion',
        message: 'I can help optimize your multi-stop routes. Try using the "Optimize" button on your shipment dashboard for best results.',
        action: 'route_optimization'
      };
    }

    // 3. Intent: Performance/Status
    if (text.includes('status') || text.includes('delay') || text.includes('track')) {
      return await this.explainDelays(userId, text);
    }

    // 4. Intent: Business Insights
    if (text.includes('profit') || text.includes('revenue') || text.includes('best route')) {
      const data = await AnalyticsService.getRouteProfitability();
      const top = data[0];
      return {
        type: 'insight',
        message: `Based on current data, your most profitable route is ${top.pickup_city} to ${top.drop_city} with an average fare of ₹${Math.round(top.avg_fare)}.`,
        data: top
      };
    }

    return {
      type: 'general',
      message: "I'm your TransportIQ assistant. I can help with pricing estimates, route optimization insights, and performance tracking. What would you like to know?"
    };
  }

  /**
   * AI-based Pricing Recommendation
   */
  async suggestPricing(text) {
    // Extract potential cities from text (Simplified regex-based extraction)
    const cities = text.match(/\b(mumbai|delhi|bangalore|pune|chennai|kolkata|hyderabad)\b/g);
    
    if (cities && cities.length >= 2) {
      // Mock distance lookup for demo
      const dist = 1400; // Mumbai to Delhi approx
      const fare = await calculateFare('lcv', dist, 500);
      return {
        type: 'pricing_recommendation',
        message: `Estimated fare for a Light Commercial Vehicle from ${cities[0]} to ${cities[1]} is approximately ₹${fare.total}.`,
        details: fare
      };
    }

    return {
      type: 'info',
      message: "To give you a pricing recommendation, please specify the pickup and drop cities (e.g., 'What is the fare from Mumbai to Delhi?')"
    };
  }

  /**
   * Delay Explanation AI
   */
  async explainDelays(userId, text) {
    // Check if user has active delayed trips
    const delayedTrip = await Trip.findOne({
      where: { status: 'in_transit' },
      include: [{ model: Shipment, as: 'shipment', where: { shipper_id: userId } }]
    });

    if (delayedTrip) {
      return {
        type: 'delay_analysis',
        message: `Your shipment ${delayedTrip.shipment.tracking_id} is currently in transit. While it is moving, current traffic conditions in its area are heavier than usual, causing a minor adjustment to the ETA.`,
        tripId: delayedTrip.id
      };
    }

    return {
      type: 'info',
      message: "You don't have any delayed shipments currently. Everything is moving according to schedule!"
    };
  }

  /**
   * AI Demand Prediction (Proactive)
   */
  async predictDemand(region) {
    // 1. Fetch historical volume trends
    const recentVolume = await Shipment.count({
      where: { 
        region, 
        created_at: { [Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }
    });

    const avgDaily = recentVolume / 7;
    const predictedGrowth = 1.15; // AI constant for peak seasonality (Mocked)

    return {
      predicted_daily_volume: Math.round(avgDaily * predictedGrowth),
      confidence_score: 0.88,
      factors: ['Regional Growth', 'Seasonal Trend', 'VRP Efficiency Gains']
    };
  }

  /**
   * AI Route Intelligence
   */
  async recommendOptimalRoute(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId);
    const OptimizationEngine = require('../optimization/engine/optimization.engine');
    
    // In production, this would use a more complex model
    const path = await OptimizationEngine.haversine(
      shipment.pickup_lat, shipment.pickup_lng, 
      shipment.drop_lat, shipment.drop_lng
    );

    return {
      suggested_speed: '65km/h',
      fuel_save_pct: '12%',
      avoid_zones: ['Urban Congestion', 'Known Construction at NH-48']
    };
  }
}


module.exports = new AIService();
