// This helper was made to help in the authentication process.

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const Helper = {

  // Uses bcrypt to hash the password
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },

  // Compares an inserted password with a hashed version of it
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  // Uses regex to verify if an email is valid
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
}

module.exports = Helper;
