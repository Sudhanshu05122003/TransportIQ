const router = require('express').Router();
const paymentController = require('./payment.controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.post('/create-order', paymentController.createOrder);
router.post('/:id/verify', paymentController.verifyPayment);
router.get('/', paymentController.listPayments);

module.exports = router;
