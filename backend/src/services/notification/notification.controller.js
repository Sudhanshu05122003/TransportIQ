const notificationService = require('./notification.service');

const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const result = await notificationService.getNotifications(
        req.userId,
        parseInt(req.query.page) || 1,
        parseInt(req.query.limit) || 20
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async markAsRead(req, res, next) {
    try {
      await notificationService.markAsRead(req.userId, req.params.id);
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) { next(error); }
  },

  async markAllRead(req, res, next) {
    try {
      await notificationService.markAllRead(req.userId);
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) { next(error); }
  }
};

module.exports = notificationController;
