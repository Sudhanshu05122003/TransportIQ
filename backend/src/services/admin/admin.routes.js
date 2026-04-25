const router = require('express').Router();
const adminController = require('./admin.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.patch('/users/:id', adminController.updateUser);
router.get('/shipments', adminController.getAllShipments);

module.exports = router;
