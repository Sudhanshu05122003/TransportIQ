const WalletService = require('./wallet.service');
const { successResponse, errorResponse } = require('../../utils/response');

class WalletController {
  async getBalance(req, res) {
    try {
      const wallet = await WalletService.getWallet(req.userId);
      return successResponse(res, wallet);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async addFunds(req, res) {
    try {
      const { amount, reference_id, description } = req.body;
      const result = await WalletService.addFunds(req.userId, amount, reference_id, description);
      return successResponse(res, result, 'Funds added successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getHistory(req, res) {
    try {
      const transactions = await WalletService.getTransactions(req.userId);
      return successResponse(res, transactions);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async setCredit(req, res) {
    try {
      const { user_id, credit_limit } = req.body;
      const wallet = await WalletService.updateCreditLimit(user_id, credit_limit);
      return successResponse(res, wallet, 'Credit limit updated');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new WalletController();
