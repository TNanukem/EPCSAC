// This helper handles all the user related functions

var Helper = require('./authentication_helper');
var { pool } = require('./config');
var nodemailer = require("nodemailer");
require('dotenv').config()

const User = {

  /**
   * Creates a new user in the database based on the form, and sends the confirmation e-mail.
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.render('error', {message: "The e-mail or the password is missing"});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.render('error', {message: "The inserted email is invalid"});
    }

    const hashPassword = Helper.hashPassword(req.body.password);

    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var institution = req.body.institution;

    try {

      // Random token to verify e-mail
      var token = Math.floor((Math.random() * 100) + 5405);

      // Inserts the new user in the database and then redirects it to user page
      const { rows } = await pool.query(
        'INSERT INTO researchers(email, password, institution, username, name, token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [req.body.email, hashPassword, req.body.institution, req.body.username, req.body.name, token])

        // Sending the confirmation email
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
          }
        });

        host = process.env.HOST;
        link = host+"/verify?id="+token+"&email="+req.body.email;

        var mailOptions = {
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please access " +link+ "to verify your email.<br>"
        }

        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
            console.log(error);
          }else{
            console.log("Message sent: " + response.message);
          }});

        res.redirect("need_confirmation")

    } catch(error) {
      console.log(error);
    }

  },

  /**
   * Verifies the email of the user and updates the database if the validation is valid.
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async verify(req, res){

    process.env.HOST;
    // Verifies the domain
    if((req.protocol+"://"+req.get('host'))==("http://"+host)){

      console.log("Domain is matched. Information is from Authentic email");

      try{
        const {rows} = await pool.query('SELECT * FROM researchers WHERE email = $1', [req.query.email]);
        var user_id = rows[0].id;

        if(rows[0]){
          if(req.query.id == rows[0].token){
            console.log('User verified');
            await pool.query('UPDATE researchers SET verified = true WHERE email = $1', [req.query.email]);

            // Creates a user folder inside the project
            const exec = require('child_process').exec;

            var create_user_folders = exec("./scripts/create_user_folders.sh " + String(user_id),
                 (error, stdout, stderr) => {
                     console.log(stdout);
                     console.log(stderr);
                     if (error !== null) {
                         console.log(`exec error: ${error}`);
                     }
             });

            res.redirect('login');
          }
        }
      } catch(error){
        console.log(error);
      }
    }
  },

  /**
   * Proccess the login request from some user and redirects him to the user page if everything is correct
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async login(req, res){

    // Verifies if there is a missing value or if the e-mail is invalid
    if (!req.body.email || !req.body.password) {
      return res.render('error', {message: "The e-mail or the password is missing"});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.render('error', {message: "The inserted email is invalid"});
    }

    try {

      // Credentials verification
      const { rows } = await pool.query(
        'SELECT * FROM researchers WHERE email = $1', [req.body.email])

      if (!rows[0]) {
        return res.render('error', {message: "The credentials you provided are incorrect"});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.render('error', {message: "The credentials you provided are incorrect"});
      }

      // Stops the login if the user has not verified it's account
      if(rows[0].verified == false){
        return res.redirect('need_confirmation')
      }

      req.session.name = rows[0].name;
      req.session.user_id = rows[0].id;
      req.session.email = rows[0].email;
      req.session.authenticated = true;

      // Redirects the user to its user page
      if(req.session.next_page == "user_page" || req.session.next_page == undefined){
          return res.redirect("user_page?name="+req.session.name);
      }
      else{
        return res.redirect(req.session.next_page);
      }

    } catch (error) {
       return res.render('error', {message: error});
    }

  },

  /**
   * Logs out the user from the system
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async logout(req, res){
    req.session.authenticated = false;
    res.redirect("/");
  },

  /**
   * Updates the user profile information given form
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async update_information(req, res){
    console.log(req.body)
    var { rows } = await pool.query('SELECT * FROM researchers WHERE id = $1', [req.session.user_id]);

    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res.render('error', { message: "The password you provided is incorrect" });
    }

    if (req.body.bio == '') {
      bio = rows[0].bio;
    } else{
      bio = req.body.bio
    }

    if (req.body.institution == '') {
      institution = rows[0].institution;
    } else{
      institution = req.body.institution
    }

    var location = String(process.cwd()) + '/public/images/users/' + String(req.session.user_id) + "photo";
    pool.query('UPDATE researchers SET institution = $1, bio = $2, photo_loc = $3 WHERE id = $4', [institution, bio, location, req.session.user_id], (err, res) => {
      console.log(err)
    })

    res.redirect('user_page');

  },

    /**
   * Updates the user account information given form
   * @param {request} req The request variable from the caller
   * @param {response} res The response variable from the caller
   */
  async update_account(req, res) {

    var { rows } = await pool.query('SELECT * FROM researchers WHERE id = $1', [req.session.user_id]);

    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res.render('error', { message: "The password you provided is incorrect" });
    }

    if (req.body.new_password == '') {
      password = rows[0].password;
    } else {
      password = req.body.new_password
      console.log(password)
      password = Helper.hashPassword(password);
    }

    if (req.body.email == '') {
      email = rows[0].email;
    } else {
      email = req.body.email
    }

    console.log(email)
    console.log(password)
    try{
      pool.query('UPDATE researchers SET password = $1, email = $2 WHERE id = $3', [password, email, req.session.user_id], (err, res) => {
        console.log(err)
      });
    }
    catch (err){
      console.log(err)
    }

    res.redirect('user_page');
  }
}
module.exports = User;
