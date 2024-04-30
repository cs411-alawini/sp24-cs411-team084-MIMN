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

function getUserInfoAndRender(user_id, res) {
  var sql = 'SELECT username, email, gre_q, gre_v, gre_awa, gpa, status, dream_area FROM user WHERE user_id = ?';
  connection.query(sql, [user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error fetching user info', error: err });
    } else if (result.length === 0) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.render('account', { title: 'Account Information', userInfo: result[0] });
    }
  });
}

router.post('/post', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, username, email, password, gre_q, gre_v, gre_awa, gpa, status, dream_area } = req.body;

  var sql = `INSERT INTO user (user_id, username, email, password, gre_q, gre_v, gre_awa, gpa, status, dream_area)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [user_id, username, email, password, gre_q, gre_v, gre_awa, gpa, status, dream_area], function(err, result) {
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
  console.log(fieldToUpdate, user_id, newValue);
  connection.query(sql, [newValue, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating email', error: err });
    } else {
      res.json({ 
        message: `Updated ${fieldToUpdate} successfully`,
        [fieldToUpdate]: newValue
      });
    }
  });
});

module.exports = router;
