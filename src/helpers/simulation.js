var { pool } = require('./config');
var fs = require('fs');
var nodemailer = require("nodemailer");
require('dotenv').config()

const Simulation = {

  async runSimulation(req, res){

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datetime = date+' '+time;
    const exec = require('child_process').exec;

    var token = Math.floor((Math.random() * 100) + Math.random()*151616);

    try{

      var algorithm_id = String(req.body.algorithm_selector)[0];
      var algorithm_version = String(req.body.algorithm_selector).split(' ');
      algorithm_version = algorithm_version[algorithm_version.length - 1];

      console.log(algorithm_id)
      console.log(algorithm_version)

      var {rows} = await pool.query('SELECT id, name, version, location FROM algorithms WHERE id = $1 AND version = $2', [algorithm_id, algorithm_version])


      if(rows[0]){
        var algorithm_class_name = rows[0].name;
        var algorithm_location = rows[0].location;
        var auxList = [];
        auxList.push("'" + String(algorithm_class_name) + "'");
      }

      var {rows} = await pool.query('SELECT iterations,datacenters_exact,hosts_exact,hosts_pes_exact,hosts_ram_exact,hosts_bw_exact,hosts_hd_exact,vms_exact,vms_pes_exact,vms_ram_exact,vms_bw_exact,vms_hd_exact,cloudlets_exact,cloudlets_pes_exact,cloudlets_length_exact, datacenters_max,datacenters_min,datacenters_flag,hosts_max,hosts_min,hosts_flag,hosts_pes_max,hosts_pes_min,hosts_pes_flag,hosts_ram_max,hosts_ram_min,hosts_ram_flag,hosts_bw_max,hosts_bw_min,hosts_bw_flag,hosts_hd_max,hosts_hd_min,hosts_hd_flag,vms_max,vms_min,vms_flag,vms_pes_max,vms_pes_min,vms_pes_flag,vms_ram_max,vms_ram_min,vms_ram_flag,vms_bw_max,vms_bw_min,vms_bw_flag,vms_hd_max,vms_hd_min,vms_hd_flag,cloudlets_max,cloudlets_min,cloudlets_flag,cloudlets_pes_max,cloudlets_pes_min,cloudlets_pes_flag,cloudlets_length_max, cloudlets_length_min,cloudlets_length_flag FROM parameters WHERE id = $1', [req.body.parameters_selector]);

      if(rows[0]){

        var i = 1;
        for(var key in rows[0]){
          auxList[i] = "'" + String(rows[0][key]) + "'";
          i++;
        }

        auxList.push("'" + String(req.session.user_id) + "'");
        auxList.push("'" + String(algorithm_id) + "'");
        auxList.push("'" + String(algorithm_version) + "'");
        auxList.push("'" + String(req.body.parameters_selector) + "'");
        auxList.push("'" + String(process.cwd())+'/users/' + String(req.session.user_id) + '/simulations/' + "'");
        auxList.push("'" + String(token) + "'");
        auxList.push("'" + String(algorithm_class_name) + "'");

        var copy_algorithm = exec("./scripts/generate_simulation_file.sh " + "\"[" + auxList + "]\"",
             (error, stdout, stderr) => {
                 console.log(stdout);
                 console.log(stderr);
                 if (error !== null) {
                     console.log(`exec error: ${error}`);
                 }
         });

        // Runs a shell script that generates the CloudSIM simulation file

        var file_name = algorithm_location.split('/')
        file_name = file_name[file_name.length - 1]

        var new_file_name = file_name.split("_" + String(algorithm_version));
        new_file_name = new_file_name[0];
        console.log(new_file_name);

        var generate_simulation_file = exec("./scripts/copy_algorithm.sh " + String(algorithm_location) + " " + String(process.cwd()) + " " + file_name + " " + new_file_name + ".java",
             (error, stdout, stderr) => {
                 console.log(stdout);
                 console.log(stderr);
                 if (error !== null) {
                     console.log(`exec error: ${error}`);
                 }
         });

        var run_simulation = await exec("./scripts/run_simulation.sh",
             (error, stdout, stderr) => {

                 console.log(stdout);
                 console.log(stderr);

                 directory = String(process.cwd())+'/users/' + String(req.session.user_id)  + '/simulations/';
                 name = String(token) + "_" + String(req.session.user_id) + '_' + String(algorithm_id) + '_' + String(algorithm_version) + '_' + String(req.body.parameters_selector) + '.log';

                 fs.writeFile(directory+name, [stdout, stderr, error]);

                 if (error !== null) {
                     console.log(`exec error: ${error}`);
                 }

                 var smtpTransport = nodemailer.createTransport({
                   service: "Gmail",
                   auth: {
                     user: process.env.GMAIL_USER,
                     pass: process.env.GMAIL_PASSWORD
                   }
                 });

                 host = req.get('host');
                 link = "http://"+req.get('host')+"/downloadSimulation?token="+String(token)+"&user_id="+String(req.session.user_id);

                 var mailOptions = {
                     to : req.session.email,
                     subject : "Your Simulation is Ready",
                     html : "Hello,<br> Please Click on the link to see your simulation results <br><a href="+link+">Click here to see the results</a>"
                 }

                 smtpTransport.sendMail(mailOptions, function(error, response){
                   if(error){
                     console.log(error);
                   }else{
                     console.log("Message sent: " + response.message);
                   }});

                 var delete_files = exec("./scripts/delete_simulation_file.sh " + String(process.cwd()) + " " + new_file_name + ".java",
                      (error, stdout, stderr) => {

                          console.log(stdout);
                          console.log(stderr);
                 });
         });
      }

      await pool.query('INSERT INTO simulations (researcher_id, algorithm_id, parameters_id, date, token) VALUES ($1, $2, $3, $4, $5);', [req.session.user_id, algorithm_id, req.body.parameters_selector, datetime, token]);

      res.redirect("user_page/?name="+req.session.name);

    } catch(error){
      console.log(error)
    }
  },

  async downloadSimulationResults(req, res){
    const exec = require('child_process').exec;
    var host = req.get('host');
    var file_path = '/';

    if((req.protocol+"://"+req.get('host'))==("http://"+host)){
      console.log("Domain is matched. Information is from Authentic email");

      try{
        const {rows} = await pool.query('SELECT token FROM simulations WHERE token = $1;', [req.query.token]);

        if(rows[0]){
          token = rows[0].token;

          var files = []

          var address = String(process.cwd()) + '/users/' + String(req.query.user_id) + '/simulations/';
          fs.readdirSync(address).forEach(file => {
            if(file.includes(String(req.query.token))){
              files.push(file);
            }
          });

          var arguments = "";

          files.forEach(item => {
            console.log(item);
            arguments += address + String(item) + " ";
          })

          var zip_results = await exec("./scripts/zip_results.sh "+ " " + String(address) + String(req.query.token) + " " + arguments,
               (error, stdout, stderr) => {
                   console.log(stdout);
                   console.log(stderr);
          });

          const delay = require('delay');

          await delay(500);

          fs.readdirSync(address).forEach(file => {
            if(file.includes(String(req.query.token))){
              file_path = file;
            }
          });

          return res.download(address + file_path, function(err) {
            if(err){
              console.log(err);
            }
          });
          console.log('File downloaded');
        }

      } catch (error){
        console.log(error);
      }
    }
  },
}

module.exports = Simulation;
