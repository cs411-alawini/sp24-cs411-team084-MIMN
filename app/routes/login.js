const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', { title: 'DreamCS' });
});

router.post('/', express.urlencoded({ extended: true }), (req, res) => {
    const { username, password } = req.body;

    var sql = 'SELECT * FROM user WHERE username = ?';

    connection.query(sql, [username], function(err, result) {
      if (err) {
        console.error('Error during database query:', err);
        res.status(500).send({ message: 'Error logging in', error: err });
        return;
      }
      if(result.length === 0) {
        res.status(404).send({ message: 'User not found' });
      } else {
        const user = result[0];
        if (user.password === password) {
            res.send({ message: 'login successful' });
        } else {
            res.status(401).send({ message: 'Incorrect password' });
        }
      }
    });
});

module.exports = router;