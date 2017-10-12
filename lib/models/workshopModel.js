'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;

let workShopSchema = new Schema({
  name : String,
  description : String,
  order : String,
  icon : String,
  engagementId : String,
  status : String,
  stakeholders : [ String ],
  notes : [ String ],
  scheduledDateTime : Date,
}, {
  timestamps: true
});

let Workshop = mongoose.model('Workshop', workShopSchema);

exports.getByEngagementId = function (id, cb) {
  Workshop.find({ 'engagementId': id }, cb);
}

exports.create = function (fields, cb) {
  logger.info('Saving Workshop');
  let ws = new Workshop(fields);
  ws.save(cb);
}

exports.deleteById = function (guid, cb) {
  Workshop.findById(guid).remove().exec(cb);
}

exports.update = function (guid, fields, cb) {
  Workshop.findByIdAndUpdate(guid, {
    $set: fields
  }, {
    'new': true
  }, cb);
};


