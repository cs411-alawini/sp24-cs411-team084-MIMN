var express = require('express');
var mysql = require('mysql2');
var path = require('path');

var connection = mysql.createConnection({
                host: '35.232.135.106',
                user: 'root',
                password: 'UIUC-cs411-MIMN',
                database: 'COLLEGE_DB'
});

connection.connect;

var app = express();

// set up ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../public'));

app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

const accountRoutes = require('./routes/accounts');
app.use('/accounts', accountRoutes);

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
