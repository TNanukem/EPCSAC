var { pool } = require('./config');
var fs = require('fs');
var nodemailer = require("nodemailer");
require('dotenv').config()
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

/* The simulation helper method handles all the simulation-related tasks. These functions are always called
   right after the POST of the form from one of the simulation pages. 
*/

const Simulation = {

    /* Sequence of events: 
      - Parameters list is generated
      - Generate Simulation File
      - Simulation file and algorithm are copied to the right place
      - Simulation runs
      - Files are deleted
      - E-mail is sent.
    */

    /**
     * This function generates a list of parameters to be used on the script that
      generates the simulation file.
    * @param {request} req The request variable from the caller
    * @param {number} algorithm_id The id of the algorithm on the database.
    * @param {number} algorithm_version The version of the algorithm
    * @param {number} parameters_selector The id of the parameters to be used on the simulation
    * @param {number} token The simulation token
    */
    async generateParametersList(req, algorithm_id, algorithm_version, parameters_selector, token){
        console.log('1.Starting parameters list generation\n')
        try{

              // Grabs the algorithm data
              var {rows} = await pool.query('SELECT id, name, version, location FROM algorithms WHERE id = $1 AND version = $2', [algorithm_id, algorithm_version])

              if(rows[0]){
                  var algorithm_class_name = rows[0].name;
                  var algorithm_location = rows[0].location;
                  var auxList = [];
                  auxList.push("'" + String(algorithm_class_name) + "'");
                  auxList.push("'" + String(algorithm_class_name) + "'");
                  auxList.push("'" + String(algorithm_class_name) + "'");
              }
              
              // Grabs the parameters data
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

    
    /**
     * This function receives the list of parameters and runs the script that
      generates the simulation file.
    * @param {list} auxList List of parameters to be inserted on the simulation file
    */
    async generateSimulationFile(auxList){
      console.log('2.Starting the generation of simulation file\n');

      // Calls the script that generates the simulation file to be used on the simulation
      var copy_algorithm = execSync("./scripts/generate_simulation_file.sh " + "\"[" + auxList + "]\"",
          (error, stdout, stderr) => {
              console.log(stdout);
              console.log(stderr);
              if (error !== null) {
                  console.log(`exec error: ${error}`);
              }
      });
    },

    /**
     * This function copies the algorithm file and the simulation file from the user folder
      into the cloudsim-plus correct folders.
    * @param {number} algorithm_version The version of the algorithm
    * @param {string} algorithm_location The path to the algorithm inside the machine
    */
    async copyAlgorithm(algorithm_version, algorithm_location) {
        console.log('3.Copying the algorithm\n');
        var file_name = algorithm_location.split('/')
        file_name = file_name[file_name.length - 1]

        // Removes the version of the algorithm from the name file
        var new_file_name = file_name.split("_" + String(algorithm_version));
        new_file_name = new_file_name[0];

        // Calls the script that will copy the algorithm file to the right folder
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

    /**
     * This function sends an e-mail to the user with the dashboard link after the simulation is done.
     * @param {request} req The request variable from the caller
     * @param {number} token The token of the simulation
     * @param {string} algorithm_class_name The name of the algorithm
     */
    async sendDownloadEmail(req, token, algorithm_class_name, log){

        // Email authentication configuration
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        // Link to the dashboard
        host = req.get('host');
        link = "http://"+req.get('host')+"/dashboard?token="+String(token)+"&user_id="+String(req.session.user_id);

        var mailOptions = {
            to : req.session.email,
            subject : "Your Simulation for the algorithm " + algorithm_class_name + " is Ready",
            html : "Hello,<br> Please Click on the link to see your simulation results <br><a href="+link+">Click here to see the results</a>"
        }

        // Sends the e-mail
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("5. Message sent\n")
            }});
    },

    /**
     * This function sends an error e-mail when an algorithm does not compile.
     * @param {request} req The request variable from the caller
     * @param {string} log The stderr of the compilation error
     */
    async sendErrorEmail(req, log) {

        // Email authentication configuration
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        // Attaches the log error file
        var mailOptions = {
            to: req.session.email,
            subject: "Your simulation presented a compilation error",
            html: "Hello,<br> Your simulation could not be compiled because it has generated an error and therefore was deleted from the system. Please, correct the algorithm and upload it again.",
            attachments: [{
              filename: "error_log.txt",
              content: log
            }]
        }

        // Sends the e-mail
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Error message sent\n")
            }
        });
    },

    /**
     * This function deletes the simulation and algorithm file from the cloudsim-plus folder.
     * @param {*} new_file_name 
     * @param {*} algorithm_class_name 
     */
    async deleteFiles(new_file_name, algorithm_class_name){
        console.log('6. Deleting files\n');

        // Calls the script that delete the simulation file and the algorithm from the cloudsim-plus folder
        var delete_files = execSync("./scripts/delete_simulation_file.sh " + String(process.cwd()) + " " + new_file_name + ".java" + " " + algorithm_class_name + ".java",
            (error, stdout, stderr) => {

                console.log(stdout);
                console.log(stderr);
        });
    },

    /**
     * This function deletes the simulation and algorithm file from the cloudsim-plus folder.
     * @param {request} req The request variable from the caller 
     * @param {response} res The response variable from the caller
     */
    async runSimulation(req, res){

      console.log("\nUser", req.session.user_id, "requested a simple simulation of algorithm", String(req.body.algorithm_selector)[0], "with parameters", 
      req.body.parameters_selector, "\n");

      // Redirects the user to his user page
      res.redirect("user_page/?name=" + req.session.name);

      // Data retrieval from the forms and token generation
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var datetime = date+' '+time;

      var token = Math.floor((Math.random() * 100) + Math.random()*151616);

      try{

        // Process the data and generates the parameter list
        var algorithm_id = String(req.body.algorithm_selector)[0];
        var algorithm_version = String(req.body.algorithm_selector).split(' ');
        algorithm_version = algorithm_version[algorithm_version.length - 1];

        [auxList, algorithm_class_name, algorithm_location] = await module.exports.generateParametersList(req, algorithm_id,
                                                              algorithm_version, req.body.parameters_selector, token)

        // Handles the file manipulation  
        await module.exports.generateSimulationFile(auxList);

        new_file_name = await module.exports.copyAlgorithm(algorithm_version, algorithm_location);

        console.log('4. Running simulation')
        var run_simulation = await exec("./scripts/run_simulation.sh " + String(algorithm_class_name), (error, stdout, stderr) => {

          if(stderr.includes('Error')){
            console.log(algorithm_class_name, "\nPresented an error\n");
            module.exports.sendErrorEmail(req, stdout);
            module.exports.deleteFiles(new_file_name, algorithm_class_name);
            return;
          } else {
            console.log("\nNo Errors happened\n");
          }

          directory = String(process.cwd()) + '/users/' + String(req.session.user_id) + '/simulations/';
          name = String(token) + "_" + String(req.session.user_id) + '_' + String(algorithm_id) + '_' + String(algorithm_version) + '_' + String(req.body.parameters_selector) + '.log';

          fs.writeFile(directory + name, [stdout], () => { });

          // Finishes the simulation by sending the e-mail and deleting files

          module.exports.sendDownloadEmail(req, token, algorithm_class_name);

          module.exports.deleteFiles(new_file_name, algorithm_class_name);

          pool.query('INSERT INTO simulations (researcher_id, algorithm_id, parameters_id, date, token) VALUES ($1, $2, $3, $4, $5);', [req.session.user_id, algorithm_id, req.body.parameters_selector, datetime, token]);

        }).toString();

        } catch(error){
        console.log(error)
      }
    },

    /**
     * Runs a simulation for 2 or more algorithms.
     * @param {request} req The request variable from the caller
     * @param {response} res The response variable from the caller
     */
    async runSimulationCompare(req, res){

      // Gets the required data
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

      // Redirects the user to the user page
      res.redirect("user_page/?name=" + req.session.name);

      try{

        var algorithm_id = String(req.body.algorithm_selector)[0]
        var algorithm_version = String(req.body.algorithm_selector).split(' ');
        algorithm_version = algorithm_version[algorithm_version.length - 1];

        var original_algorithm_id = algorithm_id;

        // Generate the simulation for the first algorithm

        [auxList, algorithm_class_name, algorithm_location] = await module.exports.generateParametersList(req, algorithm_id,algorithm_version, parameters_selector, token);

        } catch (error){
          console.log('List generation error for the first algorithm');
          console.log(error);
        }

        try {
          await module.exports.generateSimulationFile(auxList);

          new_file_name = await module.exports.copyAlgorithm(algorithm_version, algorithm_location);

      } catch (error){
        console.log('Error when generating the first algorithm file');
        console.log(error);
      }

        var run_simulation = exec("./scripts/run_simulation.sh " + String(algorithm_class_name),
            (error, stdout, stderr) => {

                if (stderr.includes('Error')) {
                  console.log(algorithm_class_name, "\nPresented an error\n");
                  module.exports.sendErrorEmail(req, stdout);
                  module.exports.deleteFiles(new_file_name, algorithm_class_name);
                  return;
                } else {
                  console.log("\nNo Errors happened\n");
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

                
                // Generates the simulation for the other algorithms
                for (let i = 0; i < req.body.numAlg - 1; i++) {
                  let n_alg = req.body.numAlg;
                  let j = i;
                  
                    // Retrieves the data from the algorithm
                    
                    pool.query('SELECT * FROM algorithms WHERE name = $1', [String(compare_name[i])], (err, res) => {

                      algorithm_id = res.rows[0].id;
                      algorithm_version = res.rows[0].version;


                      // Parameters list generation
                      console.log('1.Starting parameters list generation', compare_name[i], '\n')

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
                              
                              // Checks if the semaphore is taken
                              function checkSemaphore() {
                                if (semaphore == true) {
                                  setTimeout(checkSemaphore, 1000);
                                }
                                else {

                                  console.log("Blocking. ", algorithm_class_name, "is released\n")

                                  // Grabs the semaphore to run its own simulation
                                  semaphore = true;

                                  console.log("Blocking. ", algorithm_class_name, "took the semaphore\n")
                              
                              // Generate simulation file and cipies the files
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

                                  console.log('Running simulation for published', new_file_name, "\n");
                                  var run_simulation_ = exec("./scripts/run_simulation.sh " + String(algorithm_class_name),
                                    (error, stdout, stderr) => {
                                      
                                      if (stderr.includes('Error')) {
                                        console.log(new_file_name, "\nPresented an error\n");
                                        console.log(stderr);

                                        // Sends the error e-mail in case of failure
                                        var smtpTransport = nodemailer.createTransport({
                                          service: "Gmail",
                                          auth: {
                                            user: process.env.GMAIL_USER,
                                            pass: process.env.GMAIL_PASSWORD
                                          }
                                        });


                                        var mailOptions = {
                                          to: req.session.email,
                                          subject: "Your simulation presented a compilation error",
                                          html: "Hello,<br> Your simulation could not be compiled because it has generated an error and therefore was deleted from the system. Please, correct the algorithm and upload it again.",
                                          attachments: [{
                                            filename: "error_log.txt",
                                            content: stdout
                                          }]
                                        }

                                        smtpTransport.sendMail(mailOptions, function (error, response) {
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log("Error message sent\n")
                                          }
                                        });
                                        var delete_files = execSync("./scripts/delete_simulation_file.sh " + String(process.cwd()) + " " + new_file_name + ".java" + " " + algorithm_class_name + ".java",
                                          (error, stdout, stderr) => {

                                            console.log(stderr);
                                          });
                                        return;
                                      } else {
                                        console.log("\nNo Errors happened\n");
                                      }

                                      // Release the semaphore for the next algorithm to run
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
                                      // Sends the e-mail with the link only after all simulations have ended
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
                    })

                }
          }).toString();

    },

    /**
     * Retrieves the results files, zip them and return to the website to be downloaded
     * @param {request} req The request variable from the caller
     * @param {response} res The response variable from the caller
     */
    async downloadSimulationResults(req, res){
      const exec = require('child_process').exec;
      var host = req.get('host');
      var file_path = '/';

      // Verifies the domain
      if((req.protocol+"://"+req.get('host'))==("http://"+host)){
        console.log("Domain is matched. Information is from Authentic email");

        try{
          // Retrieves the simulation data
          const {rows} = await pool.query('SELECT token FROM simulations WHERE token = $1;', [req.query.token]);

          if(rows[0]){
            token = rows[0].token;

            var files = []

            // Retrieves the files that match the simulation token from the user folder
            var address = String(process.cwd()) + '/users/' + String(req.query.user_id) + '/simulations/';
            fs.readdirSync(address).forEach(file => {
              if(file.includes(String(req.query.token))){
                files.push(file);
              }
            });

            var args = "";

            files.forEach(item => {
              args += String(item) + " ";
            })

            // Zips the results files to be downloaded
            var zip_results = await exec("./scripts/zip_results.sh "+ " " + String(address) + " " + String(req.query.token) + " " + args,
                (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
            });

            // Waits one second for the zipping to happen
            const delay = require('delay');
            await delay(1000);

            // Sends the file to the user
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
