const { PricingRule } = require('../models');
const { getRedis } = require('../config/redis');

/**
 * Dynamic Pricing Engine
 * Calculates fare based on distance, weight, vehicle type, and demand
 */
async function calculateFare(vehicleType, distanceKm, weightKg) {
  const redis = getRedis();

  // Try cache first
  let rule;
  const cachedRule = await redis.get(`pricing:${vehicleType}`);
  if (cachedRule) {
    rule = JSON.parse(cachedRule);
  } else {
    rule = await PricingRule.findOne({
      where: { vehicle_type: vehicleType, is_active: true }
    });
    if (rule) {
      await redis.setEx(`pricing:${vehicleType}`, 3600, JSON.stringify(rule));
    }
  }

  if (!rule) {
    // Fallback default pricing
    rule = {
      base_fare: 500,
      per_km_rate: 15,
      per_kg_rate: 2,
      loading_charge: 200,
      unloading_charge: 200,
      min_fare: 800,
      surge_multiplier: 1.0
    };
  }

  const baseFare = parseFloat(rule.base_fare);
  const distanceCost = distanceKm * parseFloat(rule.per_km_rate);
  const weightCost = weightKg * parseFloat(rule.per_kg_rate);
  const loadingCharges = parseFloat(rule.loading_charge) + parseFloat(rule.unloading_charge);

  let subtotal = baseFare + distanceCost + weightCost + loadingCharges;

  // Apply surge multiplier
  const surgeMultiplier = parseFloat(rule.surge_multiplier) || 1.0;
  subtotal *= surgeMultiplier;

  // Enforce minimum fare
  const minFare = parseFloat(rule.min_fare);
  if (subtotal < minFare) subtotal = minFare;

  // GST calculation
  const gstRate = parseFloat(process.env.DEFAULT_GST_RATE || 18);
  const gstAmount = Math.round(subtotal * (gstRate / 100) * 100) / 100;
  const total = Math.round((subtotal + gstAmount) * 100) / 100;

  return {
    base_fare: baseFare,
    distance_cost: Math.round(distanceCost * 100) / 100,
    weight_cost: Math.round(weightCost * 100) / 100,
    loading_charges: loadingCharges,
    surge_multiplier: surgeMultiplier,
    subtotal: Math.round(subtotal * 100) / 100,
    gst_rate: gstRate,
    gst_amount: gstAmount,
    total: total,
    currency: 'INR'
  };
}

/**
 * Calculate GST breakdown (CGST + SGST for intra-state, IGST for inter-state)
 */
function calculateGST(amount, fromState, toState) {
  const gstRate = parseFloat(process.env.DEFAULT_GST_RATE || 18);
  const gstAmount = Math.round(amount * (gstRate / 100) * 100) / 100;

  if (fromState && toState && fromState.toLowerCase() === toState.toLowerCase()) {
    // Intra-state: Split into CGST + SGST
    return {
      gst_rate: gstRate,
      cgst: Math.round(gstAmount / 2 * 100) / 100,
      sgst: Math.round(gstAmount / 2 * 100) / 100,
      igst: 0,
      total_gst: gstAmount
    };
  }

  // Inter-state: Full IGST
  return {
    gst_rate: gstRate,
    cgst: 0,
    sgst: 0,
    igst: gstAmount,
    total_gst: gstAmount
  };
}

module.exports = { calculateFare, calculateGST };
