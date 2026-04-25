const router = require('express').Router();
const notificationController = require('./notification.controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllRead);

module.exports = router;
