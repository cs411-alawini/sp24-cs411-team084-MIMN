const express = require('express');
const router = express.Router();

const loginRoute = require('./login');
router.use('/login', loginRoute);

const profileRoute = require('./profile');
router.use('/profile', profileRoute);

const logoutRoute = require('./logout');
router.use('/logout', logoutRoute);

const deleteRoute = require('./delete');
router.use('/delete', deleteRoute);

module.exports = router;
