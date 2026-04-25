/**
 * Haversine distance calculation between two coordinates
 * @returns distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * Calculate total distance for a route with multiple stops
 */
function calculateRouteDistance(pickup, stops = [], drop) {
  let totalDistance = 0;
  let currentPoint = pickup;

  // Add distance to each stop
  if (stops && stops.length > 0) {
    for (const stop of stops) {
      totalDistance += calculateDistance(
        currentPoint.lat, currentPoint.lng,
        stop.lat, stop.lng
      );
      currentPoint = stop;
    }
  }

  // Add distance to final drop
  totalDistance += calculateDistance(
    currentPoint.lat, currentPoint.lng,
    drop.lat, drop.lng
  );

  return Math.round(totalDistance * 100) / 100;
}


function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate travel duration based on distance
 * Uses average speed assumptions for Indian road conditions
 */
function estimateDuration(distanceKm) {
  // Average speed assumptions (km/h)
  if (distanceKm < 50) return Math.ceil(distanceKm / 25 * 60); // City: 25 km/h
  if (distanceKm < 300) return Math.ceil(distanceKm / 40 * 60); // Highway: 40 km/h
  return Math.ceil(distanceKm / 50 * 60); // Long haul: 50 km/h
}

/**
 * Generate a unique tracking ID
 * Format: TIQ + timestamp-based unique code
 */
function generateTrackingId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TIQ${timestamp}${random}`;
}

/**
 * Generate invoice number
 * Format: INV-YYYYMMDD-XXXX
 */
function generateInvoiceNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${random}`;
}

module.exports = { calculateDistance, calculateRouteDistance, estimateDuration, generateTrackingId, generateInvoiceNumber };
