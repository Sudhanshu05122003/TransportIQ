const router = require('express').Router();
const fleetController = require('./fleet.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);
router.use(authorize('transporter', 'admin'));

router.post('/vehicles', fleetController.addVehicle);
router.get('/vehicles', fleetController.listVehicles);
router.put('/vehicles/:id', fleetController.updateVehicle);
router.delete('/vehicles/:id', fleetController.deleteVehicle);
router.post('/vehicles/:id/assign-driver', fleetController.assignDriver);
router.get('/stats', fleetController.getFleetStats);

module.exports = router;
