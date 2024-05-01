const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const crypto = require('crypto');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '35.232.135.106',
  user: 'root',
  password: 'UIUC-cs411-MIMN',
  database: 'COLLEGE_DB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.get('/account', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('create', { title: 'Account Create' });
  }
});

router.post('/account', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, password, area } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

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

    req.session.transaction = { id: id, inProgress: true };
    await connection.commit();
    res.redirect('/create/profile');
  } catch (err) {
      await connection.rollback();
      console.error('Transaction Error:', err);
      res.status(500).send({ message: 'Transaction failed', error: err });
  } finally {
      connection.release();
  }
});

function generateUserId(username) {
  const now = Date.now().toString();
  const random = Math.random().toString();
  const hash = crypto.createHash('sha256').update(username + now + random).digest('hex');
  return hash.substring(0, 10);
}

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Account Create' });
});

router.post('/profile', express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session.transaction || !req.session.transaction.inProgress) {
    res.status(400).send({ message: 'No active transaction' });
    return;
  }

  let { gpa, gre_v, gre_q, gre_awa, status } = req.body;
  const user_id = req.session.transaction.id;
  const connection = await pool.getConnection();

  switch (status) {
      case "inter_wo_us":
          status = "International without US degree";
          break;
      case "inter_w_us":
          status = "International with US degree";
          break;
      case "american":
          status = "American";
          break;
      default:
          status = "Unknown";
  }

  gpa = gpa ? parseFloat(gpa) : null;
  gre_q = gre_q ? parseInt(gre_q, 10) : null;
  gre_v = gre_v ? parseInt(gre_v, 10) : null;
  gre_awa = gre_awa ? parseInt(gre_awa, 10) : null;

  sql = "UPDATE user SET gpa = ?, gre_q = ?, gre_v = ?, gre_awa = ?, status = ? WHERE user_id = ?";
  try {
    await connection.beginTransaction();
    await connection.query("UPDATE user SET gpa = ?, gre_q = ?, gre_v = ?, gre_awa = ?, status = ? WHERE user_id = ?", 
      [gpa, gre_q, gre_v, gre_awa, status, user_id]);
    await connection.commit();
    res.redirect('/');
} catch (err) {
    await connection.rollback();
    console.error('Error completing profile update:', err);
    res.status(500).send({ message: 'Error completing profile update', error: err });
} finally {
    connection.release();
    delete req.session.transaction;
}
});

module.exports = router;
