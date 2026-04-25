const { getRedis } = require('../../config/redis');
const { produceEvent } = require('../../config/kafka');
const OpsService = require('../ops/ops.service');

/**
 * Enterprise Tracking Service
 * Handles high-frequency GPS ingestion and offline sync reconciliation
 */
class TrackingService {
  /**
   * Process Bulk GPS Updates (Burst Sync)
   * Essential for syncing data from "Dark Zones" (highways with no network)
   */
  async processBulkTracking(driverId, points) {
    const redis = getRedis();
    const sortedPoints = points.sort((a, b) => a.timestamp - b.timestamp);
    const lastPoint = sortedPoints[sortedPoints.length - 1];

    // 1. Update Real-time State in Redis (Only the latest point)
    await redis.set(`driver:${driverId}:last_seen`, Date.now());
    await redis.set(`driver:${driverId}:location`, JSON.stringify({
      lat: lastPoint.lat,
      lng: lastPoint.lng,
      timestamp: lastPoint.timestamp
    }));

    // 2. Perform Fraud Check (GPS Spoofing) across the burst
    for (let i = 1; i < sortedPoints.length; i++) {
      await OpsService.detectGPSSpoofing(
        driverId,
        sortedPoints[i].lat,
        sortedPoints[i].lng,
        sortedPoints[i-1].lat,
        sortedPoints[i-1].lng,
        sortedPoints[i-1].timestamp
      );
    }

    // 3. Emit Kafka Events for each point to preserve full historical breadcrumbs
    for (const point of sortedPoints) {
      await produceEvent('tracking.location_update', {
        driverId,
        ...point
      });
    }

    return { synced_count: sortedPoints.length, last_sync: new Date() };
  }
}

module.exports = new TrackingService();
