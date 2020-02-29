var { pool } = require('./config');

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
  }

}


module.exports = Data;
