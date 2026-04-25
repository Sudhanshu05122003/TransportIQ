const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
  balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
  credit_limit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
  currency: { type: DataTypes.STRING, defaultValue: 'INR' },
  status: { type: DataTypes.ENUM('active', 'frozen', 'closed'), defaultValue: 'active' }
}, {
  tableName: 'wallets',
  timestamps: true,
  underscored: true
});

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  wallet_id: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  type: { type: DataTypes.ENUM('credit', 'debit'), allowNull: false },
  category: { 
    type: DataTypes.ENUM('shipment_payment', 'wallet_topup', 'withdrawal', 'refund', 'bonus', 'penalty'),
    allowNull: false
  },
  reference_id: DataTypes.UUID, // Link to Shipment, etc.
  description: DataTypes.TEXT,
  metadata: DataTypes.JSONB,
  status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'completed' }
}, {
  tableName: 'wallet_transactions',
  timestamps: true,
  underscored: true
});

module.exports = { Wallet, Transaction };
