var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '35.232.135.106',
                user: 'root',
                password: 'UIUC-cs411-MIMN',
                database: 'COLLEGE_DB'
});

connection.connect;

const multer = require('multer');
var app = express();

// set up ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../public'));
const upload = multer();

app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

/* GET home page, respond by rendering index.ejs */
app.get('/accounts/', function(req, res) {
  res.render('login', { title: 'CollegeDB' });
});

app.get('/create/', function(req, res) {
  res.render('create', { title: 'create' });
});

app.get('/api/attendance', function(req, res) {
  var sql = 'SELECT * FROM university';

  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({ message: 'Error fetching data', error: err });
      return;
    }
    res.json(results);
  });
});

app.post('/accounts/', upload.none(), function(req, res) {
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

app.post('/create/', upload.none(), function(req, res) {
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

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
