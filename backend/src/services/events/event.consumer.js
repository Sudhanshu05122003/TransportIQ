const { consumer } = require('../../config/kafka');
const NotificationService = require('../notification/notification.service');
const AnalyticsService = require('../analytics/analytics.service');

const TOPICS = [
  'shipment.created',
  'driver.assigned',
  'payment.completed',
  'trip.started',
  'trip.completed'
];

async function startEventConsumers() {
  try {
    await consumer.subscribe({ topics: TOPICS, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        console.log(`📩 Kafka Event [${topic}]:`, payload.trackingId || payload.shipmentId);

        switch (topic) {
          case 'shipment.created':
            // Trigger auto-matching in background
            // Handle internal notifications
            break;
          
          case 'driver.assigned':
            // Notify shipper
            // await NotificationService.sendNotification(...)
            break;

          case 'payment.completed':
            // Generate invoice
            // Update financial analytics
            break;

          case 'trip.completed':
            // Trigger feedback request
            // Mark vehicle as available
            break;

          default:
            console.log(`🤷 Unknown topic: ${topic}`);
        }
      },
    });
  } catch (error) {
    console.error('❌ Kafka Consumer Error:', error.message);
  }
}

module.exports = { startEventConsumers };
