const trackingService = require('./tracking.service');

const trackingController = {
  async recordLocation(req, res, next) {
    try {
      const location = await trackingService.recordLocation(req.userId, req.params.tripId, req.body);
      res.json({ success: true, data: location });
    } catch (error) { next(error); }
  },

  async getTripLocations(req, res, next) {
    try {
      const locations = await trackingService.getTripLocations(req.params.tripId);
      res.json({ success: true, data: locations });
    } catch (error) { next(error); }
  },

  async getCurrentPosition(req, res, next) {
    try {
      const position = await trackingService.getCurrentPosition(req.params.tripId);
      res.json({ success: true, data: position });
    } catch (error) { next(error); }
  },

  async updateTripStatus(req, res, next) {
    try {
      const trip = await trackingService.updateTripStatus(req.userId, req.params.tripId, req.body.status);
      res.json({ success: true, message: 'Trip status updated', data: trip });
    } catch (error) { next(error); }
  },

  async getActiveTrip(req, res, next) {
    try {
      const trip = await trackingService.getActiveTrip(req.userId);
      res.json({ success: true, data: trip });
    } catch (error) { next(error); }
  }
};

module.exports = trackingController;
