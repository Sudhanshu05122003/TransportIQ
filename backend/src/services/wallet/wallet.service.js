const { Wallet, Transaction, sequelize } = require('../../models');

class WalletService {
  /**
   * Get wallet for user (Create if not exists)
   */
  async getWallet(userId) {
    let wallet = await Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      wallet = await Wallet.create({ user_id: userId });
    }
    return wallet;
  }

  /**
   * Add funds to wallet (Recharge)
   */
  async addFunds(userId, amount, referenceId, description) {
    const t = await sequelize.transaction();
    try {
      const wallet = await this.getWallet(userId);
      
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      await wallet.update({ balance: newBalance }, { transaction: t });

      const transaction = await Transaction.create({
        wallet_id: wallet.id,
        amount,
        type: 'credit',
        category: 'wallet_topup',
        reference_id: referenceId,
        description: description || 'Wallet Recharge'
      }, { transaction: t });

      await t.commit();
      return { wallet, transaction };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Deduct funds for shipment (Debit)
   */
  async processPayment(userId, amount, shipmentId) {
    const t = await sequelize.transaction();
    try {
      const wallet = await this.getWallet(userId);
      const totalAvailable = parseFloat(wallet.balance) + parseFloat(wallet.credit_limit);

      if (totalAvailable < amount) {
        throw new Error('Insufficient balance or credit limit');
      }

      const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
      await wallet.update({ balance: newBalance }, { transaction: t });

      const transaction = await Transaction.create({
        wallet_id: wallet.id,
        amount,
        type: 'debit',
        category: 'shipment_payment',
        reference_id: shipmentId,
        description: `Payment for shipment ${shipmentId}`
      }, { transaction: t });

      await t.commit();
      return { wallet, transaction };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(userId, limit = 20) {
    const wallet = await this.getWallet(userId);
    return await Transaction.findAll({
      where: { wallet_id: wallet.id },
      order: [['created_at', 'DESC']],
      limit
    });
  }

  /**
   * Set Credit Limit (Admin only)
   */
  async updateCreditLimit(userId, limit) {
    const wallet = await this.getWallet(userId);
    return await wallet.update({ credit_limit: limit });
  }
}

module.exports = new WalletService();
