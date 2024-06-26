const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: '35.232.135.106',
    user: 'root',
    password: 'UIUC-cs411-MIMN',
    database: 'COLLEGE_DB'
});

connection.connect;

router.post('/', async (req, res) => {
    const user_id = req.session.user.id;
    var sql = 'DELETE FROM user WHERE user_id = ?';
    connection.query(sql, [user_id], function(err, result) {
        if (err) {
            console.error('Error during database query:', err);
            res.status(500).send({ message: 'Error fetching user info', error: err });
        return;
        } else {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).send({ message: 'Failed to logout, please try again.' });
                }
                res.redirect('/accounts/login/');
            });
        }
    });
});

module.exports = router;
