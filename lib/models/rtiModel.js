'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;

let rtiSchema = new Schema({
  engagementId: String,
  base64: String
}, {
  timestamps: true
});

let Rti = mongoose.model('Rti', rtiSchema);

exports.create = function (fields, cb) {
  logger.info('Saving RTI');
  let rti = new Rti(fields);
  rti.save(cb);
}

// let collection = 'Rti',
//   logger = require('../logger'),
//   dal = require('./dal.js');

// let noop = function () {};

// exports.create = function (engagementId, base64, cb) {
//   cb = cb || noop;
//   let fields = {
//     'engagementId': engagementId,
//     'base64': base64
//   }
//   dal.create(collection, fields, cb);
// };
