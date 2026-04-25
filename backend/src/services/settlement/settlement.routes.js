const express = require('express');
const router = express.Router();
const SettlementController = require('./settlement.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);

router.get('/', SettlementController.list);
router.post('/process-bulk', authorize('admin'), SettlementController.runPayouts);

module.exports = router;
