const express = require('express');
const router = express.Router();

const loginRoute = require('./login');
router.use('/login', loginRoute);

const createRoute = require('./create');
router.use('/create', createRoute);

const createRoute = require('./logout');
router.use('/logout', createRoute);

module.exports = router;