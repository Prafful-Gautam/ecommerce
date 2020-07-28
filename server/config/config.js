require('dotenv').config();
const envVar = process.env;
module.exports = {
  port: envVar.PORT,
  env: envVar.NODE_ENV,
  mongo: {
    uri: envVar.MONGODB_URI,
    port: envVar.MONGO_PORT,
    isDebug: envVar.MONGODB_DEBUG
  },
  jwtSecretKey: envVar.JWT_SECRET_KEY
};
