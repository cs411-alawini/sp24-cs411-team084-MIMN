const express = require('express');
const router = express.Router();

const loginRoute = require('./login');
router.use('/login', loginRoute);

const createRoute = require('./create');
router.use('/create', createRoute);

const logoutRoute = require('./logout');
router.use('/logout', logoutRoute);

module.exports = router;
