const express = require('express');
const router = express.Router();
const DocumentController = require('./document.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);

router.get('/shipment/:shipmentId', DocumentController.getByShipment);
router.post('/upload', DocumentController.upload);
router.post('/shipment/:shipmentId/generate-lr', authorize('admin', 'transporter'), DocumentController.generateLR);
router.post('/shipment/:shipmentId/generate-invoice', authorize('admin', 'transporter'), DocumentController.generateInvoice);
router.post('/shipment/:shipmentId/sync-eway', authorize('admin', 'transporter', 'driver'), DocumentController.syncEWayBill);
router.patch('/:id/verify', authorize('admin'), DocumentController.verify);


module.exports = router;
