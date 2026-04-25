const express = require('express');
const router = express.Router();
const OptimizationController = require('./optimization.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.post('/optimize-route', authenticate, OptimizationController.optimizeRoute);
router.post('/network', authenticate, authorize('admin'), OptimizationController.optimizeNetwork);
router.get('/benchmark', authenticate, authorize('admin'), OptimizationController.runBenchmark);
router.get('/driver-load/:id', authenticate, authorize('admin', 'transporter'), OptimizationController.getDriverLoad);



module.exports = router;
