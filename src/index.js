var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var { pool } = require('./config')
const cors = require('cors')

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
   // pool.query(array, (err, res) => {
      // console.log(err, res)
      // pool.end()
   // })
});

app.get('/login', function(req, res) {
  res.render("login")
})

app.post('/login', function(req, res){
  console.log(req.body);
  res.send("Logged");
})

app.listen(3000);
