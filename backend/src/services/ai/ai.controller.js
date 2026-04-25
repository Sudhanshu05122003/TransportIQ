const AIService = require('./ai.service');
const { successResponse, errorResponse } = require('../../utils/response');

class AIController {
  async query(req, res) {
    try {
      const { query } = req.body;
      if (!query) return errorResponse(res, 'Query is required');

      const response = await AIService.processQuery(req.userId, query);
      return successResponse(res, response);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getSuggestions(req, res) {
    try {
      // Basic context-aware suggestions
      const suggestions = [
        "What's my most profitable route?",
        "Estimate fare from Mumbai to Delhi",
        "Check for shipment delays",
        "How can I optimize my routes?"
      ];
      return successResponse(res, suggestions);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async predictDemand(req, res) {
    try {
      const { region } = req.query;
      const prediction = await AIService.predictDemand(region || 'IN-WEST-1');
      return successResponse(res, prediction);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async recommendRoute(req, res) {
    try {
      const { shipmentId } = req.params;
      const recommendation = await AIService.recommendOptimalRoute(shipmentId);
      return successResponse(res, recommendation);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}


module.exports = new AIController();
