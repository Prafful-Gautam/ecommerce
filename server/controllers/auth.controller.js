const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateToken(user) {
  const payload = JSON.stringify(user);
  return jwt.sign(payload, config.jwtSecretKey);

}

module.exports = {generateToken};
