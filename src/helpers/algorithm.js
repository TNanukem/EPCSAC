var { pool } = require('./config');

const Algorithm = {
  async insertAlgorithm(req, res){

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datetime = date+' '+time;

    var algorithm_name = req.body.algorithm_name;
    var algorithm_version = req.body.algorithm_version;

    try {
      const { rows } = await pool.query(
        'INSERT INTO algorithms(name, version, published, publication, insert_date, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [req.body.algorithm_name, req.body.algorithm_version, false, 'Anything', datetime, 'anything']);

      await pool.query(
        'INSERT INTO development(researcher_id, algorithm_id) VALUES ($1, $2) RETURNING *;',
        [req.session.user_id, rows[0].id]);

    } catch(error){
      console.log(error);
    }
  },

}
module.exports = Algorithm;
