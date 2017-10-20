'use strict';

const mongoose = require('mongoose');
const logger = require('../logger');
const _ = require('lodash');
const Schema = mongoose.Schema;


let architectureQuestionsSchema = new Schema({
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


let ArchitectureQuestions = mongoose.model('ArchitectureQuestions', architectureQuestionsSchema);

exports.getByEngagementId = function (id, cb) {
  ArchitectureQuestions.findOne({ 'engagementId': id }, cb);
}

exports.updateByEngagementId = function (data, cb) {
  ArchitectureQuestions.findOneAndUpdate({engagementId: data.engagementId}, {$set:data}, {new: true}, cb);
}

exports.create = function (fields, cb) {
  logger.info('Saving ArchitectureQuestions');
  let aq = new ArchitectureQuestions(fields);
  aq.save(cb);
}


// exports.create({
//   'engagementId' :'1234523423423'
// }, function (err, data) {
//   console.log(err);
//   console.log(JSON.stringify(data));
//   // exports.getByEngagementId('12345', (err, data) => console.log('data::: ' + data));

//   exports.updateByEngagementId({
//     'engagementId' :'1234523423423',
//     'categories': [{
//       'name': 'name'
//     }]
//   }, function (err, data) {
//     console.log(err);
//     console.log('data:::::: ' + data);
//   });
// })





