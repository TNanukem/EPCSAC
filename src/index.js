var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var { pool } = require('./helpers/config')
const cors = require('cors')

var User = require('./helpers/user')
var Experiment = require('./helpers/experiment');

var upload = multer();
var app = express();

app.set('view engine', 'pug');
app.set('views','./views');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());

app.use(express.static('public'));

app.get('/', function(req, res){
   res.render("index");
});

app.get('/signup', function(req, res){
  res.render("signup")
})

app.get('/login', function(req, res) {
  res.render("login");
})

app.get('/config', function(req, res) {
  res.render("experiment_config");
})

app.post('/signup', User.create)

app.post('/config', Experiment.create)

app.listen(3000);
