const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to logout, please try again.' });
        }
        res.redirect('/accounts/login');
    });
});

module.exports = router;
