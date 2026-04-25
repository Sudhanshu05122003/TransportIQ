const paymentService = require('./payment.service');

const paymentController = {
  async createOrder(req, res, next) {
    try {
      const result = await paymentService.createOrder(req.userId, req.body.shipment_id, req.body.method);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  async verifyPayment(req, res, next) {
    try {
      const result = await paymentService.verifyPayment(
        req.params.id,
        req.body.razorpay_payment_id,
        req.body.razorpay_signature
      );
      res.json({ success: true, message: 'Payment verified', data: result });
    } catch (error) { next(error); }
  },

  async listPayments(req, res, next) {
    try {
      const result = await paymentService.listPayments(
        req.userId, req.userRole,
        parseInt(req.query.page) || 1,
        parseInt(req.query.limit) || 20
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
};

module.exports = paymentController;
