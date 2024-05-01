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
  const { username, email, password, area, university } = req.body;

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

    await connection.query('INSERT INTO like_university (user_id, liked_university) VALUES (?, ?)', 
        [id, university]);

    req.session.transaction = { id: id, inProgress: true };

    const [results_1] = await connection.query(`
      SELECT 
        university.name, 
        tmp.accepted_cases
      FROM user u
      LEFT JOIN area a ON u.dream_area = a.area_id
      LEFT JOIN ranking r ON r.area_id = u.dream_area
      LEFT JOIN university  ON university.university_id = r.university_id
      LEFT JOIN 
      (SELECT university, 
        COUNT(*) AS accepted_cases
      FROM application
      WHERE decision = 'Accepted'
      GROUP BY university) tmp
      ON tmp.university = r.university_id
      WHERE u.user_id = ? AND r.ranking IS NOT NULL 
      ORDER BY r.ranking
      LIMIT 5;`, [id]);
    
    const [result_2] = await connection.query(`
      SELECT u.gre_q, u.gre_v, u.gre_awa, u.gpa, a.decision, a.decision_date
      FROM user u
      LEFT JOIN application a ON u.user_id = a.user_id
      LEFT JOIN like_university l ON u.user_id = l.user_id
      WHERE u.gre_q IS NOT NULL
        AND u.gre_v IS NOT NULL
        AND u.gpa IS NOT NULL
        AND a.decision != 'Others'
        AND l.liked_university =
        (SELECT liked_university FROM like_university WHERE user_id = ?)
      ORDER BY a.decision_date DESC
      LIMIT 5;
    `, [id])

    await connection.commit();

    res.render('profile', { title: 'Complete Profile', data_1: results_1, data_2: result_2 });
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
    await connection.query("DELETE FROM user WHERE user_id = ?", [user_id]);
    await connection.query("DELETE FROM like_university WHERE user_id = ?", [user_id]);

    console.error('Error completing profile update:', err);
    res.status(500).send({ message: 'Error completing profile update', error: err });
} finally {
    connection.release();
    delete req.session.transaction;
}
});

module.exports = router;
