var { pool } = require('./config');
var fs = require('fs');

const Simulation = {

  async runSimulation(req, res){

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datetime = date+' '+time;

    try{

      req.body.parameters_id = 4;
      req.body.algorithm_id = 2;
      req.body.algorithm_version = 3;

      const {rows} = await pool.query('SELECT iterations,datacenters_exact,hosts_exact,hosts_pes_exact,hosts_ram_exact,hosts_bw_exact,hosts_hd_exact,vms_exact,vms_pes_exact,vms_ram_exact,vms_bw_exact,vms_hd_exact,cloudlets_exact,cloudlets_pes_exact,cloudlets_length_exact, datacenters_max,datacenters_min,datacenters_flag,hosts_max,hosts_min,hosts_flag,hosts_pes_max,hosts_pes_min,hosts_pes_flag,hosts_ram_max,hosts_ram_min,hosts_ram_flag,hosts_bw_max,hosts_bw_min,hosts_bw_flag,hosts_hd_max,hosts_hd_min,hosts_hd_flag,vms_max,vms_min,vms_flag,vms_pes_max,vms_pes_min,vms_pes_flag,vms_ram_max,vms_ram_min,vms_ram_flag,vms_bw_max,vms_bw_min,vms_bw_flag,vms_hd_max,vms_hd_min,vms_hd_flag,cloudlets_max,cloudlets_min,cloudlets_flag,cloudlets_pes_max,cloudlets_pes_min,cloudlets_pes_flag,cloudlets_length_max, cloudlets_length_min,cloudlets_length_flag FROM parameters WHERE id = $1', [req.body.parameters_id]);

      if(rows[0]){
        var auxList = [];

        var i = 0;
        for(var key in rows[0]){
          auxList[i] = "'" + String(rows[0][key]) + "'";
          i++;
        }

        auxList.push("'" + String(req.session.user_id) + "'");
        auxList.push("'" + String(req.body.algorithm_id) + "'");
        auxList.push("'" + String(req.body.algorithm_version) + "'");
        auxList.push("'" + String(req.body.parameters_id) + "'");
        auxList.push("'" + String(process.cwd())+'/users/' + String(req.session.user_id) + '/simulations/' + "'");

        // Runs a shell script that generates the CloudSIM simulation file

        const exec = require('child_process').exec;

        var generate_simulation_file = exec("./scripts/generate_simulation_file.sh " + "\"[" + auxList + "]\"",
             (error, stdout, stderr) => {
                 console.log(stdout);
                 console.log(stderr);
                 if (error !== null) {
                     console.log(`exec error: ${error}`);
                 }
         });

        var generate_simulation_file = exec("./scripts/run_simulation.sh",
             (error, stdout, stderr) => {

                 console.log(stdout);
                 console.log(stderr);

                 directory = String(process.cwd())+'/users/' + String(req.session.user_id)  + '/simulations/';
                 name = String(req.session.user_id) + '_' + String(req.body.algorithm_id) + '_' + String(req.body.algorithm_version) + '_' + String(req.body.parameters_id) + String(datetime) + '.log';

                 fs.writeFile(directory+name, [stdout, stderr, error]);

                 if (error !== null) {
                     console.log(`exec error: ${error}`);
                 }
         });
      }

    } catch(error){
      console.log(error)
    }
  }
}

module.exports = Simulation;
