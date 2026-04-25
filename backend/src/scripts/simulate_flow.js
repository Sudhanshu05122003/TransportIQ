/**
 * TransportIQ End-to-End Flow Simulation
 * Verifies the entire lifecycle of a shipment.
 */
require('dotenv').config();
const { sequelize } = require('../config/database');
const { User, Vehicle, Shipment, Trip, Payment } = require('../models');
const ShipmentService = require('../services/shipment/shipment.service');
const TrackingService = require('../services/tracking/tracking.service');
const { generateTrackingId } = require('../utils/distance');

async function simulate() {
  console.log('🚀 Starting TransportIQ E2E Flow Simulation...');

  try {
    // 1. Setup Data
    const [shipper] = await User.findOrCreate({
      where: { phone: '9876543210' },
      defaults: { 
        first_name: 'Test', last_name: 'Shipper', 
        role: 'shipper', password_hash: 'mock', is_verified: true 
      }
    });

    const [driver] = await User.findOrCreate({
      where: { phone: '9999888877' },
      defaults: { 
        first_name: 'Test', last_name: 'Driver', 
        role: 'driver', password_hash: 'mock', is_verified: true,
        current_lat: 19.076, current_lng: 72.8777, is_online: true
      }
    });

    const [vehicle] = await Vehicle.findOrCreate({
      where: { registration_number: 'MH 12 AB 1234' },
      defaults: { 
        owner_id: driver.id, driver_id: driver.id, 
        vehicle_type: 'lcv', model: 'Tata Ace', status: 'active' 
      }
    });

    console.log('✅ Base data ready.');

    // 2. Create Shipment
    const shipmentData = {
      pickup_address: 'Andheri East, Mumbai',
      pickup_city: 'Mumbai',
      pickup_lat: 19.076,
      pickup_lng: 72.8777,
      drop_address: 'Connaught Place, Delhi',
      drop_city: 'Delhi',
      drop_lat: 28.6139,
      drop_lng: 77.209,
      weight_kg: 500,
      vehicle_type_required: 'lcv',
      material_type: 'Electronics'
    };

    const shipment = await ShipmentService.createShipment(shipper.id, shipmentData);
    console.log(`📦 Shipment created: ${shipment.tracking_id} (Status: ${shipment.status})`);

    // 3. Auto-Assign Driver
    console.log('🔍 Auto-assigning driver...');
    const assigned = await ShipmentService.autoAssignDriver(shipment.id);
    if (assigned) {
      console.log(`🧑‍✈️ Driver ${driver.first_name} assigned to shipment.`);
    }

    // 4. Start Trip
    const trip = await Trip.findOne({ where: { shipment_id: shipment.id } });
    console.log(`🛣️ Trip initialized (Status: ${trip.status})`);

    await TrackingService.updateTripStatus(driver.id, trip.id, 'en_route_pickup');
    console.log('🚚 Driver en route to pickup.');

    await TrackingService.updateTripStatus(driver.id, trip.id, 'at_pickup');
    console.log('📍 Driver reached pickup.');

    await TrackingService.updateTripStatus(driver.id, trip.id, 'in_transit');
    console.log('🚛 Shipment picked up and in transit.');

    // 5. Update Location
    await TrackingService.recordLocation(driver.id, trip.id, {
      lat: 22.0, lng: 75.0, speed: 45, heading: 180
    });
    console.log('📡 Location update recorded.');

    // 6. Complete Delivery
    await TrackingService.updateTripStatus(driver.id, trip.id, 'completed');
    console.log('🏁 Shipment delivered successfully!');

    // 7. Verify Results
    const finalShipment = await Shipment.findByPk(shipment.id);
    console.log(`📊 Final Shipment Status: ${finalShipment.status}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Simulation failed:', error);
    process.exit(1);
  }
}

simulate();
