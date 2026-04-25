const { Vehicle, User, Shipment, Trip } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class FleetService {
  async addVehicle(transporterId, data) {
    const vehicle = await Vehicle.create({ ...data, transporter_id: transporterId });
    return vehicle;
  }

  async updateVehicle(transporterId, vehicleId, updates) {
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, transporter_id: transporterId } });
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { statusCode: 404 });
    await vehicle.update(updates);
    return vehicle;
  }

  async deleteVehicle(transporterId, vehicleId) {
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, transporter_id: transporterId } });
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { statusCode: 404 });
    await vehicle.update({ is_active: false });
    return { message: 'Vehicle deactivated' };
  }

  async listVehicles(transporterId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Vehicle.findAndCountAll({
      where: { transporter_id: transporterId, is_active: true },
      include: [
        { model: User, as: 'driver', attributes: ['id', 'first_name', 'last_name', 'phone', 'is_online'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      vehicles: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    };
  }

  async assignDriver(transporterId, vehicleId, driverId) {
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, transporter_id: transporterId } });
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { statusCode: 404 });

    const driver = await User.findOne({ where: { id: driverId, role: 'driver' } });
    if (!driver) throw Object.assign(new Error('Driver not found'), { statusCode: 404 });

    // Unassign driver from any other vehicle
    await Vehicle.update({ driver_id: null }, { where: { driver_id: driverId } });

    vehicle.driver_id = driverId;
    await vehicle.save();

    return vehicle;
  }

  async getFleetStats(transporterId) {
    const totalVehicles = await Vehicle.count({ where: { transporter_id: transporterId, is_active: true } });
    const assignedVehicles = await Vehicle.count({
      where: { transporter_id: transporterId, is_active: true, driver_id: { [Op.ne]: null } }
    });
    const totalShipments = await Shipment.count({ where: { transporter_id: transporterId } });
    const activeTrips = await Shipment.count({
      where: { transporter_id: transporterId, status: ['assigned', 'in_transit'] }
    });

    // Revenue calculation
    const revenue = await Shipment.sum('final_fare', {
      where: { transporter_id: transporterId, status: 'delivered', is_paid: true }
    });

    return {
      total_vehicles: totalVehicles,
      assigned_vehicles: assignedVehicles,
      unassigned_vehicles: totalVehicles - assignedVehicles,
      total_shipments: totalShipments,
      active_trips: activeTrips,
      total_revenue: revenue || 0
    };
  }
}

module.exports = new FleetService();
