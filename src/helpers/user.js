var Helper = require('./authentication_helper');
var { pool } = require('./config');

const User = {

  create(req, res) {
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

    pool.query(
      'INSERT INTO researchers(email, password, institution, username, name) VALUES ($1, $2, $3, $4, $5)',
      [req.body.email, hashPassword, req.body.institution, req.body.username, req.body.name], error => {
      if (error) {
        throw error
      }
      else {
        console.log('The table researchers has been updated')
      }}
    )

  },
}
module.exports = User;
