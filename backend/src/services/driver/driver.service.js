const { User, Trip, Shipment, Vehicle, DriverEarning } = require('../../models');
const { getRedis } = require('../../config/redis');
const { emitToUser } = require('../../config/socket');
const { Op } = require('sequelize');

class DriverService {
  async toggleOnline(driverId, isOnline) {
    const driver = await User.findByPk(driverId);
    if (!driver) throw Object.assign(new Error('Driver not found'), { statusCode: 404 });

    driver.is_online = isOnline;
    await driver.save();

    const redis = getRedis();
    await redis.hSet(`driver:${driverId}:status`, 'online', String(isOnline));

    return { is_online: isOnline };
  }

  async updateLocation(driverId, lat, lng) {
    await User.update({ current_lat: lat, current_lng: lng }, { where: { id: driverId } });
    const redis = getRedis();
    await redis.hSet(`driver:${driverId}:location`, 'lat', String(lat));
    await redis.hSet(`driver:${driverId}:location`, 'lng', String(lng));
    await redis.hSet(`driver:${driverId}:location`, 'timestamp', new Date().toISOString());
    return { lat, lng };
  }

  async acceptTrip(driverId, tripId) {
    const trip = await Trip.findOne({
      where: { id: tripId, driver_id: driverId, status: 'assigned' }
    });
    if (!trip) throw Object.assign(new Error('Trip not found or already accepted'), { statusCode: 404 });

    trip.status = 'en_route_pickup';
    trip.start_time = new Date();
    await trip.save();

    await Shipment.update({ status: 'assigned' }, { where: { id: trip.shipment_id } });

    return trip;
  }

  async rejectTrip(driverId, tripId, reason) {
    const trip = await Trip.findOne({
      where: { id: tripId, driver_id: driverId, status: 'assigned' }
    });
    if (!trip) throw Object.assign(new Error('Trip not found'), { statusCode: 404 });

    trip.status = 'cancelled';
    await trip.save();

    // Reset shipment to pending for re-assignment
    await Shipment.update(
      { status: 'pending', driver_id: null, vehicle_id: null },
      { where: { id: trip.shipment_id } }
    );

    return { message: 'Trip rejected' };
  }

  async getEarnings(driverId, period = 'month') {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today': startDate = new Date(now.setHours(0, 0, 0, 0)); break;
      case 'week': startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case 'month': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
      case 'year': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      default: startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const earnings = await DriverEarning.findAll({
      where: { driver_id: driverId, created_at: { [Op.gte]: startDate } },
      order: [['created_at', 'DESC']]
    });

    const totalEarnings = earnings.reduce((sum, e) => sum + parseFloat(e.net_earning || 0), 0);
    const totalTrips = earnings.length;

    return {
      total_earnings: totalEarnings,
      total_trips: totalTrips,
      avg_per_trip: totalTrips > 0 ? Math.round(totalEarnings / totalTrips) : 0,
      earnings
    };
  }

  async getTripHistory(driverId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Trip.findAndCountAll({
      where: { driver_id: driverId },
      include: [{
        model: Shipment,
        as: 'shipment',
        attributes: ['id', 'tracking_id', 'pickup_city', 'drop_city', 'final_fare', 'status']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      trips: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    };
  }

  async uploadKYC(driverId, kycData) {
    const driver = await User.findByPk(driverId);
    if (!driver) throw Object.assign(new Error('Driver not found'), { statusCode: 404 });

    const updates = {};
    if (kycData.aadhaar_number) updates.aadhaar_number = kycData.aadhaar_number;
    if (kycData.driving_license) updates.driving_license = kycData.driving_license;
    if (kycData.pan_number) updates.pan_number = kycData.pan_number;
    if (kycData.aadhaar_doc_url) updates.aadhaar_doc_url = kycData.aadhaar_doc_url;
    if (kycData.dl_doc_url) updates.dl_doc_url = kycData.dl_doc_url;
    updates.kyc_status = 'submitted';

    await driver.update(updates);
    return driver;
  }
}

module.exports = new DriverService();
