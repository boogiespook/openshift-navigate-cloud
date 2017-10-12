'use strict';

let businessGoalsModel = require('../models/businessGoalsModel');
let logger = require('../logger');

exports.getGoals = function (engagementId, cb) {
  if (!engagementId) {
    console.log('No engagement id provided');
    return cb(new Error('No engagement id provided'));
  }

  logger.info('Looking for business goals for engagement %s', engagementId);

  businessGoalsModel.getByEngagementId(engagementId, function (err, data) {
    if (err) {
      logger.error('Error getting business goals %s', err);
      cb(err);
    } else if (!data) {
      logger.error('Error getting business goals, none returned for engagementId %s', engagementId);
      cb(new Error('No business goals to return'));
    }
    else {
      cb(null, {
        'engagementId': data.engagementId,
        'goals': data.goals
      })
    }
  });
}

exports.updateGoals = function (data, cb) {
  businessGoalsModel.updateByEngagementId(data, cb);
};
