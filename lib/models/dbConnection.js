'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');

function failed (err, cb) {
  logger.error('Failed to connect to MongoDB server ' + err);
  cb(new Error(err));
}

function success (cb) {
  logger.info('Connected to MongoDB server ');
  cb();
}

// TODO: this is just the set up for feeedhenry
// Need to edit for OpenShift
exports.connect = function (cb) {

  logger.info('Attempting to connect to Mongo DB ');

  function connect (url) {
    mongoose.connect(url, { useMongoClient: true })
      .then(() => success(cb))
      .catch((reason) => failed(reason, cb));
  }

  if (process.env.ENV_LOCAL) {
    logger.info('Attempting to connect to local Mongo DB');
    connect('mongodb://localhost/navigate');
  } else {
    logger.info('Connecting to cloud DB. ');
    // var user = process.env.MONGODB_USER;
    // var password = process.env.MONGODB_PASSWORD;
    // var host = process.env.MONGODB_HOST;
    // var url = ['mongodb://',user,':',password,'@',host,'/navigate'].join('');
    connect('mongodb://briangal:pa55word@ds115625.mlab.com:15625/navigate');
  }
}



