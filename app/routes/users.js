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

function generateUserId(username) {
  const now = Date.now().toString();
  const random = Math.random().toString();
  const hash = crypto.createHash('sha256').update(username + now + random).digest('hex');
  const number = parseInt(hash.substring(0, 10), 16);
  return number % 10000000000;
}

router.get('/', (req, res) => {
  const user_id = '00023e5e59'
  var sql = 'SELECT user_id, username, email, gre_q, gre_v, gre_awa, gpa, status, dream_area FROM user WHERE user_id = ?';
  connection.query(sql, [user_id], function(err, result) {
    if (err) {
      console.error('Error during database query:', err);
      res.status(500).send({ message: 'Error fetching user info', error: err });
      return;
    }
    if(result.length === 0) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.render('user', { userInfo: result[0] });
    }
  });
});

router.post('/post', express.urlencoded({ extended: true }), (req, res) => {
  const { degree, term, gre_q, gre_v, gre_awa, gpa, status, 
    university, decision, date, user_id  } = req.body;

  const applicationId = generateUserId(username);

  var sql = `INSERT INTO application (user_id, application_id, degree, term, decision, gre_q, gre_v, gre_awa, 
    gpa, status, university, decision_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [user_id, applicationId, degree, term, decision, 
    gre_q, gre_v, gre_awa, gpa, status, university, date], function(err, result) {
    if (err) {
      console.error('Error adding new user:', err);
      res.status(500).send({ message: 'Error adding new user', error: err });
    } else {
      res.send({ message: 'Post successfully' });
    }
  });
});

// Update request to update user's email
router.post('/update/:field', express.urlencoded({ extended: true }), async (req, res) => {
  const fieldToUpdate = req.params.field;
  const { user_id } = req.body;
  const newValue = req.body[fieldToUpdate];

  var sql = `UPDATE user SET ${connection.escapeId(fieldToUpdate)} = ? WHERE user_id = ?`;

  connection.query(sql, [newValue, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating email', error: err });
    } else {
      res.json({ 
        message: `Updated ${fieldToUpdate} successfully`,
      });
    }
  });
});

module.exports = router;
