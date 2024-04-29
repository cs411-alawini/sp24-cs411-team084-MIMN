const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const crypto = require('crypto');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '35.232.135.106',
    user: 'root',
    password: 'UIUC-cs411-MIMN',
    database: 'COLLEGE_DB'
});

// connection.connect;

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/index');
  } else {
    res.render('create', { title: 'Account Create' });
  }
});

router.post('/', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, password, area } = req.body;
  console.log("Hashing password for:", username, "with password:", password);

  // check if user exists
  const checkIfExists = 'SELECT * FROM user WHERE username = ?';

  try {
    connection.query(checkIfExists, [username], async (err, result) => {
      if (err) {
        console.error('Error during database query:', err);
        res.status(500).send({ message: 'Error checking username availability', error: err });
        return;
      }
      if (result.length > 0) {
        res.status(409).send({ message: 'Username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO user (user_id, username, email, password, dream_area) VALUES (?, ?, ?, ?, ?)';
      const id = generateUserId(username);
      connection.query(sql, [id, username, email, hashedPassword, area], function(err, result) {
        if (err) {
          console.error('Error during database query:', err);
          res.status(500).send({ message: 'Error creating user', error: err });
          return;
        }
        if (result.affectedRows === 0) {
          res.status(400).send({ message: 'User creation failed' });
        } else {
          res.redirect('/accounts/login');
        }
      });
    });
  }
  catch (error) {
    console.error('Error in user creation process:', error);
    res.status(500).send({ message: 'Server error', error: error });
  }  
});

function generateUserId(username) {
  const now = Date.now().toString();
  const random = Math.random().toString();
  const hash = crypto.createHash('sha256').update(username + now + random).digest('hex');
  const number = parseInt(hash.substring(0, 10), 16);
  return number % 10000000000;
}

module.exports = router;
