const { PricingRule } = require('../../models');
const { calculateFare } = require('../../utils/pricing');

const pricingController = {
  async getRules(req, res, next) {
    try {
      const rules = await PricingRule.findAll({ where: { is_active: true }, order: [['vehicle_type', 'ASC']] });
      res.json({ success: true, data: rules });
    } catch (error) { next(error); }
  },

  async updateRule(req, res, next) {
    try {
      const rule = await PricingRule.findByPk(req.params.id);
      if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
      await rule.update(req.body);
      res.json({ success: true, message: 'Pricing rule updated', data: rule });
    } catch (error) { next(error); }
  },

  async estimate(req, res, next) {
    try {
      const { vehicle_type, distance_km, weight_kg } = req.body;
      const fare = await calculateFare(vehicle_type, distance_km, weight_kg);
      res.json({ success: true, data: fare });
    } catch (error) { next(error); }
  }
};

module.exports = pricingController;
