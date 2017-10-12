'use strict';

let userStoryModel = require('../models/userStoryModel');
let _ = require('lodash');
let logger = require('../logger');

exports.getStories = function (engagementId, workshopName, cb) {

  function parseStories(story) {
    let result = JSON.parse(JSON.stringify(story));
    result.storyId = story._id;
    return result;
  }

  logger.info('Getting User Stories for engagement id '+ engagementId + ' workshop name: ' + workshopName);

  if(workshopName !== undefined && workshopName.length > 0 && workshopName.indexOf('undefined') == -1) {
    logger.info('userStoryModel.getByEngagementIdAndWorkshopName ');
    userStoryModel.getByEngagementIdAndWorkshopName(engagementId, workshopName, function (err, data) {
      if (err) {
        logger.error('Error getting user Stories %s', err);
        cb(err);
      } else {

        // logger.info('Got list of stories %s', JSON.stringify(data));
        cb(null, _.map(data, parseStories));
      }
    });
  }
  else {

    userStoryModel.getByEngagementId(engagementId, function (err, data) {
      if (err) {
        logger.error('Error getting user Stories %s', err);
        cb(err);
      } else {
        // logger.info('Got list of stories %s', JSON.stringify(data));
        cb(null, _.map(data, parseStories));
      }
    });
  }
};

exports.updateUserStory = function (userStory, cb) {
  userStoryModel.updateById(userStory, cb);
};


exports.deleteUserStory = function (guid, cb) {
  logger.info('deleteUserStory: ' + guid);
  userStoryModel.deleteById(guid, cb);
};
