const router = require('express').Router();
const trackingController = require('./tracking.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);

router.post('/trip/:tripId/location', authorize('driver'), trackingController.recordLocation);
router.get('/trip/:tripId/locations', trackingController.getTripLocations);
router.get('/trip/:tripId/position', trackingController.getCurrentPosition);
router.patch('/trip/:tripId/status', authorize('driver'), trackingController.updateTripStatus);
router.get('/active-trip', authorize('driver'), trackingController.getActiveTrip);

module.exports = router;
