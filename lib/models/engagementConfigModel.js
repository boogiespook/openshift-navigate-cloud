'use strict';

const mongoose = require('mongoose');
const logger = require('../logger');
const Schema = mongoose.Schema;


let engagementConfigSchema = new Schema({
  'configId' : String,
  'userStoryEffort' : [{
    'effort' : String,
    'effortValue' : String
  }],
  'userStoryPriority' : [{
    'priority' : String,
    'priorityValue' : String
  }],
  'preTypes' : [ String ],
  'rtiAreas' : [ String ],
  'actors' : [ String ]
}, {
  timestamps: true
});

let EngagementConfig = mongoose.model('EngagementConfig', engagementConfigSchema);

exports.getByConfigId = function (id, cb) {
  EngagementConfig.findOne({ 'configId': id }, cb);
}

exports.create = function (fields, cb) {
  logger.info('Saving EngagementConfig');
  let ec = new EngagementConfig(fields);
  ec.save(cb);
}


