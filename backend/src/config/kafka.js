const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'transportiq-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'transportiq-group' });

async function initKafka() {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected');
    
    await consumer.connect();
    console.log('✅ Kafka Consumer connected');
  } catch (error) {
    console.error('❌ Kafka connection failed:', error.message);
    // In dev, we might want to continue without Kafka
  }
}

async function produceEvent(topic, message, retryCount = 3) {
  try {
    await producer.send({
      topic,
      messages: [{ 
        value: JSON.stringify(message),
        headers: { 'retry-count': String(retryCount) }
      }]
    });
  } catch (error) {
    console.error(`❌ Failed to produce event to ${topic}:`, error.message);
    
    if (retryCount > 0) {
      console.log(`🔄 Retrying ${topic}... (${retryCount} left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await produceEvent(topic, message, retryCount - 1);
    }

    // Move to Dead Letter Queue (DLQ) after final failure
    console.error(`💀 Sending to DLQ: ${topic}.dlq`);
    await producer.send({
      topic: `${topic}.dlq`,
      messages: [{ value: JSON.stringify({ original_error: error.message, payload: message }) }]
    });
  }
}


module.exports = { initKafka, produceEvent, consumer, kafka };
