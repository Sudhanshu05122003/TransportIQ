const User = require('./User');
const Vehicle = require('./Vehicle');
const Shipment = require('./Shipment');
const Trip = require('./Trip');
const { Payment, Invoice } = require('./Payment');
const Location = require('./Location');
const { Notification, PricingRule, DriverEarning } = require('./Notification');
const HistoricalTripData = require('./HistoricalTripData');
const Warehouse = require('./Warehouse');
const Inventory = require('./Inventory');
const StockMovement = require('./StockMovement');
const Bid = require('./Bid');
const AuditLog = require('./AuditLog');
const ShipmentDocument = require('./ShipmentDocument');
const { Wallet, Transaction } = require('./Wallet');
const Settlement = require('./Settlement');
const Dispute = require('./Dispute');









// ============================================
// ASSOCIATIONS
// ============================================

// User -> Vehicles (Transporter owns vehicles)
User.hasMany(Vehicle, { foreignKey: 'transporter_id', as: 'ownedVehicles' });
Vehicle.belongsTo(User, { foreignKey: 'transporter_id', as: 'transporter' });

// User -> Vehicle (Driver assigned to vehicle)
User.hasOne(Vehicle, { foreignKey: 'driver_id', as: 'assignedVehicle' });
Vehicle.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

// User -> Shipments (Shipper creates shipments)
User.hasMany(Shipment, { foreignKey: 'shipper_id', as: 'shipments' });
Shipment.belongsTo(User, { foreignKey: 'shipper_id', as: 'shipper' });

// Transporter -> Shipments
User.hasMany(Shipment, { foreignKey: 'transporter_id', as: 'assignedShipments' });
Shipment.belongsTo(User, { foreignKey: 'transporter_id', as: 'transporter' });

// Driver -> Shipments
User.hasMany(Shipment, { foreignKey: 'driver_id', as: 'driverShipments' });
Shipment.belongsTo(User, { foreignKey: 'driver_id', as: 'shipmentDriver' });

// Vehicle -> Shipments
Vehicle.hasMany(Shipment, { foreignKey: 'vehicle_id', as: 'shipments' });
Shipment.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// Shipment -> Trip
Shipment.hasOne(Trip, { foreignKey: 'shipment_id', as: 'trip' });
Trip.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });

// User -> Trip (Driver)
User.hasMany(Trip, { foreignKey: 'driver_id', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

// Vehicle -> Trip
Vehicle.hasMany(Trip, { foreignKey: 'vehicle_id', as: 'trips' });
Trip.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// Trip -> Locations
Trip.hasMany(Location, { foreignKey: 'trip_id', as: 'locations' });
Location.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });

// User -> Locations (Driver)
User.hasMany(Location, { foreignKey: 'driver_id', as: 'locationHistory' });
Location.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

// Shipment -> Payment
Shipment.hasMany(Payment, { foreignKey: 'shipment_id', as: 'payments' });
Payment.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });

// User -> Payment
User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Payment -> Invoice
Payment.hasOne(Invoice, { foreignKey: 'payment_id', as: 'invoice' });
Invoice.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

// Shipment -> Invoice
Shipment.hasOne(Invoice, { foreignKey: 'shipment_id', as: 'invoice' });
Invoice.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });

// User -> Notifications
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> Driver Earnings
User.hasMany(DriverEarning, { foreignKey: 'driver_id', as: 'earnings' });
DriverEarning.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

// Warehouse -> Inventory
Warehouse.hasMany(Inventory, { foreignKey: 'warehouse_id', as: 'items' });
Inventory.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

// Warehouse -> StockMovement
Warehouse.hasMany(StockMovement, { foreignKey: 'warehouse_id', as: 'movements' });
StockMovement.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

// Inventory -> StockMovement
Inventory.hasMany(StockMovement, { foreignKey: 'inventory_id', as: 'movements' });
StockMovement.belongsTo(Inventory, { foreignKey: 'inventory_id', as: 'item' });

// Shipment -> StockMovement (Optional association for tracking stock via shipment)
Shipment.hasMany(StockMovement, { foreignKey: 'shipment_id', as: 'stockMovements' });
StockMovement.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });

// Shipment -> Bids
Shipment.hasMany(Bid, { foreignKey: 'shipment_id', as: 'bids' });
Bid.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });

// User (Transporter) -> Bids
User.hasMany(Bid, { foreignKey: 'transporter_id', as: 'bidsPlaced' });
Bid.belongsTo(User, { foreignKey: 'transporter_id', as: 'transporter' });

// Shipment -> Documents
Shipment.hasMany(ShipmentDocument, { foreignKey: 'shipment_id', as: 'documents' });
ShipmentDocument.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });

// User -> Documents (Uploader)
User.hasMany(ShipmentDocument, { foreignKey: 'uploaded_by', as: 'uploadedDocuments' });
ShipmentDocument.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

// User <-> Wallet
User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Wallet <-> Transactions
Wallet.hasMany(Transaction, { foreignKey: 'wallet_id', as: 'transactions' });
Transaction.belongsTo(Wallet, { foreignKey: 'wallet_id', as: 'wallet' });

// User <-> Settlements
User.hasMany(Settlement, { foreignKey: 'user_id', as: 'settlements' });
Settlement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });






module.exports = {
  User,
  Vehicle,
  Shipment,
  Trip,
  Payment,
  Invoice,
  Location,
  Notification,
  PricingRule,
  DriverEarning,
  HistoricalTripData,
  Warehouse,
  Inventory,
  StockMovement,
  Bid,
  AuditLog,
  ShipmentDocument,
  Wallet,
  Transaction,
  Settlement
};







