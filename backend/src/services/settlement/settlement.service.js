const { Settlement, Transaction, Wallet, Shipment, User, sequelize } = require('../../models');

class SettlementService {
  /**
   * Trigger settlement for a completed shipment
   */
  async triggerShipmentSettlement(shipmentId) {
    const t = await sequelize.transaction();
    try {
      const shipment = await Shipment.findByPk(shipmentId, {
        include: [{ model: User, as: 'transporter' }]
      });

      if (!shipment || shipment.status !== 'delivered') {
        throw new Error('Invalid shipment for settlement');
      }

      // Calculate logic (e.g., 5% commission)
      const totalAmount = parseFloat(shipment.final_fare);
      const commission = totalAmount * 0.05;
      const netPayable = totalAmount - commission;

      const settlement = await Settlement.create({
        user_id: shipment.transporter_id,
        amount: totalAmount,
        commission_deducted: commission,
        net_payable: netPayable,
        status: 'pending',
        metadata: { shipment_id: shipmentId, tracking_id: shipment.tracking_id }
      }, { transaction: t });

      await t.commit();
      return settlement;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Process pending settlements in bulk (Simulated Payout)
   */
  async processBulkPayouts() {
    const pending = await Settlement.findAll({ where: { status: 'pending' } });
    const batchId = `BATCH-${Date.now()}`;

    for (const item of pending) {
      try {
        // In production: Call Bank API / Razorpay Route
        await item.update({
          status: 'completed',
          batch_id: batchId,
          processed_at: new Date(),
          bank_reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });

        // Credit the Transporter's Wallet
        const WalletService = require('../wallet/wallet.service');
        await WalletService.addFunds(
          item.user_id, 
          item.net_payable, 
          item.id, 
          `Settlement for ${item.metadata.tracking_id}`
        );
      } catch (err) {
        await item.update({ status: 'failed', metadata: { ...item.metadata, error: err.message } });
      }
    }

    return { batch_id: batchId, processed_count: pending.length };
  }

  /**
   * Get settlements for a user
   */
  async getSettlements(userId) {
    return await Settlement.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new SettlementService();
