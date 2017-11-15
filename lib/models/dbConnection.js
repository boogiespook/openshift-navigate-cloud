'use strict';

const mongoose = require('mongoose');
const logger = require('../logger');

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

  var user = process.env.MONGODB_USER;
  var password = process.env.MONGODB_PASSWORD;
  var host = process.env.MONGODB_HOST;
  var dbName = process.env.MONGODB_DB_NAME;

  if (!user || !password || !host) {
    logger.info('Connecting to Local MongoDB');
    connect('mongodb://localhost/navigate');
  }
  else {
    logger.info('Connecting to Remote Mongo');
    var mongoUrl = ['mongodb://',user,':',password,'@',host,dbName].join('');
    connect(mongoUrl);
    // connect('mongodb://briangal:pa55word@ds115625.mlab.com:15625/navigate');
  }

}
