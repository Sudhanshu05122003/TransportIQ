const { getRedis } = require('../../config/redis');
const { produceEvent } = require('../../config/kafka');
const OpsService = require('../ops/ops.service');
const { Shipment } = require('../../models');
const NotificationService = require('../notification/notification.service');

// Haversine distance utility function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

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

    // 4. Geofencing check for Arriving Soon alert
    const activeShipment = await Shipment.findOne({
      where: { driver_id: driverId, status: 'in_transit' }
    });

    if (activeShipment && !activeShipment.is_arriving_soon_alert_sent) {
      const distance = getDistanceFromLatLonInKm(
        lastPoint.lat, lastPoint.lng,
        activeShipment.drop_lat, activeShipment.drop_lng
      );
      
      if (distance <= 5.0) { // within 5km
        await NotificationService.notify(
          activeShipment.shipper_id,
          'shipment_arriving',
          'Shipment Arriving Soon',
          `Your shipment ${activeShipment.tracking_id} is less than 5km away from the drop location!`,
          { shipment_id: activeShipment.id, tracking_id: activeShipment.tracking_id }
        );
        activeShipment.is_arriving_soon_alert_sent = true;
        await activeShipment.save();
      }
    }

    return { synced_count: sortedPoints.length, last_sync: new Date() };
  }
}

module.exports = new TrackingService();
