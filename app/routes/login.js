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

router.get('/', (req, res) => {
    if (req.session.user) {
      res.redirect('/index');
    } else {
      res.render('login', { title: 'DreamCS' });
    }
});

router.post('/', express.urlencoded({ extended: true }), async (req, res) => {
    const { username, password } = req.body;

    var sql = 'SELECT * FROM user WHERE username = ?';

    connection.query(sql, [username], async function(err, result) {
      if (err) {
        console.error('Error during database query:', err);
        res.status(500).send({ message: 'Error logging in', error: err });
        return;
      }
      if(result.length === 0) {
        res.status(404).send({ message: 'User not found' });
      } else {
        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = { id: user.user_id, username: username };
            res.send({ message: 'login successful' });
        } else {
            res.status(401).send({ message: 'Incorrect password' });
        }
      }
    });
});

module.exports = router;
