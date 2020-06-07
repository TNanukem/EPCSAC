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
var Simulation = require('./helpers/simulation');
var Data = require('./helpers/data');

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
    var dir = './users/' + String(req.session.user_id) + '/algorithms/';

    callback(null, dir);
    //callback(null, "../data/"+req.session.user_id+"/algorithms");
  },
  filename: function(req, file, callback){
    var name = req.body.algorithm_name + '_' + req.body.algorithm_version + '.java';
    callback(null, name);
  }
});

var upload = multer({
  storage: Storage}).array("algorithmUploader", 1); //Field name and max count


app.use(express.static('public'));
app.listen(8030);

app.use((req, res, next) => {
  res.locals.session = req.session;
  global.session = req.session;
  next();
});


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

app.get('/verify', User.verify);

app.get('/need_confirmation', function(req, res){
  res.render('need_confirmation');
})

// Logout page routing
app.get('/logout', User.logout);

// Tutorial page routing
app.get('/tutorial', function(req, res){
  res.render('tutorial')
})

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
    return res.redirect('user_page');
  });
});

// Simulation page routing
app.post('/simulation', Data.renderSimulation);

app.post('/simulation_compare', Data.renderSimulationCompare);

app.post('/simulation_compare_run', Simulation.runSimulationCompare);

app.post('/simulation_run', Simulation.runSimulation);

app.get('/downloadSimulation', Simulation.downloadSimulationResults);

app.get('/getparams', Data.generateParametersTable);

app.get('/dashboard', Data.generateDash);

app.use(function(req, res){
  res.status(404).render('404');
})
