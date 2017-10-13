'use strict';

let mongoose = require('mongoose');
let logger = require('../logger');
let _ = require('lodash');
let Schema = mongoose.Schema;

let nextStepsSchema = new Schema({
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

let NextSteps = mongoose.model('NextSteps', nextStepsSchema);

exports.create = function (fields, cb) {
  logger.info('Saving NextSteps');
  let ns = new NextSteps(fields);
  ns.save(cb);
}

exports.getByEngagementId = function (id, cb) {
  NextSteps.findOne({ 'engagementId': id }, cb);
}


// TODO:
// TODO:
// TODO:
// TODO:

// function parseSteps(nextStep) {
//   return {
//     'createdOn': nextStep.fields.created,
//     'description': nextStep.fields.description,
//     'engagementId': nextStep.fields.engagementId,
//     'id': nextStep.guid,
//     'priority': nextStep.fields.priority,
//     'term': nextStep.fields.term
//   }
// }


// exports.getByEngagementId = function (id, cb) {
//   logger.info("businessGoalsModel getByEngagementId: " + id);
//   cb = cb || noop;
//   let restrictions = {
//     'eq': {
//       'engagementId': id
//     }
//   };

//   dal.list(collection, restrictions, function (err, data) {
//     if (err) {
//       cb(err);
//     }
//     else {
//       cb(null, _.keyBy(_.map(data.list, parseSteps), 'id'));
//     }
//   });
// };