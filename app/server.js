var express = require('express');
var mysql = require('mysql2');
var path = require('path');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require("connect-redis").default

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

// connect to mysql
var connection = mysql.createConnection({
                host: '35.232.135.106',
                user: 'root',
                password: 'UIUC-cs411-MIMN',
                database: 'COLLEGE_DB'
});

connection.connect;

var app = express();
app.use(session({
  store: redisStore,
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3600000
  }
}));

// set up ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'public'));

const accountRoutes = require('./routes/accounts');
app.use('/accounts', accountRoutes);

const userRoutes = require('./routes/users');
app.use('/user', userRoutes);

app.get('/', function(req, res) {
  if (req.session.user) {
    res.render('index', { title: 'Index', user: req.session.user });
  } else {
    res.redirect('/accounts/login');
  }
});

app.get('/index', function(req, res) {
  if (req.session.user) {
    res.render('index', { title: 'Index', user: req.session.user });
  } else {
    res.redirect('/accounts/login');
  }
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
