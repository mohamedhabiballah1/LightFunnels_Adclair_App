const express = require('express');
const storeStatusControllers = require('../controller/storeStatusControllers');

const router = express.Router();

router.post('/updateStatus', storeStatusControllers.updateStatusController);

router.get('/getStatus', storeStatusControllers.getStatusController);

module.exports = router;