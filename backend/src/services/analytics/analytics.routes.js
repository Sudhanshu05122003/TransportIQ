const express = require('express');
const router = express.Router();
const AnalyticsController = require('./analytics.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const cache = require('../../middleware/cache');

router.use(authenticate);
router.use(authorize('admin', 'transporter'));

router.get('/dashboard', cache(300), AnalyticsController.getDashboard);

router.get('/profitability', AnalyticsController.getRouteProfit);

module.exports = router;
