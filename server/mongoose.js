const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');
const config = require('./config/config');

const mongoUri = config.mongo.uri;

const db = mongoose.connect(mongoUri, {keepAlive: true, useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {console.log('connected to mongoDb')},
    (err) => {console.log('Connection failed to db', err)}
    )


if(config.mongo.isDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

module.exports = db;
