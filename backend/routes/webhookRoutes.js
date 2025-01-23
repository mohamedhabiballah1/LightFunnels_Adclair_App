const express = require('express');
const router = express.Router();
const webhookController = require('../controller/webhookController');

router.post('/order', (req, res) => {
    webhookController.orderFunction(req, res);
});

router.post('/uninstall', (req, res) => {
  webhookController.uninstallFunction(req, res);
});

module.exports = router;