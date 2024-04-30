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
    res.render('profile', { title: 'Account Create' });
});

router.post('/', express.urlencoded({ extended: true }), async (req, res) => {
    let { gpa, gre_v, gre_q, gre_awa, status } = req.body;

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

    const user_id = req.session.user.id;

    gpa = gpa ? parseFloat(gpa) : null;
    gre_q = gre_q ? parseInt(gre_q, 10) : null;
    gre_v = gre_v ? parseInt(gre_v, 10) : null;
    gre_awa = gre_awa ? parseInt(gre_awa, 10) : null;

    sql = "UPDATE user SET gpa = ?, gre_q = ?, gre_v = ?, gre_awa = ?, status = ? WHERE user_id = ?";

    connection.query(sql, [gpa, gre_q, gre_v, gre_awa, status, user_id], function(err, result) {
        if (err) {
            console.error('Error adding new profile:', err);
            res.status(500).send({ message: 'Error adding new profile', error: err });
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
