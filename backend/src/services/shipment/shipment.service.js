const { Shipment, User, Vehicle, Trip } = require('../../models');
const { calculateDistance, calculateRouteDistance, estimateDuration, generateTrackingId } = require('../../utils/distance');
const { calculateFare } = require('../../utils/pricing');
const { autoAssignDriver } = require('../../utils/matching');
const { predictETA } = require('../../utils/eta');
const { emitToUser, emitToRole } = require('../../config/socket');
const { produceEvent } = require('../../config/kafka');
const OptimizationService = require('../optimization/optimization.service');

const { Op } = require('sequelize');

class ShipmentService {
  /**
   * Create a new shipment
   */
  async createShipment(shipperId, data) {
    // 1. Optimize multi-stop route if stops provided
    let stops = data.stops || [];
    if (stops.length > 1) {
      stops = OptimizationService.optimizeRoute(
        { lat: data.pickup_lat, lng: data.pickup_lng },
        stops,
        { lat: data.drop_lat, lng: data.drop_lng }
      );
    }

    const distance = calculateRouteDistance(
      { lat: data.pickup_lat, lng: data.pickup_lng },
      stops,
      { lat: data.drop_lat, lng: data.drop_lng }
    );


    const duration = estimateDuration(distance);

    const fareBreakdown = await calculateFare(data.vehicle_type_required, distance, data.weight_kg);
    const eta = await predictETA(distance, data.vehicle_type_required, null, data.pickup_city, data.drop_city);


    const shipment = await Shipment.create({
      ...data,
      stops, // Optimized sequence
      shipper_id: shipperId,
      tracking_id: generateTrackingId(),
      distance_km: distance,
      estimated_duration_minutes: duration,
      estimated_fare: fareBreakdown.total,
      status: 'pending'
    });


    // Notify admins
    emitToRole('admin', 'shipment:new', {
      shipmentId: shipment.id,
      trackingId: shipment.tracking_id,
      pickup: data.pickup_city || data.pickup_address,
      drop: data.drop_city || data.drop_address
    });

    // Produce Kafka Event
    await produceEvent('shipment.created', {
      shipmentId: shipment.id,
      trackingId: shipment.tracking_id,
      shipperId: shipment.shipper_id,
      pickup: shipment.pickup_city,
      drop: shipment.drop_city,
      timestamp: new Date().toISOString()
    });

    return {

      shipment,
      fare_breakdown: fareBreakdown,
      eta
    };
  }

  /**
   * Get fare estimate without creating shipment
   */
  async getFareEstimate(data) {
    const distance = calculateRouteDistance(
      { lat: data.pickup_lat, lng: data.pickup_lng },
      data.stops || [],
      { lat: data.drop_lat, lng: data.drop_lng }
    );
    const duration = estimateDuration(distance);
    const fareBreakdown = await calculateFare(data.vehicle_type_required, distance, data.weight_kg);
    const eta = await predictETA(distance, data.vehicle_type_required, null, data.pickup_city, data.drop_city);



    return { distance_km: distance, duration_minutes: duration, fare: fareBreakdown, eta };
  }

