const { User, Shipment, Payment, Vehicle, Trip, PricingRule } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class AdminService {
  async getDashboardStats() {
    const totalUsers = await User.count();
    const totalShippers = await User.count({ where: { role: 'shipper' } });
    const totalTransporters = await User.count({ where: { role: 'transporter' } });
    const totalDrivers = await User.count({ where: { role: 'driver' } });
    const onlineDrivers = await User.count({ where: { role: 'driver', is_online: true } });
    const totalVehicles = await Vehicle.count({ where: { is_active: true } });
    const totalShipments = await Shipment.count();
    const activeShipments = await Shipment.count({ where: { status: ['assigned', 'picked_up', 'in_transit'] } });
    const deliveredShipments = await Shipment.count({ where: { status: 'delivered' } });
    const totalRevenue = await Payment.sum('amount', { where: { status: 'captured' } }) || 0;

    // Monthly revenue for chart
    const monthlyRevenue = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('paid_at')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { status: 'captured', paid_at: { [Op.ne]: null } },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('paid_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('paid_at')), 'DESC']],
      limit: 12
    });

    return {
      users: { total: totalUsers, shippers: totalShippers, transporters: totalTransporters, drivers: totalDrivers, online_drivers: onlineDrivers },
      vehicles: { total: totalVehicles },
      shipments: { total: totalShipments, active: activeShipments, delivered: deliveredShipments },
      revenue: { total: totalRevenue, monthly: monthlyRevenue }
    };
  }

  async listUsers(role, page = 1, limit = 20, search) {
    const whereClause = {};
    if (role) whereClause.role = role;
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password_hash', 'otp_code', 'refresh_token'] },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      users: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    };
  }

  async updateUser(userId, updates) {
    const user = await User.findByPk(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const allowedFields = ['is_active', 'is_verified', 'kyc_status', 'role'];
    const filtered = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) filtered[key] = updates[key];
    }

    await user.update(filtered);
    return user;
  }

  async getAllShipments(page = 1, limit = 20, status, search) {
    const whereClause = {};
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
        { model: User, as: 'shipmentDriver', attributes: ['id', 'first_name', 'last_name', 'phone'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      shipments: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    };
  }
}

module.exports = new AdminService();
