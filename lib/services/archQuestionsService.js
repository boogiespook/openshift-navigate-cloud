'use strict';

let architectureQuestionsModel = require('../models/architectureQuestionsModel');
let logger = require('../logger');

exports.getArchQuestions = function (engagementId, cb) {

  logger.info('Looking for architect questions for engagement %s', engagementId);

  architectureQuestionsModel.getByEngagementId(engagementId, function (err, data) {
    if (err) {
      logger.error('Error getting arch review %s', err);
      cb(err);
    } else if (!data) {
      logger.error('Error getting arch questions, none returned for engagementId %s', engagementId);
      cb(new Error('No architectural questions to return'));
    } else {
      cb(null, data);
    }
  });
}

exports.updateArchQuestions = function (data, cb) {
  architectureQuestionsModel.updateByEngagementId(data, cb);
}
