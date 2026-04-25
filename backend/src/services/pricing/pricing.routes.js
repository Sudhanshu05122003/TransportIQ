const router = require('express').Router();
const pricingController = require('./pricing.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const cache = require('../../middleware/cache');

router.get('/rules', cache(3600), pricingController.getRules);

router.post('/estimate', pricingController.estimate);
router.put('/rules/:id', authenticate, authorize('admin'), pricingController.updateRule);

module.exports = router;
