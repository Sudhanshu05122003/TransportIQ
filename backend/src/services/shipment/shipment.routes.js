const router = require('express').Router();
const shipmentController = require('./shipment.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const { validate, createShipmentRules, uuidParam } = require('../../middleware/validate');

router.use(authenticate);

router.post('/', authorize('shipper', 'admin'), createShipmentRules, validate, shipmentController.create);
router.post('/estimate', shipmentController.getEstimate);
router.get('/stats', shipmentController.getStats);
router.get('/', shipmentController.list);
router.get('/:id', uuidParam, validate, shipmentController.getOne);
router.patch('/:id/status', authorize('driver', 'transporter', 'admin'), uuidParam, validate, shipmentController.updateStatus);
router.post('/:id/assign', authorize('transporter', 'admin'), uuidParam, validate, shipmentController.assignDriver);
router.post('/:id/auto-assign', authorize('transporter', 'admin'), uuidParam, validate, shipmentController.autoAssign);

// POD (Proof of Delivery)
router.post('/:id/pod/request-otp', authorize('driver', 'admin'), uuidParam, validate, shipmentController.requestPODOTP);
router.post('/:id/pod/verify', authorize('driver', 'admin'), uuidParam, validate, shipmentController.verifyPOD);


module.exports = router;
