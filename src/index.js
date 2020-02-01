var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var { pool } = require('./helpers/config')
const cors = require('cors')

var User = require('./helpers/user')

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

    // VM NUMBER PARAMETERS
    var checkbox_vm = req.body.checkbox_vm;

    if(checkbox_vm != null){
      var vm_max = req.body.vm_max;
      var vm_min = req.body.vm_min;
      var vm_exact = null;
      var vm_flag = true;
    }

    else {
      var vm_max = null;
      var vm_min = null;
      var vm_exact = req.body.vm_exact;
      var vm_flag = false;
    }

    console.log("\nvm number");
    console.log("checkbox:",checkbox_vm);
    console.log("exact:",vm_exact);
    console.log("max:",vm_max);
    console.log("min:",vm_min);

    // VM NUMBER OF PEs PARAMETERS
    var checkbox_vm_pes = req.body.checkbox_vm_pes;

    if(checkbox_vm_pes != null){
      var vm_pes_max = req.body.vm_pes_max;
      var vm_pes_min = req.body.vm_pes_min;
      var vm_pes_exact = null;
      var vm_pes_flag = true;
    }

    else {
      var vm_pes_max = null;
      var vm_pes_min = null;
      var vm_pes_exact = req.body.vm_pes_exact;
      var vm_pes_flag = false;
    }

    console.log("\nvm pes");
    console.log("checkbox:",checkbox_vm_pes);
    console.log("exact:",vm_pes_exact);
    console.log("max:",vm_pes_max);
    console.log("min:",vm_pes_min);

    // VM RAM PARAMETERS
    var checkbox_vm_ram = req.body.checkbox_vm_ram;

    if(checkbox_vm_ram != null){
      var vm_ram_max = req.body.vm_ram_max;
      var vm_ram_min = req.body.vm_ram_min;
      var vm_ram_exact = null;
      var vm_ram_flag = true;
    }

    else {
      var vm_ram_max = null;
      var vm_ram_min = null;
      var vm_ram_exact = req.body.vm_ram_exact;
      var vm_ram_flag = false;
    }

    console.log("\nvm ram");
    console.log("checkbox:",checkbox_vm_ram);
    console.log("exact:",vm_ram_exact);
    console.log("max:",vm_ram_max);
    console.log("min:",vm_ram_min);

    // VM BW PARAMETERS
    var checkbox_vm_bw = req.body.checkbox_vm_bw;

    if(checkbox_vm_bw != null){
      var vm_bw_max = req.body.vm_bw_max;
      var vm_bw_min = req.body.vm_bw_min;
      var vm_bw_exact = null;
      var vm_bw_flag = true;
    }

    else {
      var vm_bw_max = null;
      var vm_bw_min = null;
      var vm_bw_exact = req.body.vm_bw_exact;
      var vm_bw_flag = false;
    }

    console.log("\nvm bw");
    console.log("checkbox:",checkbox_vm_bw);
    console.log("exact:",vm_bw_exact);
    console.log("max:",vm_bw_max);
    console.log("min:",vm_bw_min);

    // vm HD PARAMETERS
    var checkbox_vm_hd = req.body.checkbox_vm_hd;

    if(checkbox_vm_hd != null){
      var vm_hd_max = req.body.vm_hd_max;
      var vm_hd_min = req.body.vm_hd_min;
      var vm_hd_exact = null;
      var vm_hd_flag = true;
    }

    else {
      var vm_hd_max = null;
      var vm_hd_min = null;
      var vm_hd_exact = req.body.vm_hd_exact;
      var vm_hd_flag = false;
    }

    console.log("\nvm HD");
    console.log("checkbox:",checkbox_vm_hd);
    console.log("exact:",vm_hd_exact);
    console.log("max:",vm_hd_max);
    console.log("min:",vm_hd_min);

    // CLOUDLET NUMBER PARAMETERS
    var checkbox_cloudlet = req.body.checkbox_cloudlet;

    if(checkbox_cloudlet != null){
      var cloudlet_max = req.body.cloudlet_max;
      var cloudlet_min = req.body.cloudlet_min;
      var cloudlet_exact = null;
      var cloudlet_flag = true;
    }

    else {
      var cloudlet_max = null;
      var cloudlet_min = null;
      var cloudlet_exact = req.body.cloudlet_exact;
      var cloudlet_flag = false;
    }

    console.log("\ncloudlet number");
    console.log("checkbox:",checkbox_cloudlet);
    console.log("exact:",cloudlet_exact);
    console.log("max:",cloudlet_max);
    console.log("min:",cloudlet_min);

    // CLOUDLET NUMBER OF PEs PARAMETERS
    var checkbox_cloudlet_pes = req.body.checkbox_cloudlet_pes;

    if(checkbox_cloudlet_pes != null){
      var cloudlet_pes_max = req.body.cloudlet_pes_max;
      var cloudlet_pes_min = req.body.cloudlet_pes_min;
      var cloudlet_pes_exact = null;
      var cloudlet_pes_flag = true;
    }

    else {
      var cloudlet_pes_max = null;
      var cloudlet_pes_min = null;
      var cloudlet_pes_exact = req.body.cloudlet_pes_exact;
      var cloudlet_pes_flag = false;
    }

    console.log("\ncloudlet pes");
    console.log("checkbox:",checkbox_cloudlet_pes);
    console.log("exact:",cloudlet_pes_exact);
    console.log("max:",cloudlet_pes_max);
    console.log("min:",cloudlet_pes_min);

    // CLOUDLET LENGTH PARAMETERS
    var checkbox_cloudlet_length = req.body.checkbox_cloudlet_length;

    if(checkbox_cloudlet_length != null){
      var cloudlet_length_max = req.body.cloudlet_length_max;
      var cloudlet_length_min = req.body.cloudlet_length_min;
      var cloudlet_length_exact = null;
      var cloudlet_length_flag = true;
    }

    else {
      var cloudlet_length_max = null;
      var cloudlet_length_min = null;
      var cloudlet_length_exact = req.body.cloudlet_length_exact;
      var cloudlet_length_flag = false;
    }

    console.log("\ncloudlet length");
    console.log("checkbox:",checkbox_cloudlet_length);
    console.log("exact:",cloudlet_length_exact);
    console.log("max:",cloudlet_length_max);
    console.log("min:",cloudlet_length_min);

    var checkbox_iterations = req.body.checkbox_iterations;
    var iterations_exact = req.body.iterations_exact;

    console.log("\nIterations");
    console.log("exact:",iterations_exact);

    var checkbox_datacenters = req.body.checkbox_datacenters;

    if(checkbox_datacenters != null){
      var datacenters_max = req.body.datacenters_max;
      var datacenters_min = req.body.datacenters_min;
      var datacenters_exact = null;
      var datacenters_flag = true;
    }

    else {
      var datacenters_max = null;
      var datacenters_min = null;
      var datacenters_exact = req.body.datacenters_exact;
      var datacenters_flag = false;
    }

    console.log("\nDatacenters");
    console.log("checkbox:",checkbox_datacenters);
    console.log("exact:",datacenters_exact);
    console.log("max:",datacenters_max);
    console.log("min:",datacenters_min);

    // Updates the parameters table
    pool.query(
      'INSERT INTO parameters (iterations ,hosts_exact,hosts_pes_exact,hosts_ram_exact,hosts_bw_exact,hosts_hd_exact,vms_exact,vms_pes_exact,vms_ram_exact,vms_bw_exact,vms_hd_exact,cloudlets_exact,cloudlets_pes_exact,cloudlets_length_exact, datacenters_max,datacenters_min,datacenters_flag,hosts_max,hosts_min,hosts_flag,hosts_pes_max,hosts_pes_min,hosts_pes_flag,hosts_ram_max,hosts_ram_min,hosts_ram_flag,hosts_bw_max,hosts_bw_min,hosts_bw_flag,hosts_hd_max,hosts_hd_min,hosts_hd_flag,vms_max,vms_min,vms_flag,vms_pes_max,vms_pes_min,vms_pes_flag,vms_ram_max,vms_ram_min,vms_ram_flag,vms_bw_max,vms_bw_min,vms_bw_flag,vms_hd_max,vms_hd_min,vms_hd_flag,cloudlets_max,cloudlets_min,cloudlets_flag,cloudlets_pes_max,cloudlets_pes_min,cloudlets_pes_flag,cloudlets_length_min,cloudlets_length_flag,cloudlets_length_max) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56)', [iterations_exact, host_exact, host_pes_exact, host_ram_exact, host_bw_exact, host_hd_exact, vm_exact, vm_pes_exact, vm_ram_exact, vm_bw_exact, vm_hd_exact, cloudlet_exact, cloudlet_pes_exact, cloudlet_length_exact, datacenters_max, datacenters_min, datacenters_flag, host_max, host_min, host_flag, host_pes_max, host_pes_min, host_pes_flag, host_ram_max, host_ram_min, host_ram_flag, host_bw_max, host_bw_min, host_bw_flag, host_hd_max, host_hd_min, host_hd_flag,vm_max, vm_min, vm_flag, vm_pes_max, vm_pes_min, vm_pes_flag, vm_ram_max, vm_ram_min, vm_ram_flag, vm_bw_max, vm_bw_min, vm_bw_flag, vm_hd_max, vm_hd_min, vm_hd_flag, cloudlet_max, cloudlet_min, cloudlet_flag, cloudlet_pes_max, cloudlet_pes_min, cloudlet_pes_flag, cloudlet_length_min,cloudlet_length_flag,cloudlet_length_max], error => {

      if (error) {
        throw error
      }
      else {
        console.log('The table parameters has been updated')
      }})

})

app.listen(3000);
