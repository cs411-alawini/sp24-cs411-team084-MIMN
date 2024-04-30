const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '35.232.135.106',
    user: 'root',
    password: 'UIUC-cs411-MIMN',
    database: 'COLLEGE_DB'
});

function generateUserId(username) {
  const now = Date.now().toString();
  const random = Math.random().toString();
  const hash = crypto.createHash('sha256').update(username + now + random).digest('hex');
  return hash.substring(0, 10);
}

router.post('/submit', express.urlencoded({ extended: true }), (req, res) => {
  let {
    degree, term, gre_q, gre_v, gre_awa, gpa, status, date, user_id,
    university, decision
  } = req.body;

  // Convert empty strings to null for optional fields
  degree = degree || null;
  term = term || null;
  gre_q = gre_q ? parseInt(gre_q, 10) : null;
  gre_v = gre_v ? parseInt(gre_v, 10) : null;
  gre_awa = gre_awa ? parseInt(gre_awa, 10) : null;
  gpa = gpa ? parseFloat(gpa) : null;
  status = status || null;
  date = date || null;

  var applicationId = generateUserId(user_id);

  var sql = `INSERT INTO application (user_id, application_id, degree, term, decision, gre_q, gre_v, gre_awa, 
    gpa, status, university, decision_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [user_id, applicationId, degree, term, decision, 
    gre_q, gre_v, gre_awa, gpa, status, university, date], function(err, result) {
    if (err) {
      console.error('Error adding new user:', err);
      res.status(500).send({ message: 'Error adding new user', error: err });
    } else {
      res.json({ 
        message: `Post successfully`,
      });
    }
  });
});

module.exports = router;
