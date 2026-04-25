const { Notification } = require('../../models');
const { emitToUser } = require('../../config/socket');

class NotificationService {
  /**
   * Send a notification to a user
   */
  async notify(userId, type, title, message, data = {}) {
    try {
      // 1. Save to database
      const notification = await Notification.create({
        user_id: userId,
        type,
        title,
        message,
        data,
        is_read: false
      });

      // 2. Emit via Socket.IO for real-time update
      emitToUser(userId, 'notification:new', {
        id: notification.id,
        type,
        title,
        message,
        data,
        created_at: notification.created_at
      });

      // 3. Optional: Trigger SMS/Push (Placeholders)
      if (process.env.ENABLE_SMS === 'true') {
        await this.sendSMS(userId, message);
      }

      if (process.env.ENABLE_PUSH === 'true') {
        await this.sendPush(userId, title, message, data);
      }

      return notification;
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Don't throw error to avoid breaking main business logic
    }
  }

  /**
   * Get notifications for a user
   */
  async getNotifications(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await Notification.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });
    if (notification) {
      notification.is_read = true;
      await notification.save();
    }
    return notification;
  }

  /**
   * Mark all as read
   */
  async markAllRead(userId) {
    return await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
  }

  // Placeholder for SMS
  async sendSMS(userId, message) {
    console.log(`[SMS] Sending to User ${userId}: ${message}`);
    // Integration with Twilio/Msg91 would go here
  }

  // Placeholder for Push
  async sendPush(userId, title, message, data) {
    console.log(`[PUSH] Sending to User ${userId}: ${title} - ${message}`);
    // Integration with Firebase Cloud Messaging (FCM) would go here
  }
}

module.exports = new NotificationService();
