// EPCSAC - Developed by Tiago Toledo Junior (github.com/TNanukem)

// ------------------------- BASIC CONFIGURATION -------------------------------

// Requirements Import
var express = require('express');
var bodyParser = require('body-parser');
var { pool } = require('./helpers/config')
const session = require('express-session')
const cors = require('cors')
var multer = require('multer');

// Helpers to be used in the project
var User = require('./helpers/user')
var Experiment = require('./helpers/experiment');
var Algorithm = require('./helpers/algorithm');

var app = express();
var upload = multer();

app.set('view engine', 'pug');
app.set('views','./views');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: '343ji43j4n3jn4jk3n',
  resave: true,
  saveUninitialized: true
}))

// Multer file upload configuration
var Storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, './Files')
    //callback(null, "../data/"+req.session.user_id+"/algorithms");
  },
  filename: function(req, file, callback){
    callback(null, file.originalname);
  }
});

var upload = multer({
  storage: Storage}).array("algorithmUploader", 1); //Field name and max count


app.use(express.static('public'));
app.listen(3000);

// -------------------------- END OF CONFIGURATION -----------------------------


// ------------------------------ ROUTING -------------------------------------
app.get('/', function(req, res){
   res.render("index");
});

// Signup page routing
app.get('/signup', function(req, res){
  res.render("signup");
})
app.post('/signup', User.create);


// Login page routing
app.get('/login', function(req, res) {
  if(req.session.authenticated == true){
    res.redirect("user_page/?name="+req.session.name);
  }
  else {
    res.render("login");
  }
})
app.post('/login', User.login);


// Experiment configuration page routing
app.get('/config', function(req, res) {
  if(req.session.authenticated == true){
    res.render("experiment_config");
  }
  else {
    req.session.next_page = "config";
    res.redirect("login");
  }

})
app.post('/config', Experiment.create);


// User page routing
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


// Algorithm upload pages routing
app.post('/algorithm_page', function(req, res){
  if(req.session.authenticated == true){
    res.render('algorithm');
  }
  else {
    req.session.next_page = "algorithm_page";
    res.redirect("login");
  }
})

app.get('/algorithm', function(req, res){
  res.render('algorithm');
})

app.post('/algorithm', function(req, res){
  upload(req, res, function(err){
    if (err) {
        return res.end("Something went wrong!");
    }
    Algorithm.insertAlgorithm(req, res);
    return res.end("File uploaded sucessfully!.");
  });
});


// Simulation page routing
app.post('/simulation', function(req, res){
  if(req.session.authenticated == true){
    res.render('simulation');
  }
  else {
    req.session.next_page = "simulation";
    res.redirect("login");
  }
})
