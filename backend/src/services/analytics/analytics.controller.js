const AnalyticsService = require('./analytics.service');
const { successResponse, errorResponse } = require('../../utils/response');

class AnalyticsController {
  async getDashboard(req, res) {
    try {
      const [profitability, leakage, heatmap, peak, sla] = await Promise.all([
        AnalyticsService.getRouteProfitability(),
        AnalyticsService.getCostLeakage(),
        AnalyticsService.getDemandHeatmap(),
        AnalyticsService.predictPeakDemand(),
        AnalyticsService.getSLAPerformance()
      ]);

      return successResponse(res, {
        profitability,
        leakage,
        heatmap,
        peak_prediction: peak,
        sla_performance: sla
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getRouteProfit(req, res) {
    try {
      const data = await AnalyticsService.getRouteProfitability();
      return successResponse(res, data);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new AnalyticsController();
