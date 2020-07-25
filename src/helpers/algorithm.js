// This function handles the algorithm related functions

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
        'INSERT INTO algorithms(name, version, published, publication, insert_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [req.body.algorithm_name, req.body.algorithm_version, published, doi, datetime]);

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

}
module.exports = Algorithm;
