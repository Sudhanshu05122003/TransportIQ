const adminService = require('./admin.service');

const adminController = {
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  },

  async listUsers(req, res, next) {
    try {
      const result = await adminService.listUsers(
        req.query.role, parseInt(req.query.page) || 1,
        parseInt(req.query.limit) || 20, req.query.search
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async updateUser(req, res, next) {
    try {
      const user = await adminService.updateUser(req.params.id, req.body);
      res.json({ success: true, message: 'User updated', data: user });
    } catch (error) { next(error); }
  },

  async getAllShipments(req, res, next) {
    try {
      const result = await adminService.getAllShipments(
        parseInt(req.query.page) || 1, parseInt(req.query.limit) || 20,
        req.query.status, req.query.search
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
};

module.exports = adminController;
