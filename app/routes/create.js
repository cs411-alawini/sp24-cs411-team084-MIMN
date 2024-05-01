const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
    host: '35.232.135.106',
    user: 'root',
    password: 'UIUC-cs411-MIMN',
    database: 'COLLEGE_DB'
});

connection.connect;

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('create', { title: 'Account Create' });
  }
});

router.post('/', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, password, area } = req.body;

  // check if user exists
  const connection = await mysql.createConnection({
    host: '35.232.135.106',
    user: 'root',
    password: 'UIUC-cs411-MIMN',
    database: 'COLLEGE_DB'
  });

  await connection.beginTransaction();

  try {
    try {
        const [exists] = await connection.query('SELECT * FROM user WHERE username = ?', [username]);
        if (exists.length > 0) {
            await connection.rollback();
            res.status(409).send({ message: 'Username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = generateUserId(username);
        await connection.query('INSERT INTO user (user_id, username, email, password, dream_area) VALUES (?, ?, ?, ?, ?)', 
            [id, username, email, hashedPassword, area]);

        // Storing transaction ID or similar flag
        req.session.transaction = { id: id, inProgress: true };
        await connection.commit();
        res.redirect('/accounts/profile/');
    } catch (err) {
        await connection.rollback();
        console.error('Transaction Error:', err);
        res.status(500).send({ message: 'Transaction failed', error: err });
    } finally {
        connection.end();
    }
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
  return hash.substring(0, 10);
}

module.exports = router;
