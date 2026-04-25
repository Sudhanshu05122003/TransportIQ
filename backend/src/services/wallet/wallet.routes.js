const express = require('express');
const router = express.Router();
const WalletController = require('./wallet.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

router.use(authenticate);

router.get('/balance', WalletController.getBalance);
router.get('/transactions', WalletController.getHistory);
router.post('/add-funds', WalletController.addFunds);
router.patch('/set-credit', authorize('admin'), WalletController.setCredit);

module.exports = router;
