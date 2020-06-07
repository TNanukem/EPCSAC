var { pool } = require('./config');
const parse = require('csv-parser')
const execSync = require('child_process').execSync;
const fs = require('fs')
path = require('path')

const Data = {

  async generateParametersTable(req, res){
    var param_id = req.query.id;

    try{
      var { rows } = await pool.query('SELECT * FROM parameters WHERE id = $1;', [param_id]);
      res.render('param_table', {parameters: rows[0]});
    } catch (error){
      console.log(error);
    }
  },

  async renderSimulation(req, res){

    if(req.session.authenticated == true){
      try{
          var {rows} = await pool.query('SELECT name, version, id FROM algorithms WHERE id in (SELECT algorithm_id FROM development WHERE researcher_id = $1)', [req.session.user_id]);

          algorithms = [];

          for(i = 0; i < rows.length; i++){
            algorithms.push(String(rows[i].id)+'.'+rows[i].name + ' v ' + String(rows[i].version));
          }

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

  async renderSimulationCompare(req, res){
    if(req.session.authenticated == true){
      try{
          var {rows} = await pool.query('SELECT name, version, id FROM algorithms WHERE id in (SELECT algorithm_id FROM development WHERE researcher_id = $1)', [req.session.user_id]);

          algorithms = [];

          for(i = 0; i < rows.length; i++){
            algorithms.push(String(rows[i].id)+'.'+rows[i].name + ' v ' + String(rows[i].version));
          }

          var {rows} = await pool.query('SELECT parameters_id FROM configuration WHERE researcher_id = $1', [req.session.user_id]);

          parameters = [];

          for(i = 0; i < rows.length; i++){
            parameters.push(rows[i].parameters_id);
          }

          var {rows} = await pool.query('SELECT doi FROM publications');

          published = []

          for(i = 0; i < rows.length; i++){
            published.push(rows[i].doi);
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

  async generateDash(req, res){

    var host = req.get('host');
    var file_path = '/';

    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
      console.log("Domain is matched. Information is from Authentic email");

      try {
        const { rows } = await pool.query('SELECT token FROM simulations WHERE token = $1;', [req.query.token]);

        if (rows[0]) {
          token = rows[0].token;

          var files = []

          var address = String(process.cwd()) + '/users/' + String(req.query.user_id) + '/simulations/';
          var command = "ls " + address + req.query.token + "*csv"
          console.log(command)
        }
      }
      catch(error){
	console.log(error);
        }
    }
    var archive = await execSync(command,
      (error, stdout, stderr) => {

        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      }).toString();

    archive = archive.replace(/(\r\n|\n|\r)/gm, "");

    const data = []
    fs.createReadStream(archive)
      .pipe(parse({ separator: ';' }))
      .on('data', (r) => {
        data.push(r);
      })
      .on('end', () => {

        response_time = []
        cloudlet = []
        exec_time = []
        success = 0
        
        for(i = 1; i < data.length; i++){

          if (data[i]['Status '] == 'SUCCESS'){
            success += 1;
          }
          
          response_time.push(parseFloat(data[i]['StartTime']))
          cloudlet.push(parseFloat(data[i]['Cloudlet']))
          exec_time.push(parseFloat(data[i]['ExecTime']))
        }
        
        link = "http://" + req.get('host') + "/downloadSimulation?token=" + String(token) + "&user_id=" + String(req.session.user_id);

        res.render('dash', {response_time:response_time, cloudlet:cloudlet, exec_time:exec_time, success: success, link: link});
      })
  }
}

module.exports = Data;
