'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;
let _ = require('lodash');

let businessReviewSchema = new Schema({
  categories: [{
    name: String,
    summary : String,
    icon : String,
    forecast : String,
    questions : [{
      questionText : String,
      fieldType : String,
      icon : String,
      qid : String,
      answer : String,
      freeText: String,
      options: [{
        key: String,
        value: String
      }]
    }]
  }],
  engagementId: String
}, {
  timestamps: true
});

let BusinessReview = mongoose.model('BusinessReview', businessReviewSchema);

exports.getByEngagementId = function (id, cb) {
  BusinessReview.findOne({ 'engagementId': id }, cb);
}

exports.updateByEngagementId = function (data, cb) {
  BusinessReview.findOneAndUpdate({engagementId: data.engagementId}, {$set:data}, {new: true}, cb);
}

exports.create = function (fields, cb) {
  logger.info('Saving businessReview');
  let aq = new BusinessReview(fields);
  aq.save(cb);
}