const MarketplaceService = require('./marketplace.service');
const { successResponse, errorResponse } = require('../../utils/response');

class MarketplaceController {
  async placeBid(req, res) {
    try {
      const bid = await MarketplaceService.placeBid(req.userId, req.body);
      return successResponse(res, bid, 'Bid placed successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getBids(req, res) {
    try {
      const bids = await MarketplaceService.getBidsForShipment(req.params.shipmentId);
      return successResponse(res, bids);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async acceptBid(req, res) {
    try {
      const result = await MarketplaceService.acceptBid(req.userId, req.params.bidId);
      return successResponse(res, result, 'Bid accepted and shipment assigned');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getMarketplace(req, res) {
    try {
      const shipments = await MarketplaceService.getMarketplaceShipments();
      return successResponse(res, shipments);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new MarketplaceController();
