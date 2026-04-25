const express = require('express');
const router = express.Router();
const MarketplaceController = require('./marketplace.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);

// List shipments open for bidding
router.get('/shipments', MarketplaceController.getMarketplace);

// Place a bid (Transporter only)
router.post('/bids', authorize('transporter', 'admin'), MarketplaceController.placeBid);

// Get bids for a specific shipment (Shipper/Transporter)
router.get('/shipments/:shipmentId/bids', MarketplaceController.getBids);

// Accept a bid (Shipper only)
router.post('/bids/:bidId/accept', authorize('shipper', 'admin'), MarketplaceController.acceptBid);

module.exports = router;
