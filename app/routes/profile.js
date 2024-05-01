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
    if (!req.session.transaction || !req.session.transaction.inProgress) {
        res.status(400).send({ message: 'No active transaction' });
        return;
    }

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

    await connection.beginTransaction();
    try {
        await connection.query("UPDATE user SET gpa = ?, gre_q = ?, gre_v = ?, gre_awa = ?, status = ? WHERE user_id = ?", 
            [gpa, gre_q, gre_v, gre_awa, status, user_id]);
        await connection.commit();
        res.redirect('/');
    } catch (err) {
        await connection.rollback();
        console.error('Error completing profile update:', err);
        res.status(500).send({ message: 'Error completing profile update', error: err });
    } finally {
        connection.end();
        delete req.session.transaction;  // Clear the transaction flag
    }
});

module.exports = router;
