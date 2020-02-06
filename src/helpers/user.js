var Helper = require('./authentication_helper');
var { pool } = require('./config');

const User = {

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
      const { rows } = await pool.query(
        'INSERT INTO researchers(email, password, institution, username, name) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [req.body.email, hashPassword, req.body.institution, req.body.username, req.body.name])

      console.log(rows);
      const token = Helper.generateToken(rows[0].id)
    } catch(error) {
      console.log(error);
    }

  },

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

      console.log(rows);
      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
      const token = Helper.generateToken(rows[0].id);

      req.session.name = rows[0].name;
      req.session.user_id = rows[0].id;
      req.session.email = rows[0].email;

      return res.redirect("user_page/?name="+req.session.name);
    } catch (error) {
       return res.status(400).send(error);
    }

  },
}
module.exports = User;
