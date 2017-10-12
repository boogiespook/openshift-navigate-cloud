'use strict';

let businessReviewModel = require('../models/businessReviewModel');
let logger = require('../logger');

exports.getBusinessReview = function (engagementId, cb) {

  logger.info('Looking for business review questions for engagement %s', engagementId);

  businessReviewModel.getByEngagementId(engagementId, function (err, data) {
    if (err) {
      logger.error('Error getting business review %s', err);
      cb(err);
    } else if (!data) {
      logger.error('Error getting business review, no items returned');
      cb(new Error('No business review to return'));
    } else {
      cb(null, data);
    }
  });
}

exports.updateBusinessReview = function (data, cb) {
  businessReviewModel.updateByEngagementId(data, cb);
}
