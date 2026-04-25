const fleetService = require('./fleet.service');

const fleetController = {
  async addVehicle(req, res, next) {
    try {
      const vehicle = await fleetService.addVehicle(req.userId, req.body);
      res.status(201).json({ success: true, message: 'Vehicle added', data: vehicle });
    } catch (error) { next(error); }
  },

  async updateVehicle(req, res, next) {
    try {
      const vehicle = await fleetService.updateVehicle(req.userId, req.params.id, req.body);
      res.json({ success: true, message: 'Vehicle updated', data: vehicle });
    } catch (error) { next(error); }
  },

  async deleteVehicle(req, res, next) {
    try {
      const result = await fleetService.deleteVehicle(req.userId, req.params.id);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  },

  async listVehicles(req, res, next) {
    try {
      const result = await fleetService.listVehicles(req.userId, parseInt(req.query.page) || 1, parseInt(req.query.limit) || 20);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async assignDriver(req, res, next) {
    try {
      const vehicle = await fleetService.assignDriver(req.userId, req.params.id, req.body.driver_id);
      res.json({ success: true, message: 'Driver assigned', data: vehicle });
    } catch (error) { next(error); }
  },

  async getFleetStats(req, res, next) {
    try {
      const stats = await fleetService.getFleetStats(req.userId);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }
};

module.exports = fleetController;
