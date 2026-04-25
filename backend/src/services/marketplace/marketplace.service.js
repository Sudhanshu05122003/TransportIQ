const { Bid, Shipment, User, Trip, sequelize } = require('../../models');
const { emitToUser, emitToRoom } = require('../../config/socket');
const { Op } = require('sequelize');

class MarketplaceService {
  /**
   * Place a bid on a shipment
   */
  async placeBid(transporterId, data) {
    const shipment = await Shipment.findByPk(data.shipment_id);
    
    if (!shipment) throw new Error('Shipment not found');
    if (shipment.status !== 'pending') throw new Error('Shipment is no longer available for bidding');
    if (shipment.selection_method !== 'bidding') throw new Error('This shipment is not open for bidding');
    if (shipment.bidding_ends_at && new Date() > shipment.bidding_ends_at) throw new Error('Bidding window has closed');

    const bid = await Bid.create({
      ...data,
      transporter_id: transporterId,
      status: 'pending'
    });

    // Notify shipper via Socket.IO
    emitToUser(shipment.shipper_id, 'bid:new', {
      shipmentId: shipment.id,
      bidId: bid.id,
      amount: bid.amount
    });

    // Broadcast to bidding room (real-time marketplace updates)
    emitToRoom(`bidding:${shipment.id}`, 'bidding:update', {
      latestBid: bid.amount,
      totalBids: await Bid.count({ where: { shipment_id: shipment.id } })
    });

    return bid;
  }

  /**
   * List bids for a shipment
   */
  async getBidsForShipment(shipmentId) {
    return await Bid.findAll({
      where: { shipment_id: shipmentId },
      include: [{ model: User, as: 'transporter', attributes: ['first_name', 'last_name', 'rating'] }],
      order: [['amount', 'ASC']]
    });
  }

  /**
   * Accept a bid and convert to assigned shipment
   */
  async acceptBid(shipperId, bidId) {
    const t = await sequelize.transaction();
    try {
      const bid = await Bid.findByPk(bidId, {
        include: [{ model: Shipment, as: 'shipment' }]
      });

      if (!bid) throw new Error('Bid not found');
      if (bid.shipment.shipper_id !== shipperId) throw new Error('Unauthorized');
      if (bid.shipment.status !== 'pending') throw new Error('Shipment already processed');

      // 1. Update Shipment
      await bid.shipment.update({
        status: 'assigned',
        transporter_id: bid.transporter_id,
        driver_id: bid.driver_id || null,
        vehicle_id: bid.vehicle_id || null,
        winning_bid_id: bid.id,
        final_fare: bid.amount
      }, { transaction: t });

      // 2. Update Winning Bid
      await bid.update({ status: 'accepted' }, { transaction: t });

      // 3. Reject other bids
      await Bid.update({ status: 'rejected' }, {
        where: { shipment_id: bid.shipment_id, id: { [Op.ne]: bid.id } },
        transaction: t
      });

      // 4. Initialize Trip
      await Trip.create({
        shipment_id: bid.shipment_id,
        driver_id: bid.driver_id,
        vehicle_id: bid.vehicle_id,
        status: 'pending'
      }, { transaction: t });

      await t.commit();

      // Notifications
      emitToUser(bid.transporter_id, 'bid:accepted', { shipmentId: bid.shipment_id });
      
      return bid;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Get active marketplace shipments (Open for bidding)
   */
  async getMarketplaceShipments() {
    return await Shipment.findAll({
      where: {
        status: 'pending',
        selection_method: 'bidding',
        [Op.or]: [
          { bidding_ends_at: null },
          { bidding_ends_at: { [Op.gt]: new Date() } }
        ]
      },
      include: [{ model: User, as: 'shipper', attributes: ['first_name', 'rating'] }]
    });
  }
}

module.exports = new MarketplaceService();