  /**
   * Get shipment by ID
   */
  async getShipment(shipmentId, userId = null, userRole = null) {
    const whereClause = { id: shipmentId };
    // Non-admin users can only see their own shipments
    if (userRole === 'shipper') whereClause.shipper_id = userId;
    if (userRole === 'driver') whereClause.driver_id = userId;

    const shipment = await Shipment.findOne({
      where: whereClause,
      include: [
        { model: User, as: 'shipper', attributes: ['id', 'first_name', 'last_name', 'phone', 'company_name'] },
        { model: User, as: 'shipmentDriver', attributes: ['id', 'first_name', 'last_name', 'phone', 'avatar_url'] },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'registration_number', 'vehicle_type', 'make', 'model'] },
        { model: Trip, as: 'trip' }
      ]
    });

    if (!shipment) {
      const error = new Error('Shipment not found');
      error.statusCode = 404;
      throw error;
    }

    return shipment;
  }

  /**
   * List shipments with filters and pagination
   */
  async listShipments({ userId, userRole, status, page = 1, limit = 20, search }) {
    const whereClause = {};

    if (userRole === 'shipper') whereClause.shipper_id = userId;
    else if (userRole === 'transporter') whereClause.transporter_id = userId;
    else if (userRole === 'driver') whereClause.driver_id = userId;

    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { tracking_id: { [Op.iLike]: `%${search}%` } },
        { pickup_city: { [Op.iLike]: `%${search}%` } },
        { drop_city: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Shipment.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'shipper', attributes: ['id', 'first_name', 'last_name', 'company_name'] },
        { model: User, as: 'shipmentDriver', attributes: ['id', 'first_name', 'last_name', 'phone'] },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'registration_number', 'vehicle_type'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      shipments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Update shipment status
   */
  async updateStatus(shipmentId, status, userId, userRole) {
    const shipment = await this.getShipment(shipmentId, null, 'admin');

    // Validate status transitions
    const validTransitions = {
      pending: ['assigned', 'cancelled'],
      assigned: ['picked_up', 'cancelled'],
      picked_up: ['in_transit', 'cancelled'],
      in_transit: ['delivered', 'cancelled'],
    };

    const allowed = validTransitions[shipment.status];
    if (!allowed || !allowed.includes(status)) {
      const error = new Error(`Cannot transition from ${shipment.status} to ${status}`);
      error.statusCode = 400;
      throw error;
    }

    shipment.status = status;
    if (status === 'picked_up') shipment.pickup_actual_at = new Date();
    if (status === 'delivered') shipment.delivered_at = new Date();

    await shipment.save();

    // Notify relevant users
    emitToUser(shipment.shipper_id, 'shipment:statusUpdate', {
      shipmentId: shipment.id,
      trackingId: shipment.tracking_id,
      status
    });

    return shipment;
  }

  /**
   * Assign driver to shipment
   */
  async assignDriver(shipmentId, driverId, vehicleId) {
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment) throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });

    const driver = await User.findOne({ where: { id: driverId, role: 'driver' } });
    if (!driver) throw Object.assign(new Error('Driver not found'), { statusCode: 404 });

    shipment.driver_id = driverId;
    shipment.vehicle_id = vehicleId;
    shipment.status = 'assigned';
    await shipment.save();

    // Create trip record
    const trip = await Trip.create({
      shipment_id: shipmentId,
      driver_id: driverId,
      vehicle_id: vehicleId,
      status: 'assigned'
    });

    // Notify driver
    emitToUser(driverId, 'trip:assigned', {
      shipmentId,
      trackingId: shipment.tracking_id,
      pickup: shipment.pickup_address,
      drop: shipment.drop_address
    });

    // Notify shipper
    emitToUser(shipment.shipper_id, 'shipment:driverAssigned', {
      shipmentId,
      driverName: `${driver.first_name} ${driver.last_name}`,
      driverPhone: driver.phone
    });

    return { shipment, trip };
  }

  /**
   * Auto-assign nearest driver
   */
  async autoAssign(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment) throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });

    const match = await autoAssignDriver(
      parseFloat(shipment.pickup_lat),
      parseFloat(shipment.pickup_lng),
      shipment.vehicle_type_required
    );

    if (!match) {
      return { matched: false, message: 'No available drivers found' };
    }

    const result = await this.assignDriver(
      shipmentId,
      match.driver.id,
      match.driver.assignedVehicle.id
    );

    return {
      matched: true,
      ...result,
      driverDistance: match.distance,
      estimatedPickupMinutes: match.estimatedPickupMinutes
    };
  }

  /**
   * Get shipment statistics
   */
  async getStats(userId, userRole) {
    const whereClause = {};
    if (userRole === 'shipper') whereClause.shipper_id = userId;
    if (userRole === 'transporter') whereClause.transporter_id = userId;
    if (userRole === 'driver') whereClause.driver_id = userId;

    const total = await Shipment.count({ where: whereClause });
    const pending = await Shipment.count({ where: { ...whereClause, status: 'pending' } });
    const inTransit = await Shipment.count({ where: { ...whereClause, status: 'in_transit' } });
    const delivered = await Shipment.count({ where: { ...whereClause, status: 'delivered' } });

    return { total, pending, in_transit: inTransit, delivered };
  }

  /**

   * Request OTP for Proof of Delivery
   */
  async requestPODOTP(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId, {
      include: [{ model: User, as: 'shipper' }]
    });

    if (!shipment) throw new Error('Shipment not found');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await shipment.update({ pod_otp: otp });

    // In production, send SMS to shipper
    console.log(`[POD OTP] Sent to ${shipment.shipper.phone}: ${otp}`);
    
    return { message: 'OTP sent to shipper' };
  }

  /**
   * Verify POD and complete shipment
   */
  async verifyPOD(shipmentId, data) {
    const { otp, imageUrl, signatureUrl, lat, lng } = data;
    const shipment = await Shipment.findByPk(shipmentId);

    if (!shipment) throw new Error('Shipment not found');
    if (shipment.pod_otp !== otp) throw new Error('Invalid OTP');

    // Elite Reliability: Geofence Validation
    // Ensure driver is within 500m of the drop-off coordinates
    const { haversine } = require('../optimization/engine/optimization.engine');
    const distanceToDrop = haversine(lat, lng, shipment.drop_lat, shipment.drop_lng);
    
    if (distanceToDrop > 0.5) { // 500 meters
      console.warn(`🚨 Fraud Alert: POD attempted from ${distanceToDrop}km away!`);
      throw new Error('You must be at the delivery location to finalize POD.');
    }

    await shipment.update({
      status: 'delivered',
      pod_image_url: imageUrl,
      pod_signature_url: signatureUrl,
      actual_delivery_at: new Date(),
      pod_otp: null 
    });


    // Update Trip
    await Trip.update(
      { status: 'completed', actual_end_time: new Date() },
      { where: { shipment_id: shipmentId } }
    );

    // Produce Event
    await produceEvent('trip.completed', {
      shipmentId: shipment.id,
      trackingId: shipment.tracking_id,
      deliveryTime: new Date().toISOString()
    });

    return shipment;
  }
}


module.exports = new ShipmentService();
