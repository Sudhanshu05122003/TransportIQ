const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { encrypt, decrypt } = require('../utils/crypto');
const bcrypt = require('bcryptjs');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('shipper', 'transporter', 'driver', 'admin'),
    defaultValue: 'shipper',
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  company_name: DataTypes.STRING(255),
  gstin: DataTypes.STRING(15),
  avatar_url: DataTypes.TEXT,

  // KYC
  kyc_status: {
    type: DataTypes.ENUM('pending', 'submitted', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  aadhaar_number: DataTypes.STRING(12),
  aadhaar_doc_url: DataTypes.TEXT,
  driving_license: DataTypes.STRING(20),
  dl_doc_url: DataTypes.TEXT,
  pan_number: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('pan_number');
      return rawValue ? decrypt(rawValue) : rawValue;
    },
    set(value) {
      this.setDataValue('pan_number', value ? encrypt(value) : value);
    }
  },


  // Driver-specific
  is_online: { type: DataTypes.BOOLEAN, defaultValue: false },
  current_lat: DataTypes.DECIMAL(10, 8),
  current_lng: DataTypes.DECIMAL(11, 8),

  // Metadata
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  region: { type: DataTypes.STRING, defaultValue: 'IN-WEST-1' },
  organization_id: DataTypes.UUID, // For Multi-tenant SaaS support
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },


  last_login_at: DataTypes.DATE,
  otp_code: DataTypes.STRING(6),
  otp_expires_at: DataTypes.DATE,
  refresh_token: DataTypes.TEXT
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['phone'] },
    { unique: true, fields: ['email'] },
    { fields: ['role'] },
    { fields: ['is_online'] },
    { fields: ['kyc_status'] }
  ]
});


module.exports = User;
