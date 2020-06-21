var { pool } = require('./config');
var fs = require('fs');
var nodemailer = require("nodemailer");
require('dotenv').config()
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

const Simulation = {

  /* Sequence of events: 
    - Parameters list is generated
    - Generate Simulation File
    - Simulation file and algorithm are copied to the right place
    - Simulation runs
    - Files are deleted
    - E-mail is sent.
  */

  /*
    This function generates a list of parameters to be used on the script that
    generates the simulation file.
  */
  async generateParametersList(req, algorithm_id, algorithm_version, parameters_selector, token){
    console.log('1.Starting parameters list generation\n')
    try{

        var {rows} = await pool.query('SELECT id, name, version, location FROM algorithms WHERE id = $1 AND version = $2', [algorithm_id, algorithm_version])

        if(rows[0]){
          var algorithm_class_name = rows[0].name;
          var algorithm_location = rows[0].location;
          var auxList = [];
          auxList.push("'" + String(algorithm_class_name) + "'");
          auxList.push("'" + String(algorithm_class_name) + "'");
          auxList.push("'" + String(algorithm_class_name) + "'");
        }

        var {rows} = await pool.query('SELECT iterations,datacenters_exact,hosts_exact,hosts_pes_exact,hosts_ram_exact,hosts_bw_exact,hosts_hd_exact,vms_exact,vms_pes_exact,vms_ram_exact,vms_bw_exact,vms_hd_exact,cloudlets_exact,cloudlets_pes_exact,cloudlets_length_exact, datacenters_max,datacenters_min,datacenters_flag,hosts_max,hosts_min,hosts_flag,hosts_pes_max,hosts_pes_min,hosts_pes_flag,hosts_ram_max,hosts_ram_min,hosts_ram_flag,hosts_bw_max,hosts_bw_min,hosts_bw_flag,hosts_hd_max,hosts_hd_min,hosts_hd_flag,vms_max,vms_min,vms_flag,vms_pes_max,vms_pes_min,vms_pes_flag,vms_ram_max,vms_ram_min,vms_ram_flag,vms_bw_max,vms_bw_min,vms_bw_flag,vms_hd_max,vms_hd_min,vms_hd_flag,cloudlets_max,cloudlets_min,cloudlets_flag,cloudlets_pes_max,cloudlets_pes_min,cloudlets_pes_flag,cloudlets_length_max, cloudlets_length_min,cloudlets_length_flag FROM parameters WHERE id = $1', [parameters_selector]);

        if(rows[0]){

          var i = 3;
          for(var key in rows[0]){
            auxList[i] = "'" + String(rows[0][key]) + "'";
            i++;
          }

          auxList.push("'" + String(algorithm_class_name) + "'");
          auxList.push("'" + String(algorithm_class_name) + "'");
          auxList.push("'" + String(algorithm_class_name) + "'");
          auxList.push("'" + String(process.cwd())+'/users/' + String(req.session.user_id) + '/simulations/' + "'");
          auxList.push("'" + String(token) + "'");
          auxList.push("'" + String(algorithm_class_name) + "'");

          return [auxList, algorithm_class_name, algorithm_location];
        }

    } catch (error){
      console.log('Error generating parameters list');
      console.log(error);
    }
  },

  /*
    This function receives the list of parameters and runs the script that
    generates the simulation file.
  */
  async generateSimulationFile(auxList){
    console.log('2.Starting the generation of simulation file\n');
    var copy_algorithm = execSync("./scripts/generate_simulation_file.sh " + "\"[" + auxList + "]\"",
         (error, stdout, stderr) => {
             console.log(stdout);
             console.log(stderr);
             if (error !== null) {
                 console.log(`exec error: ${error}`);
             }
     });
  },

  /*
    This function copies the algorithm file and the simulation file from the user folder
    into the cloudsim-plus correct folders.
  */
  async copyAlgorithm(algorithm_version, algorithm_location) {
    console.log('3.Copying the algorithm\n');
    var file_name = algorithm_location.split('/')
    file_name = file_name[file_name.length - 1]

    var new_file_name = file_name.split("_" + String(algorithm_version));
    new_file_name = new_file_name[0];

    var copy_algorithm = execSync("./scripts/copy_algorithm.sh " + String(algorithm_location) + " " + String(process.cwd()) + " " + file_name + " " + new_file_name + ".java",
         (error, stdout, stderr) => {
             console.log(stdout);
             console.log(stderr);
             if (error !== null) {
                 console.log(`exec error: ${error}`);
             }
     });
     return new_file_name;
  },

  /*
    This function sends an e-mail to the user with the dashboard link after the simulation is done.
  */
  async sendDownloadEmail(req, token, algorithm_class_name){

    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    host = "http://epcsac.lasdpc.icmc.usp.br/"
    link = "http://epcsac.lasdpc.icmc.usp.br/dashboard?token="+String(token)+"&user_id="+String(req.session.user_id);;

    var mailOptions = {
        to : req.session.email,
        subject : "Your Simulation for the algorithm " + algorithm_class_name + " is Ready",
        html : "Hello,<br> Please Click on the link to see your simulation results <br><a href="+link+">Click here to see the results</a>"
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
      }else{
        console.log("5. Message sent\n")
      }});
  },

  /*
    This function deletes the simulation and algorithm file from the cloudsim-plus folder.
  */
  async deleteFiles(new_file_name, algorithm_class_name){
    console.log('6. Deleting files\n');
    var delete_files = execSync("./scripts/delete_simulation_file.sh " + String(process.cwd()) + " " + new_file_name + ".java" + " " + algorithm_class_name + ".java",
         (error, stdout, stderr) => {

             console.log(stdout);
             console.log(stderr);
    });
  },

  /*
    Runs a simple simulation of one algorithm.
  */
  async runSimulation(req, res){

    console.log("\nUser", req.session.user_id, "requested a simple simulation of algorithm", String(req.body.algorithm_selector)[0], "with parameters", 
    req.body.parameters_selector, "\n");

    res.redirect("user_page/?name=" + req.session.name);

    // Data retrieval from the forms and token generation
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datetime = date+' '+time;

    var token = Math.floor((Math.random() * 100) + Math.random()*151616);

    try{

      var algorithm_id = String(req.body.algorithm_selector)[0];
      var algorithm_version = String(req.body.algorithm_selector).split(' ');
      algorithm_version = algorithm_version[algorithm_version.length - 1];

      [auxList, algorithm_class_name, algorithm_location] = await module.exports.generateParametersList(req, algorithm_id,
                                                            algorithm_version, req.body.parameters_selector, token)

      await module.exports.generateSimulationFile(auxList);

      new_file_name = await module.exports.copyAlgorithm(algorithm_version, algorithm_location);

      console.log('4. Running simulation')
      var run_simulation = await exec("./scripts/run_simulation.sh " + String(algorithm_class_name), (error, stdout, stderr) => {

        if (error !== null) {
            console.log(stderr);
        }

        directory = String(process.cwd()) + '/users/' + String(req.session.user_id) + '/simulations/';
        name = String(token) + "_" + String(req.session.user_id) + '_' + String(algorithm_id) + '_' + String(algorithm_version) + '_' + String(req.body.parameters_selector) + '.log';

        fs.writeFile(directory + name, [stdout], () => { });

        module.exports.sendDownloadEmail(req, token, algorithm_class_name);

        module.exports.deleteFiles(new_file_name, algorithm_class_name);

        pool.query('INSERT INTO simulations (researcher_id, algorithm_id, parameters_id, date, token) VALUES ($1, $2, $3, $4, $5);', [req.session.user_id, algorithm_id, req.body.parameters_selector, datetime, token]);

       }).toString();

      } catch(error){
      console.log(error)
    }
  },

  /* 
    Runs a simulation for 2 or more algorithms.
  */
  async runSimulationCompare(req, res){

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datetime = date+' '+time;

    var token = Math.floor((Math.random() * 100) + Math.random()*151616);
    var compare_name = String(req.body.published_selector).split(',');
    
    console.log("\nUser", req.session.user_id, "requested a comparison simulation. Simulation token is", token, "\n");
    
    var parameters_selector = req.body.parameters_selector;

    original_parameters = req.body.parameters_selector;
    parameters_selector = original_parameters;

    res.redirect("user_page/?name=" + req.session.name);

    try{

      var algorithm_id = String(req.body.algorithm_selector)[0]
      var algorithm_version = String(req.body.algorithm_selector).split(' ');
      algorithm_version = algorithm_version[algorithm_version.length - 1];

      var original_algorithm_id = algorithm_id;

      // Generate the simulation for the user algorithm

      [auxList, algorithm_class_name, algorithm_location] = await module.exports.generateParametersList(req, algorithm_id,algorithm_version, parameters_selector, token);

      } catch (error){
        console.log('Erro na geração da lista');
        console.log(error);
      }

      try {
        await module.exports.generateSimulationFile(auxList);

        new_file_name = await module.exports.copyAlgorithm(algorithm_version, algorithm_location);

    } catch (error){
      console.log('Erro na geração do arquivo');
      console.log(error);
    }

    try{

      var run_simulation = exec("./scripts/run_simulation.sh " + String(algorithm_class_name),
           (error, stdout, stderr) => {

               console.log(stderr);

               if (error !== null) {
                   console.log(error);
               }
              
              let finished = []
              let semaphore = false;

              for (let j = 0; j < req.body.numAlg - 1; j++) {
                finished[j] = false;
              }

              directory = String(process.cwd()) + '/users/' + String(req.session.user_id) + '/simulations/';
              name = String(token) + "_" + String(req.session.user_id) + '_' + String(algorithm_id) + '_' + String(algorithm_version) + '_' + String(parameters_selector) + '.log';
              fs.writeFile(directory + name, [stdout], () => { });

              module.exports.deleteFiles(new_file_name, algorithm_class_name);

              // Fine until here
               
              // Generates the simulation for the published algorithms
              for (let i = 0; i < req.body.numAlg - 1; i++) {
                let n_alg = req.body.numAlg;
                let j = i;
                
                try {
                  // Retrieves the data from the algorithm
                  
                  pool.query('SELECT * FROM algorithms WHERE name = $1', [String(compare_name[i])], (err, res) => {

                    algorithm_id = res.rows[0].id;
                    algorithm_version = res.rows[0].version;


                    // Parameters list generation
                    console.log('1.Starting parameters list generation', compare_name[i], '\n')
                    try {

                      pool.query('SELECT id, name, version, location FROM algorithms WHERE id = $1 AND version = $2', [algorithm_id, algorithm_version], (err, res) => {
                        if (res.rows[0]) {
                          var algorithm_class_name = res.rows[0].name;
                          var algorithm_location = res.rows[0].location;
                          var auxList = [];
                          auxList.push("'" + String(algorithm_class_name) + "'");
                          auxList.push("'" + String(algorithm_class_name) + "'");
                          auxList.push("'" + String(algorithm_class_name) + "'");
                        }

                        pool.query('SELECT iterations,datacenters_exact,hosts_exact,hosts_pes_exact,hosts_ram_exact,hosts_bw_exact,hosts_hd_exact,vms_exact,vms_pes_exact,vms_ram_exact,vms_bw_exact,vms_hd_exact,cloudlets_exact,cloudlets_pes_exact,cloudlets_length_exact, datacenters_max,datacenters_min,datacenters_flag,hosts_max,hosts_min,hosts_flag,hosts_pes_max,hosts_pes_min,hosts_pes_flag,hosts_ram_max,hosts_ram_min,hosts_ram_flag,hosts_bw_max,hosts_bw_min,hosts_bw_flag,hosts_hd_max,hosts_hd_min,hosts_hd_flag,vms_max,vms_min,vms_flag,vms_pes_max,vms_pes_min,vms_pes_flag,vms_ram_max,vms_ram_min,vms_ram_flag,vms_bw_max,vms_bw_min,vms_bw_flag,vms_hd_max,vms_hd_min,vms_hd_flag,cloudlets_max,cloudlets_min,cloudlets_flag,cloudlets_pes_max,cloudlets_pes_min,cloudlets_pes_flag,cloudlets_length_max, cloudlets_length_min,cloudlets_length_flag FROM parameters WHERE id = $1', [parameters_selector], 
                        (err, res) => {
                          if (res.rows[0]) {

                            var i = 3;
                            for (var key in res.rows[0]) {
                              auxList[i] = "'" + String(res.rows[0][key]) + "'";
                              i++;
                            }
                            auxList.push("'" + String(algorithm_class_name) + "'");
                            auxList.push("'" + String(algorithm_class_name) + "'");
                            auxList.push("'" + String(algorithm_class_name) + "'");
                            auxList.push("'" + String(process.cwd()) + '/users/' + String(req.session.user_id) + '/simulations/' + "'");
                            auxList.push("'" + String(token) + "'");
                            auxList.push("'" + String(algorithm_class_name) + "'");

                            // Generate simulation file
                            console.log('2.Starting the generation of simulation file\n');
                            var copy_algorithm = execSync("./scripts/generate_simulation_file.sh " + "\"[" + auxList + "]\"",
                              (error, stdout, stderr) => {
                                console.log(stdout);
                                console.log(stderr);
                                if (error !== null) {
                                  console.log(error);
                                }
                              });

                            console.log('3.Copying the algorithm\n');
                            var file_name = algorithm_location.split('/')
                            file_name = file_name[file_name.length - 1]

                            var new_file_name = file_name.split("_" + String(algorithm_version));
                            new_file_name = new_file_name[0];
                            

                            var copy_algorithm = execSync("./scripts/copy_algorithm.sh " + String(algorithm_location) + " " + String(process.cwd()) + " " + file_name + " " + new_file_name + ".java",
                              (error, stdout, stderr) => {
                                
                                console.log(stderr);
                                if (error !== null) {
                                  console.log(error);
                                }
                              });


                            function checkSemaphore(){
                              if(semaphore == true){
                                setTimeout(checkSemaphore, 1000);
                              }
                              else {
                                console.log("Blocking. ", new_file_name, "is released\n")

                                semaphore = true;

                                console.log("Blocking. ", new_file_name, "took the semaphore\n")

                                console.log('Running simulation for published', new_file_name);
                                var run_simulation_ = exec("./scripts/run_simulation.sh " + String(algorithm_class_name),
                                  (error, stdout, stderr) => {

                                    console.log(stderr);

                                    if (error !== null) {
                                      console.log(error);
                                    }

                                    semaphore = false;
                                    console.log("Blocking. ", new_file_name, "released the semaphore\n")

                                    directory = String(process.cwd()) + '/users/' + String(req.session.user_id) + '/simulations/';
                                    name = String(token) + "_" + String(req.session.user_id) + '_' + String(algorithm_id) + '_' + String(algorithm_version) + '_' + String(parameters_selector) + '.log';
                                    fs.writeFile(directory + name, [stdout], () => { });

                                    console.log('6. Deleting files', new_file_name, '\n');
                                    var delete_files = execSync("./scripts/delete_simulation_file.sh " + String(process.cwd()) + " " + new_file_name + ".java" + " " + algorithm_class_name + ".java",
                                      (error, stdout, stderr) => {

                                        console.log(stderr);
                                      });

                                    pool.query('INSERT INTO simulations (researcher_id, algorithm_id, parameters_id, date, token) VALUES ($1, $2, $3, $4, $5);', [req.session.user_id, original_algorithm_id, original_parameters, datetime, token]);

                                    finished[j] = true;

                                    var end = true;
                                    for (j = 0; j < n_alg - 1; j++) {
                                      if (finished[j] == false) {
                                        end = false;
                                      }
                                    }

                                    if (end == true) {
                                      var smtpTransport = nodemailer.createTransport({
                                        service: "Gmail",
                                        auth: {
                                          user: process.env.GMAIL_USER,
                                          pass: process.env.GMAIL_PASSWORD
                                        }
                                      });

                                      host = req.get('host');
                                      link = "http://" + req.get('host') + "/dashboard?token=" + String(token) + "&user_id=" + String(req.session.user_id);

                                      var mailOptions = {
                                        to: req.session.email,
                                        subject: "Your Simulation for the algorithm " + algorithm_class_name + " is Ready",
                                        html: "Hello,<br> Please Click on the link to see your simulation results <br><a href=" + link + ">Click here to see the results</a>"
                                      }

                                      smtpTransport.sendMail(mailOptions, function (error, response) {
                                        if (error) {
                                          console.log(error);
                                        } else {
                                          console.log("5. Message sent\n")
                                        }
                                      });
                                    }
                                  }).toString();
                                return;
                              }
                            }

                            checkSemaphore();
                          }
                        });

                      })

                    } catch(err){
                      console.log(err)
                    }
                    
                  })

                } catch (error) {
                  console.log('Error in parameters generation');
                  console.log(error);
                }

              }
              try {
                
              } catch (error) {
                console.log('Error when sending the email');
                console.log(error)
          }
        }).toString();

     } catch(error){
       console.log('Erro na simulação de usuário');
       console.log(error);
     }

  },

  /* 
    Retrieves the results files, zip them and return to the website to be downloaded 
  */
  async downloadSimulationResults(req, res){
    const exec = require('child_process').exec;
    var host = "http://epcsac.lasdpc.icmc.usp.br/"
    
    var file_path = '/';

    if((req.protocol+"://epcsac.lasdpc.icmc.usp.br")==("http://"+host)){
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
            arguments += String(item) + " ";
          })

          var zip_results = await exec("./scripts/zip_results.sh "+ " " + String(address) + " " + String(req.query.token) + " " + arguments,
               (error, stdout, stderr) => {
                   console.log(stdout);
                   console.log(stderr);
          });

          const delay = require('delay');

          await delay(1000);

          fs.readdirSync(address).forEach(file => {
            if(file.includes(String(req.query.token)) && file.includes(".zip")){
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
