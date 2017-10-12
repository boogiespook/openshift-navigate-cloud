'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;

let engagement = new Schema({
  name: String,
  status: String
}, {
  timestamps: true
});

let Engagement = mongoose.model('Engagement', engagement);

exports.getAll = function (cb) {
  Engagement.find({}, cb);
}

exports.create = function (fields, cb) {
  logger.info('Saving Engagement');
  let en = new Engagement(fields);
  en.save(cb);
}
