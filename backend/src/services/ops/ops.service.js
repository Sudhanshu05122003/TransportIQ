const { Shipment, Trip, User, Dispute, Wallet, Transaction, sequelize } = require('../../models');
const { produceEvent } = require('../../config/kafka');

class OpsService {
  /**
   * Fraud Detection: GPS Spoofing
   * Detects "Teleportation" (impossible speed between coordinates)
   */
  async detectGPSSpoofing(driverId, newLat, newLng, lastLat, lastLng, lastTime) {
    if (!lastLat || !lastLng) return false;

    const OptimizationEngine = require('../optimization/engine/optimization.engine');
    const distance = OptimizationEngine.haversine(lastLat, lastLng, newLat, newLng);
    const timeHours = (Date.now() - lastTime) / (1000 * 60 * 60);
    
    const speed = distance / timeHours; // km/h

    if (speed > 150) { // Assume > 150km/h is spoofed/impossible for a truck
      console.warn(`🚨 Fraud Alert: Potential GPS Spoofing for Driver ${driverId} (Speed: ${speed}km/h)`);
      await produceEvent('fraud.gps_spoofing', { driverId, speed, distance, timestamp: new Date().toISOString() });
      return true;
    }
    return false;
  }

  /**
   * SLA Management: Penalty System
   * Applies penalties for late deliveries
   */
  async processSLAPenalties(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment || shipment.status !== 'delivered') return;

    if (shipment.actual_delivery_at > shipment.estimated_delivery_at) {
      const delayHours = (shipment.actual_delivery_at - shipment.estimated_delivery_at) / (1000 * 60 * 60);
      const penaltyAmount = Math.min(shipment.final_fare * 0.1, delayHours * 500); // Max 10% or ₹500/hr

      console.log(`📉 Applying SLA Penalty: ₹${penaltyAmount} for Shipment ${shipmentId}`);
      
      const WalletService = require('../wallet/wallet.service');
      await WalletService.processPayment(shipment.transporter_id, penaltyAmount, shipmentId);
      
      await produceEvent('ops.sla_penalty', { shipmentId, penaltyAmount, delayHours });
    }
  }

  /**
   * Pricing Intelligence: Dynamic Surge
   * Adjusts price based on region-wide demand intensity
   */
  async calculateSurgeMultiplier(region) {
    const activeDemands = await Shipment.count({ 
      where: { region, status: 'pending' } 
    });

    // Surge pricing logic: > 50 pending shipments in a region triggers surge
    if (activeDemands > 50) return 1.25; // 25% surge
    if (activeDemands > 100) return 1.5; // 50% surge
    return 1.0;
  }
}

module.exports = new OpsService();
