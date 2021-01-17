// EPCSAC - Developed by Tiago Toledo Junior (github.com/TNanukem)

// ------------------------- BASIC CONFIGURATION -------------------------------

// Requirements Import
var express = require('express');
var bodyParser = require('body-parser');
var { pool } = require('./helpers/config')
const session = require('express-session')
const cors = require('cors')
var multer = require('multer');
alert = require('alert');

var app = express();
var upload = multer();

// Helpers to be used in the project
var User = require('./helpers/user')
var Experiment = require('./helpers/experiment');
var Algorithm = require('./helpers/algorithm');
var Simulation = require('./helpers/simulation');
var Data = require('./helpers/data');

var extension_error = false;

// Sets view configurations
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
    var extension_name = file.originalname;
    extension_name = extension_name.split('.');

    if (extension_name[extension_name.length - 1] != 'java'){
      console.log('Error on extension');
      extension_error = true;
    }

    callback(null, dir);
  },
  filename: function(req, file, callback){
    var name = req.body.algorithm_name + '_' + req.body.algorithm_version + '.java';
    callback(null, name);
  },
});

var upload = multer({
  storage: Storage}).array("algorithmUploader", 1); //Field name and max count

// Port configuration
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

// User profile routing
app.get('/user', function (req, res){
  Data.renderUserProfile(req, res)
});

// User profile configuration routing
app.get('/edit_profile', function(req, res){
  if (req.session.authenticated == true) {
    res.render("edit_profile");
  }
  else {
    req.session.next_page = "edit_profile";
    res.redirect("login");
  }
});

app.post('/edit_profile', function(req, res){
  // Creates an auxiliar storage to store the photo
  var Storage_Photo = multer.diskStorage({
    destination: function (req, file, callback) {
      var dir = './public/images/users/' + String(req.session.user_id) + '/';
      var extension_name = file.originalname;
      extension_name = extension_name.split('.');
      callback(null, dir);
    },
    filename: function (req, file, callback) {
      var name = 'photo';
      callback(null, name);
    },
  });

  var upload_photo = multer({
    storage: Storage_Photo
  }).array("photo", 1); //Field name and max count

  upload_photo(req, res, function(err){
    if (err){
      console.log(err)
      return res.end('Something went wrong!')
    }
    User.update_information(req, res);
  })
});

app.get('/edit_account', function(req, res){
  if (req.session.authenticated == true) {
    res.render("edit_account");
  }
  else {
    req.session.next_page = "edit_account";
    res.redirect("login");
  }
});

app.post('/edit_account', User.update_account);

// Algorithm upload pages routing
app.post('/algorithm_page', function(req, res){
  if(req.session.authenticated == true){
    res.render('algorithm');
  }
  else {
    req.session.next_page = "algorithm_page";
    res.redirect("login");
  }
});

app.get('/algorithm', function(req, res){
  res.render('algorithm');
});

app.post('/algorithm', function(req, res){
  upload(req, res, function(err){
    if (err) {
        return res.end("Something went wrong!");
    }
    if (extension_error == true){
      alert('You have to upload a Java file with a .java extension');
      extension_error = false;
      return res.redirect('user_page');
    }
    Algorithm.insertAlgorithm(req, res);
    return res.redirect('user_page');
  });
});

// Algorithm information page routing
app.get('/algorithm_info', function (req, res) {
  Data.renderAlgorithmPage(req, res)
});

app.get('/alter_algorithm_description', function(req, res) {
  Algorithm.renderUpdateAlgorithmDescription(req, res)
});

app.post('/alter_algorithm_description', function(req, res){
  Algorithm.updateAlgorithmDescription(req, res)
})

// Simulation page routing
app.get('/simulation', Data.renderSimulation);

app.get('/simulation_compare', Data.renderSimulationCompare);

app.post('/simulation_compare_run', Simulation.runSimulationCompare);

app.post('/simulation_run', Simulation.runSimulation);

app.get('/downloadSimulation', Simulation.downloadSimulationResults);

app.get('/getparams', Data.generateParametersTable);

// Dashboard page routing
app.get('/dashboard', Data.generateDash);

// Search page routing
app.get('/search', Data.renderSearch);

// 404 Routing
app.use(function(req, res){
  res.status(404).render('404');
})
