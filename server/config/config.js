require('dotenv').config();
const envVar = process.env;
module.exports = {
  port: envVar.PORT,
  env: envVar.NODE_ENV
};
