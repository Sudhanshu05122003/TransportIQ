const express = require('express');
const router = express.Router();
const AIController = require('./ai.controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.post('/query', AIController.query);
router.get('/predict-demand', AIController.predictDemand);
router.get('/recommend-route/:shipmentId', AIController.recommendRoute);


module.exports = router;
