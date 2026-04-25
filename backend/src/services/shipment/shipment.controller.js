const shipmentService = require('./shipment.service');

const shipmentController = {
  async create(req, res, next) {
    try {
      const result = await shipmentService.createShipment(req.userId, req.body);
      res.status(201).json({ success: true, message: 'Shipment created', data: result });
    } catch (error) { next(error); }
  },

  async getEstimate(req, res, next) {
    try {
      const result = await shipmentService.getFareEstimate(req.body);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async getOne(req, res, next) {
    try {
      const shipment = await shipmentService.getShipment(req.params.id, req.userId, req.userRole);
      res.json({ success: true, data: shipment });
    } catch (error) { next(error); }
  },

  async list(req, res, next) {
    try {
      const result = await shipmentService.listShipments({
        userId: req.userId,
        userRole: req.userRole,
        status: req.query.status,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        search: req.query.search
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async updateStatus(req, res, next) {
    try {
      const shipment = await shipmentService.updateStatus(req.params.id, req.body.status, req.userId, req.userRole);
      res.json({ success: true, message: 'Status updated', data: shipment });
    } catch (error) { next(error); }
  },

  async assignDriver(req, res, next) {
    try {
      const result = await shipmentService.assignDriver(req.params.id, req.body.driver_id, req.body.vehicle_id);
      res.json({ success: true, message: 'Driver assigned', data: result });
    } catch (error) { next(error); }
  },

  async autoAssign(req, res, next) {
    try {
      const result = await shipmentService.autoAssign(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async getStats(req, res, next) {
    try {
      const stats = await shipmentService.getStats(req.userId, req.userRole);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  },

  async requestPODOTP(req, res, next) {
    try {
      const result = await shipmentService.requestPODOTP(req.params.id);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  },

  async verifyPOD(req, res, next) {
    try {
      const result = await shipmentService.verifyPOD(req.params.id, req.body);
      res.json({ success: true, message: 'Delivery confirmed', data: result });
    } catch (error) { next(error); }
  }
};


module.exports = shipmentController;
