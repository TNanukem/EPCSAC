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
});

app.get('/login', function(req, res) {
  res.render("login");
})

app.get('/config', function(req, res) {
  res.render("experiment_config");
})

app.post('/config', function(req, res){

    // HOST NUMBER PARAMETERS
    var checkbox_host = req.body.checkbox_host;

    if(checkbox_host != null){
      var host_max = req.body.host_max;
      var host_min = req.body.host_min;
      var host_exact = null;
      var host_flag = true;
    }

    else {
      var host_max = null;
      var host_min = null;
      var host_exact = req.body.host_exact;
      var host_flag = false;
    }

    console.log("\nHOST number");
    console.log("checkbox:",checkbox_host);
    console.log("exact:",host_exact);
    console.log("max:",host_max);
    console.log("min:",host_min);

    // HOST NUMBER OF PEs PARAMETERS
    var checkbox_host_pes = req.body.checkbox_host_pes;

    if(checkbox_host_pes != null){
      var host_pes_max = req.body.host_pes_max;
      var host_pes_min = req.body.host_pes_min;
      var host_pes_exact = null;
      var host_pes_flag = true;
    }

    else {
      var host_pes_max = null;
      var host_pes_min = null;
      var host_pes_exact = req.body.host_pes_exact;
      var host_pes_flag = false;
    }

    console.log("\nHOST pes");
    console.log("checkbox:",checkbox_host_pes);
    console.log("exact:",host_pes_exact);
    console.log("max:",host_pes_max);
    console.log("min:",host_pes_min);

    // HOST RAM PARAMETERS
    var checkbox_host_ram = req.body.checkbox_host_ram;

    if(checkbox_host_ram != null){
      var host_ram_max = req.body.host_ram_max;
      var host_ram_min = req.body.host_ram_min;
      var host_ram_exact = null;
      var host_ram_flag = true;
    }

    else {
      var host_ram_max = null;
      var host_ram_min = null;
      var host_ram_exact = req.body.host_ram_exact;
      var host_ram_flag = false;
    }

    console.log("\nHOST ram");
    console.log("checkbox:",checkbox_host_ram);
    console.log("exact:",host_ram_exact);
    console.log("max:",host_ram_max);
    console.log("min:",host_ram_min);

    // HOST BW PARAMETERS
    var checkbox_host_bw = req.body.checkbox_host_bw;

    if(checkbox_host_bw != null){
      var host_bw_max = req.body.host_bw_max;
      var host_bw_min = req.body.host_bw_min;
      var host_bw_exact = null;
      var host_bw_flag = true;
    }

    else {
      var host_bw_max = null;
      var host_bw_min = null;
      var host_bw_exact = req.body.host_bw_exact;
      var host_bw_flag = false;
    }

    console.log("\nHOST bw");
    console.log("checkbox:",checkbox_host_bw);
    console.log("exact:",host_bw_exact);
    console.log("max:",host_bw_max);
    console.log("min:",host_bw_min);

    // HOST HD PARAMETERS
    var checkbox_host_hd = req.body.checkbox_host_hd;

    if(checkbox_host_hd != null){
      var host_hd_max = req.body.host_hd_max;
      var host_hd_min = req.body.host_hd_min;
      var host_hd_exact = null;
      var host_hd_flag = true;
    }

    else {
      var host_hd_max = null;
      var host_hd_min = null;
      var host_hd_exact = req.body.host_hd_exact;
      var host_hd_flag = false;
    }

    console.log("\nHOST HD");
    console.log("checkbox:",checkbox_host_hd);
    console.log("exact:",host_hd_exact);
    console.log("max:",host_hd_max);
    console.log("min:",host_hd_min);
})

app.listen(3000);
