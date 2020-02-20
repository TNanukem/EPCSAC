var { pool } = require('./config');

const Data = {

  async renderSimulation(req, res){

    if(req.session.authenticated == true){
      try{
          var {rows} = await pool.query('SELECT name, version, id FROM algorithms WHERE id in (SELECT algorithm_id FROM development WHERE researcher_id = $1)', [req.session.user_id]);

          algorithms = []

          for(i = 0; i < rows.length; i++){
            algorithms.push(String(rows[i].id)+'.'+rows[i].name + ' v' + String(rows[i].version));
          }

      }catch(error){
        console.log(error)
      }
      console.log(algorithms);
      res.render('simulation', {algorithms: algorithms});
    }
    else {
      req.session.next_page = "simulation";
      res.redirect("login");
    }
  }

}


module.exports = Data;
