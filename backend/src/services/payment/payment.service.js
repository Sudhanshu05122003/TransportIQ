const { Payment, Invoice, Shipment } = require('../../models');
const { calculateGST } = require('../../utils/pricing');
const { generateInvoiceNumber } = require('../../utils/distance');

class PaymentService {
  /**
   * Create a Razorpay order
   */
  async createOrder(userId, shipmentId, method) {
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment) throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });

    const amount = parseFloat(shipment.estimated_fare || shipment.final_fare);
    if (!amount) throw Object.assign(new Error('Fare not calculated'), { statusCode: 400 });

    let razorpayOrderId = null;

    // If not COD, create Razorpay order
    if (method !== 'cod') {
      try {
        const Razorpay = require('razorpay');
        const rzp = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await rzp.orders.create({
          amount: Math.round(amount * 100), // Amount in paise
          currency: 'INR',
          receipt: `shipment_${shipment.tracking_id}`,
          notes: {
            shipment_id: shipmentId,
            tracking_id: shipment.tracking_id
          }
        });
        razorpayOrderId = order.id;
      } catch (err) {
        console.error('Razorpay order creation failed:', err.message);
        // Generate mock order ID for development
        razorpayOrderId = `order_mock_${Date.now()}`;
      }
    }

    // Calculate GST
    const gst = calculateGST(amount, shipment.pickup_state, shipment.drop_state);

    const payment = await Payment.create({
      shipment_id: shipmentId,
      user_id: userId,
      amount,
      method,
      razorpay_order_id: razorpayOrderId,
      status: method === 'cod' ? 'pending' : 'authorized',
      subtotal: amount - gst.total_gst,
      gst_rate: gst.gst_rate,
      cgst_amount: gst.cgst,
      sgst_amount: gst.sgst,
      igst_amount: gst.igst,
      total_gst: gst.total_gst
    });

    return {
      payment,
      razorpay: razorpayOrderId ? {
        order_id: razorpayOrderId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID
      } : null
    };
  }

  /**
   * Verify Razorpay payment
   */
  async verifyPayment(paymentId, razorpayPaymentId, razorpaySignature) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw Object.assign(new Error('Payment not found'), { statusCode: 404 });

    // Verify signature (in production)
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${payment.razorpay_order_id}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature && process.env.NODE_ENV === 'production') {
        throw new Error('Invalid payment signature');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        payment.status = 'failed';
        payment.failure_reason = 'Signature verification failed';
        await payment.save();
        throw Object.assign(new Error('Payment verification failed'), { statusCode: 400 });
      }
    }

    payment.razorpay_payment_id = razorpayPaymentId;
    payment.razorpay_signature = razorpaySignature;
    payment.status = 'captured';
    payment.paid_at = new Date();
    await payment.save();

    // Update shipment payment status
    await Shipment.update(
      { is_paid: true, final_fare: payment.amount },
      { where: { id: payment.shipment_id } }
    );

    // Generate invoice
    const invoice = await this.generateInvoice(payment.id);

    return { payment, invoice };
  }

  /**
   * Generate GST-compliant invoice
   */
  async generateInvoice(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [{ model: Shipment, as: 'shipment' }]
    });

    if (!payment) throw Object.assign(new Error('Payment not found'), { statusCode: 404 });

    const invoice = await Invoice.create({
      invoice_number: generateInvoiceNumber(),
      payment_id: paymentId,
      shipment_id: payment.shipment_id,
      user_id: payment.user_id,
      from_gstin: process.env.COMPANY_GSTIN,
      from_name: 'TransportIQ Logistics Pvt. Ltd.',
      from_address: 'Bangalore, Karnataka, India',
      to_name: payment.shipment?.pickup_contact_name,
      subtotal: payment.subtotal,
      gst_rate: payment.gst_rate,
      cgst: payment.cgst_amount,
      sgst: payment.sgst_amount,
      igst: payment.igst_amount,
      total: payment.amount
    });

    return invoice;
  }

  /**
   * List payments for a user
   */
  async listPayments(userId, userRole, page = 1, limit = 20) {
    const whereClause = userRole === 'admin' ? {} : { user_id: userId };
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where: whereClause,
      include: [
        { model: Shipment, as: 'shipment', attributes: ['id', 'tracking_id', 'pickup_city', 'drop_city'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      payments: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    };
  }
}

module.exports = new PaymentService();
