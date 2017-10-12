'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let _ = require('lodash');
let Schema = mongoose.Schema;

let userStorySchema = new Schema({
  usId : String,
  preType : String,
  rtiArea : String,
  actor : String,
  workshop : String,
  effort : String,
  priority : String,
  userStory : String,
  configId : String,
  engagementId : String,
}, {
  timestamps: true
});


let UserStory = mongoose.model('UserStory', userStorySchema);

exports.getByEngagementId = function (id, cb) {
  UserStory.find({ 'engagementId': id }, cb);
}

exports.getByEngagementIdAndWorkshopName = function (engagementId, workshopName, cb) {
  UserStory.find({ 'engagementId': engagementId, 'workshop': workshopName }, cb);
}

exports.create = function (fields, cb) {
  let us = new UserStory(fields);
  us.save(cb);
}

exports.deleteById = function (guid, cb) {
  UserStory.findById(guid).remove().exec(cb);
}

exports.update = function (guid, fields, cb) {
  UserStory.findByIdAndUpdate(guid, {
    $set: fields
  }, {
    'new': true
  }, cb);
};


