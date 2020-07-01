var { pool } = require('./config');

const Experiment = {
  /**
   * This function creates a new configuration of simulation for the user based on the forms of the Configure Experiment
   * page and then saves it on the database.
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async create(req, res){

    // The first part of the function retrieves all the information from the
    // front-end form.

    // HOST NUMBER PARAMETERS
    var checkbox_host = req.body.checkbox_host;

    if(checkbox_host != null){
      var host_max = req.body.host_max;
      var host_min = req.body.host_min;
      var host_exact = 0;
      var host_flag = true;
    }

    else {
      var host_max = 0;
      var host_min = 0;
      var host_exact = req.body.host_exact;
      var host_flag = false;
    }

    // HOST NUMBER OF PEs PARAMETERS
    var checkbox_host_pes = req.body.checkbox_host_pes;

    if(checkbox_host_pes != null){
      var host_pes_max = req.body.host_pes_max;
      var host_pes_min = req.body.host_pes_min;
      var host_pes_exact = 0;
      var host_pes_flag = true;
    }

    else {
      var host_pes_max = 0;
      var host_pes_min = 0;
      var host_pes_exact = req.body.host_pes_exact;
      var host_pes_flag = false;
    }

    // HOST RAM PARAMETERS
    var checkbox_host_ram = req.body.checkbox_host_ram;

    if(checkbox_host_ram != null){
      var host_ram_max = req.body.host_ram_max;
      var host_ram_min = req.body.host_ram_min;
      var host_ram_exact = 0;
      var host_ram_flag = true;
    }

    else {
      var host_ram_max = 0;
      var host_ram_min = 0;
      var host_ram_exact = req.body.host_ram_exact;
      var host_ram_flag = false;
    }

    // HOST BW PARAMETERS
    var checkbox_host_bw = req.body.checkbox_host_bw;

    if(checkbox_host_bw != null){
      var host_bw_max = req.body.host_bw_max;
      var host_bw_min = req.body.host_bw_min;
      var host_bw_exact = 0;
      var host_bw_flag = true;
    }

    else {
      var host_bw_max = 0;
      var host_bw_min = 0;
      var host_bw_exact = req.body.host_bw_exact;
      var host_bw_flag = false;
    }

    // HOST HD PARAMETERS
    var checkbox_host_hd = req.body.checkbox_host_hd;

    if(checkbox_host_hd != null){
      var host_hd_max = req.body.host_hd_max;
      var host_hd_min = req.body.host_hd_min;
      var host_hd_exact = 0;
      var host_hd_flag = true;
    }

    else {
      var host_hd_max = 0;
      var host_hd_min = 0;
      var host_hd_exact = req.body.host_hd_exact;
      var host_hd_flag = false;
    }

    // VM NUMBER PARAMETERS
    var checkbox_vm = req.body.checkbox_vm;

    if(checkbox_vm != null){
      var vm_max = req.body.vm_max;
      var vm_min = req.body.vm_min;
      var vm_exact = 0;
      var vm_flag = true;
    }

    else {
      var vm_max = 0;
      var vm_min = 0;
      var vm_exact = req.body.vm_exact;
      var vm_flag = false;
    }

    // VM NUMBER OF PEs PARAMETERS
    var checkbox_vm_pes = req.body.checkbox_vm_pes;

    if(checkbox_vm_pes != null){
      var vm_pes_max = req.body.vm_pes_max;
      var vm_pes_min = req.body.vm_pes_min;
      var vm_pes_exact = 0;
      var vm_pes_flag = true;
    }

    else {
      var vm_pes_max = 0;
      var vm_pes_min = 0;
      var vm_pes_exact = req.body.vm_pes_exact;
      var vm_pes_flag = false;
    }

    // VM RAM PARAMETERS
    var checkbox_vm_ram = req.body.checkbox_vm_ram;

    if(checkbox_vm_ram != null){
      var vm_ram_max = req.body.vm_ram_max;
      var vm_ram_min = req.body.vm_ram_min;
      var vm_ram_exact = 0;
      var vm_ram_flag = true;
    }

    else {
      var vm_ram_max = 0;
      var vm_ram_min = 0;
      var vm_ram_exact = req.body.vm_ram_exact;
      var vm_ram_flag = false;
    }

    // VM BW PARAMETERS
    var checkbox_vm_bw = req.body.checkbox_vm_bw;

    if(checkbox_vm_bw != null){
      var vm_bw_max = req.body.vm_bw_max;
      var vm_bw_min = req.body.vm_bw_min;
      var vm_bw_exact = 0;
      var vm_bw_flag = true;
    }

    else {
      var vm_bw_max = 0;
      var vm_bw_min = 0;
      var vm_bw_exact = req.body.vm_bw_exact;
      var vm_bw_flag = false;
    }

    // VM HD PARAMETERS
    var checkbox_vm_hd = req.body.checkbox_vm_hd;

    if(checkbox_vm_hd != null){
      var vm_hd_max = req.body.vm_hd_max;
      var vm_hd_min = req.body.vm_hd_min;
      var vm_hd_exact = 0;
      var vm_hd_flag = true;
    }

    else {
      var vm_hd_max = 0;
      var vm_hd_min = 0;
      var vm_hd_exact = req.body.vm_hd_exact;
      var vm_hd_flag = false;
    }

    // CLOUDLET NUMBER PARAMETERS
    var checkbox_cloudlet = req.body.checkbox_cloudlet;

    if(checkbox_cloudlet != null){
      var cloudlet_max = req.body.cloudlet_max;
      var cloudlet_min = req.body.cloudlet_min;
      var cloudlet_exact = 0;
      var cloudlet_flag = true;
    }

    else {
      var cloudlet_max = 0;
      var cloudlet_min = 0;
      var cloudlet_exact = req.body.cloudlet_exact;
      var cloudlet_flag = false;
    }

    // CLOUDLET NUMBER OF PEs PARAMETERS
    var checkbox_cloudlet_pes = req.body.checkbox_cloudlet_pes;

    if(checkbox_cloudlet_pes != null){
      var cloudlet_pes_max = req.body.cloudlet_pes_max;
      var cloudlet_pes_min = req.body.cloudlet_pes_min;
      var cloudlet_pes_exact = 0;
      var cloudlet_pes_flag = true;
    }

    else {
      var cloudlet_pes_max = 0;
      var cloudlet_pes_min = 0;
      var cloudlet_pes_exact = req.body.cloudlet_pes_exact;
      var cloudlet_pes_flag = false;
    }

    // CLOUDLET LENGTH PARAMETERS
    var checkbox_cloudlet_length = req.body.checkbox_cloudlet_length;

    if(checkbox_cloudlet_length != null){
      var cloudlet_length_max = req.body.cloudlet_length_max;
      var cloudlet_length_min = req.body.cloudlet_length_min;
      var cloudlet_length_exact = 0;
      var cloudlet_length_flag = true;
    }

    else {
      var cloudlet_length_max = 0;
      var cloudlet_length_min = 0;
      var cloudlet_length_exact = req.body.cloudlet_length_exact;
      var cloudlet_length_flag = false;
    }

    var checkbox_iterations = req.body.checkbox_iterations;
    var iterations_exact = req.body.iterations_exact;

    var checkbox_datacenters = req.body.checkbox_datacenters;

    if(checkbox_datacenters != null){
      var datacenters_max = req.body.datacenters_max;
      var datacenters_min = req.body.datacenters_min;
      var datacenters_exact = 0;
      var datacenters_flag = true;
    }

    else {
      var datacenters_max = 0;
      var datacenters_min = 0;
      var datacenters_exact = req.body.datacenters_exact;
      var datacenters_flag = false;
    }


    var parametersList = [iterations_exact, datacenters_exact, host_exact, host_pes_exact, host_ram_exact, host_bw_exact, host_hd_exact, vm_exact, vm_pes_exact, vm_ram_exact, vm_bw_exact, vm_hd_exact, cloudlet_exact, cloudlet_pes_exact, cloudlet_length_exact, datacenters_max, datacenters_min, datacenters_flag, host_max, host_min, host_flag, host_pes_max, host_pes_min, host_pes_flag, host_ram_max, host_ram_min, host_ram_flag, host_bw_max, host_bw_min, host_bw_flag, host_hd_max, host_hd_min, host_hd_flag,vm_max, vm_min, vm_flag, vm_pes_max, vm_pes_min, vm_pes_flag, vm_ram_max, vm_ram_min, vm_ram_flag, vm_bw_max, vm_bw_min, vm_bw_flag, vm_hd_max, vm_hd_min, vm_hd_flag, cloudlet_max, cloudlet_min, cloudlet_flag, cloudlet_pes_max, cloudlet_pes_min, cloudlet_pes_flag, cloudlet_length_max, cloudlet_length_min,cloudlet_length_flag]

    try{

      const { rows } = await pool.query(
        'INSERT INTO parameters (iterations,datacenters_exact,hosts_exact,hosts_pes_exact,hosts_ram_exact,hosts_bw_exact,hosts_hd_exact,vms_exact,vms_pes_exact,vms_ram_exact,vms_bw_exact,vms_hd_exact,cloudlets_exact,cloudlets_pes_exact,cloudlets_length_exact, datacenters_max,datacenters_min,datacenters_flag,hosts_max,hosts_min,hosts_flag,hosts_pes_max,hosts_pes_min,hosts_pes_flag,hosts_ram_max,hosts_ram_min,hosts_ram_flag,hosts_bw_max,hosts_bw_min,hosts_bw_flag,hosts_hd_max,hosts_hd_min,hosts_hd_flag,vms_max,vms_min,vms_flag,vms_pes_max,vms_pes_min,vms_pes_flag,vms_ram_max,vms_ram_min,vms_ram_flag,vms_bw_max,vms_bw_min,vms_bw_flag,vms_hd_max,vms_hd_min,vms_hd_flag,cloudlets_max,cloudlets_min,cloudlets_flag,cloudlets_pes_max,cloudlets_pes_min,cloudlets_pes_flag,cloudlets_length_max, cloudlets_length_min,cloudlets_length_flag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57) RETURNING id;', parametersList);

        // Updates the configuration table
        pool.query(
          'INSERT INTO configuration (researcher_id, parameters_id) VALUES ($1, $2)', [req.session.user_id, rows[0].id], error => {

          if (error) {
            throw error
          }
          else {
            console.log('The table configuration has been updated')
          }})

        // Redirects the user to the user page, passing his name as argument.
        res.redirect("user_page/?name="+req.session.name);
      } catch (error){
        console.log(error);
      }
    },

  }
module.exports = Experiment;
