// This helper was made to help in the authentication process.

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const Helper = {
  /**
   * Uses bcrypt to hash the password before sending it to the database
   * @param {string} password The password inserted by the user
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },

  /**
   * Compares an inserted password with a hashed version of it to verify if it is correct
   * @param {string} hashPassword The hashed version of the password on the database
   * @param {string} password The inserted password on the login form
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /**
   * Uses regex to verify if an email is valid
   * @param {string} email The e-mail inserted in the form
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
}

module.exports = Helper;
