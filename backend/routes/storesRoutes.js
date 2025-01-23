const express = require('express');
const storesControllers = require('../controller/storesControllers');

const router = express.Router();

router.get('/select', storesControllers.selectStoreFunction);
router.get('/list', storesControllers.listStoresFunction);
router.post('/selecting', storesControllers.selectingFunction);

module.exports = router;