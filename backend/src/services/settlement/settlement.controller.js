const SettlementService = require('./settlement.service');
const { successResponse, errorResponse } = require('../../utils/response');

class SettlementController {
  async list(req, res) {
    try {
      const data = await SettlementService.getSettlements(req.userId);
      return successResponse(res, data);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async runPayouts(req, res) {
    try {
      const result = await SettlementService.processBulkPayouts();
      return successResponse(res, result, 'Payout batch processed');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new SettlementController();
