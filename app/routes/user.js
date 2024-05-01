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
    const user_id = req.session.user.id;
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
  } else {
    res.redirect('/index');
  }
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
