const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipment_id: { type: DataTypes.UUID, allowNull: false },
  user_id: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'INR' },
  method: {
    type: DataTypes.ENUM('upi', 'card', 'wallet', 'cod', 'bank_transfer'),
    allowNull: false
  },
  razorpay_order_id: DataTypes.STRING(100),
  razorpay_payment_id: DataTypes.STRING(100),
  razorpay_signature: DataTypes.STRING(255),
  status: {
    type: DataTypes.ENUM('pending', 'authorized', 'captured', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  subtotal: DataTypes.DECIMAL(12, 2),
  gst_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 18.00 },
  cgst_amount: DataTypes.DECIMAL(12, 2),
  sgst_amount: DataTypes.DECIMAL(12, 2),
  igst_amount: DataTypes.DECIMAL(12, 2),
  total_gst: DataTypes.DECIMAL(12, 2),
  failure_reason: DataTypes.TEXT,
  refund_id: DataTypes.STRING(100),
  paid_at: DataTypes.DATE
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invoice_number: { type: DataTypes.STRING(30), unique: true, allowNull: false },
  payment_id: { type: DataTypes.UUID, allowNull: false },
  shipment_id: { type: DataTypes.UUID, allowNull: false },
  user_id: { type: DataTypes.UUID, allowNull: false },
  from_gstin: DataTypes.STRING(15),
  from_name: DataTypes.STRING(255),
  from_address: DataTypes.TEXT,
  to_gstin: DataTypes.STRING(15),
  to_name: DataTypes.STRING(255),
  to_address: DataTypes.TEXT,
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  gst_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 18.00 },
  cgst: DataTypes.DECIMAL(12, 2),
  sgst: DataTypes.DECIMAL(12, 2),
  igst: DataTypes.DECIMAL(12, 2),
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  eway_bill_number: DataTypes.STRING(20),
  eway_bill_date: DataTypes.DATEONLY,
  eway_bill_expiry: DataTypes.DATEONLY,
  pdf_url: DataTypes.TEXT
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = { Payment, Invoice };
