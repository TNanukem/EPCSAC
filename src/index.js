var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var { pool } = require('./helpers/config')
const session = require('express-session')
const cors = require('cors')

var User = require('./helpers/user')
var Experiment = require('./helpers/experiment');
var Auth = require('./helpers/middleware');

var upload = multer();
var app = express();

app.set('view engine', 'pug');
app.set('views','./views');

app.use(session({
  secret: '343ji43j4n3jn4jk3n',
  resave: true,
  saveUninitialized: true
}))

var Storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, "./Files")
  },
  filename: function(req, file, callback){
    callback(null, file.originalname);
  }
});

var uploadAlg = multer({

    storage: Storage

}).array("algorithmUploader", 1); //Field name and max count

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
//app.use(upload.array());

app.use(express.static('public'));

app.get('/', function(req, res){
   res.render("index");
});

app.get('/signup', function(req, res){
  res.render("signup")
})

app.get('/login', function(req, res) {
  if(req.session.authenticated == true){
    res.redirect("user_page/?name="+req.session.name);
  }
  else {
    res.render("login");
  }
})

app.get('/config', function(req, res) {
  if(req.session.authenticated == true){
    res.render("experiment_config");
  }
  else {
    req.session.next_page = "config";
    res.redirect("login");
  }

})

app.post('/signup', User.create);
app.post('/login', User.login);
app.get('/user_page', function(req, res){
  if(req.session.authenticated == true){
    res.render('user_page', {name:req.query.name});
  }
  else {
    req.session.next_page = "user_page";
    res.redirect("login");
  }
});

app.post('/user_page', function(req, res){
  res.redirect('../config');
});

app.post('/algorithm', function(req, res){
  if(req.session.authenticated == true){
    res.render('algorithm');
  }
  else {
    req.session.next_page = "algorithm";
    res.redirect("login");
  }
})

app.post('/algorithm_upload',function(req, res){
  uploadAlg(req, res, function(err) {
    if(err) {
      console.log(err);
      return res.end('Something went wrong');
    }
    return res.end('File successfully uploaded')
  });
});

app.post('/simulation', function(req, res){
  if(req.session.authenticated == true){
    res.render('simulation');
  }
  else {
    req.session.next_page = "simulation";
    res.redirect("login");
  }
})

app.post('/config', Experiment.create);

app.listen(3000);
