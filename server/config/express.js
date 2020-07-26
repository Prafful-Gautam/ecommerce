const express = require('express');
const path = require('path');
const config = require('./config');
const logger = require('logger');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../routes');

const app = express();
//parsing body from api
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//logger
// if(config.env === 'development') {
//   app.use(logger('dev'));
// }

//get dist folder
const distDir = path.join(__dirname, '../../dist');

//use dist folder as hosting folder by express
app.use(express.static(distDir));


//secure app http
app.use(helmet());

//allow cors
app.use(cors());

//api router //localhost:4050/api
app.use('/api', routes);

//serve the index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
