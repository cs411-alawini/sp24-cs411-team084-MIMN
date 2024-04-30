const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '35.232.135.106',
    user: 'root',
    password: 'UIUC-cs411-MIMN',
    database: 'COLLEGE_DB'
});

connection.connect;

router.get('/', (req, res) => {
    if (req.session.user) {
      res.render('profile', { title: 'Account Create' });
    } else {
      res.render('profile', { title: 'Account Create' });
    }
});

module.exports = router;
