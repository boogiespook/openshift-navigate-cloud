'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let _ = require('lodash');
let Schema = mongoose.Schema;

let businessGoalsSchema = new Schema({
  goals: [{
    goal : String,
    description : String,
    order : String,
    goalId : Number
  }],
  engagementId: String
}, {
  timestamps: true
});


let BusinessGoals = mongoose.model('BusinessGoals', businessGoalsSchema);

exports.getByEngagementId = function (id, cb) {
  BusinessGoals.findOne({ 'engagementId': id }, cb);
}

exports.updateByEngagementId = function (data, cb) {
  BusinessGoals.findOneAndUpdate({engagementId: data.engagementId}, {$set:data}, {new: true}, cb);
}

exports.create = function (fields, cb) {
  logger.info('Saving BusinessGoals');
  let bg = new BusinessGoals(fields);
  bg.save(cb);
}
