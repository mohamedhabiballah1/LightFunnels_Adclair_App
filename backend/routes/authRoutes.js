const express = require('express');
const authControllers = require('../controller/authControllers');

const router = express.Router();

router.get('/auth', authControllers.authFunction);
router.get('/redirect', authControllers.redirectFunction);

module.exports = router;