var { pool } = require('./config');
const parse = require('csv-parser')
const execSync = require('child_process').execSync;
const fs = require('fs')
path = require('path')

const Data = {

  /**
   * This function retrieves parameters from the database and returns it to the view to be shown to the user.
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async generateParametersTable(req, res){
    var param_id = req.query.id;

    try{
      var { rows } = await pool.query('SELECT * FROM parameters WHERE id = $1;', [param_id]);
      res.render('param_table', {parameters: rows[0]});
    } catch (error){
      console.log(error);
    }
  },

  /**
   * This function retrieves all the algorithms and parameters from the researcher and render them as options on the simulation view.
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async renderSimulation(req, res){

    if(req.session.authenticated == true){
      try{

          // Retrieves and inserts the algorithms list
          var {rows} = await pool.query('SELECT name, version, id FROM algorithms WHERE id in (SELECT algorithm_id FROM development WHERE researcher_id = $1)', [req.session.user_id]);

          algorithms = [];

          for(i = 0; i < rows.length; i++){
            algorithms.push(String(rows[i].id)+'.'+rows[i].name + ' v ' + String(rows[i].version));
          }

          // Retrieves and inserts the parameters lists
          var {rows} = await pool.query('SELECT parameters_id FROM configuration WHERE researcher_id = $1', [req.session.user_id]);

          parameters = [];

          for(i = 0; i < rows.length; i++){
            parameters.push(rows[i].parameters_id);
          }

      }catch(error){
        console.log(error)
      }
      res.render('simulation', {algorithms: algorithms, parameters: parameters});
    }
    else {
      req.session.next_page = "simulation";
      res.redirect("login");
    }
  },

  /**
   * This function retrieves all the algorithms and parameters from the researcher and render them as options on the simulation compare view.
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async renderSimulationCompare(req, res){
    if(req.session.authenticated == true){
      try{
          
          // Retrieves and inserts the algorithms list
          var {rows} = await pool.query('SELECT name, version, id FROM algorithms WHERE id in (SELECT algorithm_id FROM development WHERE researcher_id = $1)', [req.session.user_id]);

          algorithms = [];

          for(i = 0; i < rows.length; i++){
            algorithms.push(String(rows[i].id)+'.'+rows[i].name + ' v ' + String(rows[i].version));
          }

          // Retrieves and inserts the parameters list
          var {rows} = await pool.query('SELECT parameters_id FROM configuration WHERE researcher_id = $1', [req.session.user_id]);

          parameters = [];

          for(i = 0; i < rows.length; i++){
            parameters.push(rows[i].parameters_id);
          }

          // Retrieves and inserts the algorithms names list
          var {rows} = await pool.query('SELECT name FROM algorithms');

          published = []

          for(i = 0; i < rows.length; i++){
            published.push(rows[i].name);
          }


      }catch(error){
        console.log(error)
      }
      res.render('simulation_compare', {algorithms: algorithms, parameters: parameters, published: published});
    }
    else {
      req.session.next_page = "simulation_compare";
      res.redirect("login");
    }
  },

  /**
   * This function renders the dashboard once the user clicks on teh link sent by e-mail
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async generateDash(req, res){

    var host = process.env.HOST;
    var file_path = '/';


    if ((req.protocol + "://" + host) == ("http://" + host)) {
      console.log("Domain is matched. Information is from Authentic email");
    }

      try {
        // Selects the simulation from its token
        const { rows } = await pool.query('SELECT token FROM simulations WHERE token = $1;', [req.query.token]);

        if (rows[0]) {
          token = rows[0].token;

          var files = []

          var address = String(process.cwd()) + '/users/' + String(req.query.user_id) + '/simulations/';
          var command = "ls " + address + req.query.token + ".zip"
        }
      }
      catch(error){
	console.log(error);
    }

    // verify if there is a zip file
    try{
      console.log('Verifying zip file');
      var archive = await execSync(command,
        (error, stdout, stderr) => {

          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
        }).toString();

        // Unzip the file
        var zip_results = await execSync("./scripts/unzip_results.sh " + " " + String(address) + " " + String(req.query.token),
          (error, stdout, stderr) => {
          });

    } catch(error){
      console.log(error)
      console.log('No Zip file')
    }

    var command = "ls " + address + req.query.token + "*csv"
    // ls the folder to get the files
    var archive = await execSync(command,
      (error, stdout, stderr) => {

        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      }).toString();
    
    archive = archive.split('\n');

    response_time_obj = [];
    cloudlet_obj = [];
    exec_time_obj = [];
    success_obj = [];
    failure_obj = [];
    names_obj = [];
    
    for(i = 0; i < archive.length-1; i++){
      
      const data = []

      archive_ = archive[i].replace(/(\r\n|\n|\r)/gm, "");

      let name = archive_.split('/')
      name = name[name.length - 1]
      
      // Read each of the files
      fs.createReadStream(archive_)
        .pipe(parse({ separator: ';' }))
        .on('data', (r) => {
          data.push(r);
        })
        .on('end', () => {
          names_obj.push(name.split('_')[1].split('-')[0] + name.split('_')[1].split('-')[1])
          response_time = [];
          cloudlet = [];
          exec_time = [];
          success = 0;
          failure = 0;

          // Parse the csvs to get the relevant information
          for (i = 1; i < data.length; i++) {

            if (data[i]['Status '] == 'SUCCESS') {
              success += 1;
            }
            else {
              failure += 1;
            }

            response_time.push(parseFloat(data[i]['StartTime']))
            cloudlet.push(parseFloat(data[i]['Cloudlet']))
            exec_time.push(parseFloat(data[i]['ExecTime']))
          }

          success = (success / data.length) * 100;
          failure = (failure / data.length) * 100;

          response_time_obj.push(response_time)

          cloudlet_obj.push(cloudlet)

          exec_time_obj.push(exec_time)

          success_obj.push(success)
          failure_obj.push(failure)

          link = "http://" + host +"/downloadSimulation?token=" + String(token) + "&user_id=" + String(req.session.user_id);
        })
    }

    const delay = require('delay');
    
    await delay(1000);
    // Renders the dashboard
    res.render('dash', {
      response_time: JSON.stringify(response_time_obj), cloudlet: JSON.stringify(cloudlet_obj), exec_time: JSON.stringify(exec_time_obj),
      success: success_obj, failure: failure_obj, names: names_obj, link: link
    }); 

  },

  /**
   * 
   * This function renders the user profile
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   * @param {int} user_id The id of the user which the profile must be rendered
   */
  async renderUserProfile(req, res){
    
    // Retrieves the data from the user from the database

    if (req.query.id == null | req.query.id == 'undefined') {
      
      if (req.session.user_id == null){
        req.session.next_page = "user";
        res.redirect("login");
        return;
      }

      else{
        var id = req.session.user_id;
      }
    }

    else {
      var id = req.query.id;
    }

    try{
      var { rows } = await pool.query('SELECT * FROM researchers WHERE id = $1', [id]);

      var picture = 'images/users/' + id + '/photo';

      user_info = rows

      var { rows } = await pool.query('SELECT name, version, id FROM algorithms WHERE id in (SELECT algorithm_id FROM development WHERE researcher_id = $1)', [id]);
      algorithms = rows

      res.render('user', {name: user_info[0].name, profile_picture: picture, bio: user_info[0].bio, inst: user_info[0].institution, algos: algorithms});
    }
    catch (error){
      console.log(error);
    }
    
  },


  /**
   *
   * This function renders the algorithm page
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   * @param {int} algo_id The id of the algorithm which the page must be rendered
   */
  async renderAlgorithmPage(req, res) {

    // Retrieves the data from the algorithm from the database

    if (req.query.id == null | req.query.id == 'undefined') {
      res.status(404).render('404');
    }

    else {
      var id = req.query.id;
    }

    try {
      var { rows } = await pool.query('SELECT * FROM algorithms WHERE id = $1', [id]);
      algo_info = rows

      var { rows } = await pool.query('SELECT * FROM development INNER JOIN researchers ON researcher_id = researchers.id AND algorithm_id = $1 ', [id]);

      developers = rows

      // Verifying if the logged user is an owner of the algorithm
      var owners = []
      for(i = 0; i < developers.length; i++){
        owners.push(developers[i].researcher_id)
      }
      var is_owner = owners.includes(req.session.user_id)

      if(algo_info.published == false){
        doi = false
      } else{
        doi = algo_info[0].publication
      }

      res.render('algorithm_info', { name: algo_info[0].name, version: algo_info[0].version, description: algo_info[0].description, dev: developers, owner: is_owner, id: id , doi: doi});
    }
    catch (error) {
      console.log(error);
    }

  },

  /**
   *
   * This function renders the algorithm page
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   * @param {string} q The query of the search
   */
  async renderSearch(req, res){
    if (req.query.q == null | req.query.q == 'undefined'| req.query.q == ''){
      return res.render('error', { message: "No query search" });
    }

    try{
      // Searches all users with name related to the query
      var { rows } = await pool.query("SELECT * FROM researchers WHERE name ILIKE $1", ['%' + req.query.q + '%']);
      users = rows

      // Searches all algorithms with name related to the query
      var { rows } = await pool.query("SELECT * FROM algorithms WHERE name ILIKE $1", ['%' + req.query.q + '%']);
      algorithms = rows

      if(users.length == 0 & algorithms.length == 0){
        return res.render('error', { message: "No results from search" });
      }

      res.render('search_results', {users: users, algorithms: algorithms})
    }
    catch (error) {
      console.log(error)
    }
  }

}

module.exports = Data;
