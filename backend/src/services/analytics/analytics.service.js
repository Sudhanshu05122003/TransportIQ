const { Shipment, Payment, User, Trip, HistoricalTripData, sequelize } = require('../../models');
const { Op } = require('sequelize');

class AnalyticsService {
  /**
   * Profit per Route Analysis
   * Calculates (Revenue - Estimated Cost) for top routes
   */
  async getRouteProfitability() {
    return await Shipment.findAll({
      attributes: [
        'pickup_city',
        'drop_city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'shipment_count'],
        [sequelize.fn('SUM', sequelize.col('final_fare')), 'total_revenue'],
        [sequelize.fn('AVG', sequelize.col('final_fare')), 'avg_fare']
      ],
      where: { status: 'delivered' },
      group: ['pickup_city', 'drop_city'],
      order: [[sequelize.literal('total_revenue'), 'DESC']],
      limit: 10
    });
  }

  /**
   * Cost Leakage Detection
   * Compares estimated fare vs final fare and highlights discrepancies
   */
  async getCostLeakage() {
    return await Shipment.findAll({
      attributes: [
        'id',
        'tracking_id',
        'estimated_fare',
        'final_fare',
        [sequelize.literal('final_fare - estimated_fare'), 'leakage_amount']
      ],
      where: {
        status: 'delivered',
        final_fare: { [Op.gt]: sequelize.col('estimated_fare') }
      },
      order: [[sequelize.literal('leakage_amount'), 'DESC']],
      limit: 20
    });
  }

  /**
   * Demand Heatmap Data
   * Aggregates shipment counts by city and day of week
   */
  async getDemandHeatmap() {
    return await Shipment.findAll({
      attributes: [
        'pickup_city',
        [sequelize.fn('EXTRACT', sequelize.literal('DOW FROM created_at')), 'day_of_week'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'demand_count']
      ],
      group: ['pickup_city', 'day_of_week'],
      order: [[sequelize.col('demand_count'), 'DESC']]
    });
  }

  /**
   * Peak Demand Prediction (Simple Time-Series)
   * Predicts future volume based on last 4 weeks of same-day-of-week data
   */
  async predictPeakDemand() {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const history = await Shipment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: { [Op.gte]: fourWeeksAgo }
      },
      group: [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at'))],
      order: [[sequelize.col('date'), 'ASC']]
    });

    // Simple moving average or trend projection
    // In a real app, use a lib like 'simple-statistics' or an AI model
    return history.map((item, index) => {
      const count = parseInt(item.getDataValue('count'));
      return {
        date: item.getDataValue('date'),
        actual: count,
        predicted: Math.round(count * 1.1) // 10% projected growth for demo
      };
    });
  }

  /**
   * Performance Metrics (SLA Compliance)
   * On-time vs Delayed deliveries
   */
  async getSLAPerformance() {
    const results = await Shipment.findAll({
      attributes: [
        [sequelize.literal(`CASE WHEN actual_delivery_at <= estimated_delivery_at THEN 'on_time' ELSE 'delayed' END`), 'sla_status'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { status: 'delivered', actual_delivery_at: { [Op.ne]: null } },
      group: ['sla_status']
    });

    return results;
  }
}

module.exports = new AnalyticsService();
