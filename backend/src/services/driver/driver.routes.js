const router = require('express').Router();
const driverController = require('./driver.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);
router.use(authorize('driver', 'admin'));

router.patch('/status', driverController.toggleOnline);
router.post('/location', driverController.updateLocation);
router.post('/trips/:tripId/accept', driverController.acceptTrip);
router.post('/trips/:tripId/reject', driverController.rejectTrip);
router.get('/earnings', driverController.getEarnings);
router.get('/trip-history', driverController.getTripHistory);
router.post('/kyc', driverController.uploadKYC);

module.exports = router;
