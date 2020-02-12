// This helper handles all the user related functions

var Helper = require('./authentication_helper');
var { pool } = require('./config');
var nodemailer = require("nodemailer");
require('dotenv').config()

const User = {

  // Creates a new user
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
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

        req.session.id_user = rows[0].id;
        req.session.name = rows[0].name;
        req.session.authenticated = true;

        // Sending the confirmation email
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
          }
        });

        host = req.get('host');
        link = "http://"+req.get('host')+"/verify?id="+token;

        var mailOptions = {
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
        }

        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
            console.log(error);
          }else{
            console.log("Message sent: " + response.message);
          }});

        res.redirect("user_page/?name="+req.session.name)

    } catch(error) {
      console.log(error);
    }

  },

  // Verifies the email of the user
  async verify(req, res){
    host = req.get('host');
  },

  // Proccess the login request from some user
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }

    try {
      const { rows } = await pool.query(
        'SELECT * FROM researchers WHERE email = $1', [req.body.email])

      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }

      req.session.name = rows[0].name;
      req.session.user_id = rows[0].id;
      req.session.email = rows[0].email;
      req.session.authenticated = true;

      if(req.session.next_page == "user_page" || req.session.next_page == undefined){
          return res.redirect("user_page/?name="+req.session.name);
      }
      else{
        return res.redirect(req.session.next_page);
      }

    } catch (error) {
       return res.status(400).send(error);
    }

  },
}
module.exports = User;
