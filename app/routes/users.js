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
  var sql = 'SELECT username, email, gre_q, gre_v, gre_awa, gpa, status, dream_area FROM user WHERE user_id = ?';
  console.log("dasdsas");
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
router.post('/update_email', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, email } = req.body;

  var sql = 'UPDATE user SET email = ? WHERE user_id = ?';

  connection.query(sql, [email, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating email', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});


// Update request to update user's GRE quantitative score
router.post('/update_gre_q', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, gre_q } = req.body;

  var sql = 'UPDATE user SET gre_q = ? WHERE user_id = ?';

  connection.query(sql, [gre_q, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating GRE quantitative score', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});


// update request to update user's GRE verbal score
router.post('/update_gre_v', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, gre_v } = req.body;

  var sql = 'UPDATE user SET gre_v = ? WHERE user_id = ?';

  connection.query(sql, [gre_v, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating GRE verbal score', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});

// Update request to update user's GRE gre_awa score
router.post('/update_gre_awa', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, gre_awa } = req.body;

  var sql = 'UPDATE user SET gre_awa = ? WHERE user_id = ?';

  connection.query(sql, [gre_awa, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating GRE awa score', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});

// Update request to update user's GPA score
router.post('/update_gpa', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, gpa } = req.body;

  var sql = 'UPDATE user SET gpa = ? WHERE user_id = ?';

  connection.query(sql, [gpa, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating GPA', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});

// Update request to update user's status score
router.post('/update_status', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, status } = req.body;

  var sql = 'UPDATE user SET status = ? WHERE user_id = ?';

  connection.query(sql, [status, user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating Status', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});

// Update request to update user's dream_area  score
router.post('/update_dream_area ', express.urlencoded({ extended: true }), (req, res) => {
  const { user_id, dream_area  } = req.body;

  var sql = 'UPDATE user SET dream_area  = ? WHERE user_id = ?';

  connection.query(sql, [dream_area , user_id], function(err, result) {
    if (err) {
      res.status(500).send({ message: 'Error updating Dream Area', error: err });
    } else {
      getUserInfoAndRender(user_id, res);
    }
  });
});

module.exports = router;
