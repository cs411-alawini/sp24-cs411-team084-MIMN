const express = require('express');
const router = express.Router();

const loginRoute = require('./login');
router.use('/login', loginRoute);

const logoutRoute = require('./logout');
router.use('/logout', logoutRoute);

const deleteRoute = require('./delete');
router.use('/delete', deleteRoute);

module.exports = router;
