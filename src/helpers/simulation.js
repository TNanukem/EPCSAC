const Simulation = {

  runSimulation(req, res){
    const exec = require('child_process').exec;
    
    var generate_simulation_file = exec("./scripts/run_simulation.sh",
         (error, stdout, stderr) => {
             console.log(stdout);
             console.log(stderr);
             if (error !== null) {
                 console.log(`exec error: ${error}`);
             }
     });
  }
}

module.exports = Simulation;
