const express = require('express');
const router = express.Router();
const WarehouseController = require('./warehouse.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);

router.get('/', WarehouseController.list);
router.get('/:id', WarehouseController.getDetails);
router.get('/:id/movements', WarehouseController.getMovements);

// Admin/Manager only
router.post('/', authorize('admin'), WarehouseController.create);
router.post('/:id/stock-in', authorize('admin', 'transporter'), WarehouseController.stockIn);
router.post('/:id/stock-out', authorize('admin', 'transporter'), WarehouseController.stockOut);

module.exports = router;
