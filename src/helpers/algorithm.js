// This function handles the algorithm related functions

var Helper = require('./authentication_helper');
var { pool } = require('./config');
alert = require('alert');

const Algorithm = {

  /**
   * Inserts a new algorithm in the database from the upload form
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async insertAlgorithm(req, res){

    // Retrieves data from the day of the upload and from the forms of the user
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datetime = date+' '+time;

    var algorithm_name = req.body.algorithm_name;
    var algorithm_version = req.body.algorithm_version;
    var description = req.body.description
    var published_checkbox = req.body.published;
    var published = false;
    var doi = null;

    /// Blocks internal classes from cloudsim-plus to avoid errors
    var not_allowed_names = ["CloudletSchedulerTimeShared", "CloudletSchedulerSpaceShared", 
      "CloudletSchedulerNull", "CloudletSchedulerCompletelyFair", "CloudletSchedulerAbstract", 
    "CloudletScheduler"];

    if (not_allowed_names.includes(algorithm_name)){
      console.log('Not allowed name')
      alert('This algorithm name is now allowed, please re-upload with a different name!');
      return
    }

    if(published_checkbox != null){
      doi = req.body.doi;
      published = true;
    }

    try {
      // Updates the algorithms table
      const { rows } = await pool.query(
        'INSERT INTO algorithms(name, version, published, publication, insert_date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [req.body.algorithm_name, req.body.algorithm_version, published, doi, datetime, description]);

      var location = String(process.cwd()) + '/users/' + String(req.session.user_id) + "/algorithms/" + algorithm_name + "_" + algorithm_version + ".java";

      await pool.query('UPDATE algorithms SET location = $1 WHERE id = $2', [location, rows[0].id]);

      // Updates the development table
      await pool.query(
        'INSERT INTO development(researcher_id, algorithm_id) VALUES ($1, $2) RETURNING *;',
        [req.session.user_id, rows[0].id]);

        return true;
    } catch(error){
      console.log(error);
    }
  },

  /**
   * Allows or not the rendering of the algorithm update page
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async renderUpdateAlgorithmDescription(req, res) {
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
      for (i = 0; i < developers.length; i++) {
        owners.push(developers[i].researcher_id)
      }
      var is_owner = owners.includes(req.session.user_id)

      if(is_owner == false){
        return res.render('error', { message: "You are not the owner of this algorithm!" });
      }

      return res.render('algorithm_update', { name: algo_info[0].name, version: algo_info[0].version, description: algo_info[0].description, dev: developers, owner: is_owner });
    }
    catch (error) {
      console.log(error);
    }
  },

  async updateAlgorithmDescription(req, res) {
    // Retrieves the data from the algorithm from the database

    if (req.query.id == null | req.query.id == 'undefined') {
      res.status(404).render('404');
    }

    else {
      var id = req.query.id;
    }

    try {

      var { rows } = await pool.query('SELECT * FROM researchers WHERE id = $1', [req.session.user_id]);
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.render('error', { message: "The password you provided is incorrect" });
      }

      var { rows } = await pool.query('SELECT * FROM algorithms WHERE id = $1', [id]);

      if (req.body.description == '') {
        description = rows[0].description
      } else {
        description = req.body.description
      }

      pool.query('UPDATE algorithms SET description = $1 WHERE id = $2', [description, id], (err, res) => {
        console.log(err)
      });

      res.render("algorithm_info?id=" + id);

    }
    catch (error) {
      console.log(error);
    }
  },

  /**
     * Updates the algorithm description
     * @param {request} req The request variable from the caller
     * @param {response} res The response variable from the caller
     */
  async updateAlgorithmDescription(req, res) {
    // Retrieves the data from the algorithm from the database

    if (req.query.id == null | req.query.id == 'undefined') {
      res.status(404).render('404');
    }

    else {
      var id = req.query.id;
    }

    try {

      var { rows } = await pool.query('SELECT * FROM researchers WHERE id = $1', [req.session.user_id]);
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.render('error', { message: "The password you provided is incorrect" });
      }

      var { rows } = await pool.query('SELECT * FROM algorithms WHERE id = $1', [id]);

      if(req.body.description == ''){
        description = rows[0].description
      } else{
        description = req.body.description
      }

      pool.query('UPDATE algorithms SET description = $1 WHERE id = $2', [description, id], (err, res) => {
        console.log(err)
      });

      res.render("user_page");
      
    }
    catch (error) {
      console.log(error);
    }
  },

}
module.exports = Algorithm;
