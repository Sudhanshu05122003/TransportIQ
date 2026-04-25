const driverService = require('./driver.service');

const driverController = {
  async toggleOnline(req, res, next) {
    try {
      const result = await driverService.toggleOnline(req.userId, req.body.is_online);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async updateLocation(req, res, next) {
    try {
      const result = await driverService.updateLocation(req.userId, req.body.lat, req.body.lng);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async acceptTrip(req, res, next) {
    try {
      const trip = await driverService.acceptTrip(req.userId, req.params.tripId);
      res.json({ success: true, message: 'Trip accepted', data: trip });
    } catch (error) { next(error); }
  },

  async rejectTrip(req, res, next) {
    try {
      const result = await driverService.rejectTrip(req.userId, req.params.tripId, req.body.reason);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  },

  async getEarnings(req, res, next) {
    try {
      const result = await driverService.getEarnings(req.userId, req.query.period);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async getTripHistory(req, res, next) {
    try {
      const result = await driverService.getTripHistory(req.userId, parseInt(req.query.page) || 1);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async uploadKYC(req, res, next) {
    try {
      const driver = await driverService.uploadKYC(req.userId, req.body);
      res.json({ success: true, message: 'KYC submitted', data: driver });
    } catch (error) { next(error); }
  }
};

module.exports = driverController;
