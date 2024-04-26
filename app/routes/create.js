const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('create', { title: 'Account Create' });
});

router.post('/', express.urlencoded({ extended: true }), (req, res) => {
    const { name, username, email, password, area } = req.body;

    id = 3;
    var sql = 'INSERT INTO user (user_id, username, email, password, dream_area) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql, [id, username, email, password, area], function(err, result) {
      if (err) {
        console.error('Error during database query:', err);
        res.status(500).send({ message: 'Error logging in', error: err });
        return;
      }
      if(result.affectedRows === 0) {
        res.status(400).send({ message: 'User error' });
      } else {
        res.send({ message: 'User created successfully'});
      }
    });
});

module.exports = router;
