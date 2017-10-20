'use strict';

const engagementModel = require('../models/engagementModel');
const async = require('async');
const logger = require('../logger');
const googleSheetsService = require('./googleSheetsService');
const businessGoalsModel = require('../models/businessGoalsModel');
const workshopModel = require('../models/workshopModel');
const userStoryConfigModel = require('../models/engagementConfigModel');
const userStoryModel = require('../models/userStoryModel');
const architectureQuestionsModel = require('../models/architectureQuestionsModel');
const businessReviewModel = require('../models/businessReviewModel');
const _ = require('lodash');

function parseEngagement(engagement) {
  // TODO: move status to constants
  return {
    'createdOn': engagement.createdAt,
    'name': engagement.name,
    'engagementId': engagement._id,
    'status': engagement.status,
  }
}

exports.getEngagements = function (cb) {

  logger.info('Get Engagements');

  engagementModel.getAll(function (err, data) {
    if (err) {
      logger.error('Error getting all Engagements %s', err);
      cb(err);
    } else {
      // transform into structure suitable for client
      cb(null, _.keyBy(_.map(data, parseEngagement), 'engagementId'));
    }
  });
}

exports.createEngagement = function (params, cb) {

  let fields = {
    'name': params.name,
    'created': new Date()
  }

  function createEngage(callback) {
    // Insert to Mongo and get unique id.
    engagementModel.create(fields, function (err, data) {
      if (err) {
        logger.error('Error creating Engagement %s', err);
        callback(err);
      } else {
        let fields = JSON.parse(JSON.stringify(data));
        fields.guid = data._id;
        fields.engagementId = data._id;
        fields.status = 'IN_PROGRESS';

        console.log('returning fields');
        console.log(JSON.stringify(fields));

        callback(null, fields);

      }
    });
  }

  function getGoogleSheetDefaults(engagement, callback) {
    // Get all defaults from Google Sheets
    googleSheetsService.getAllDefaults(function (err, sheetData) {
      if (err) {
        logger.error('Error getting google sheets data %s', err);
        callback(err);
      } else {
        callback(null, engagement, sheetData);
      }
    });
  }

  function persistEngagementDefaults(engagement, sheetData, callback) {
    let archQuestions = sheetData.architecturalQuestions;
    let businessGoals = sheetData.businessGoals;
    let businessReview = sheetData.businessReviewQuestions;
    let workshops = sheetData.workshops;
    let stories = sheetData.stories;
    let guid = engagement.guid;

    function saveBusinessGoals(callback) {
      let fields = {
        'engagementId': guid,
        'goals': businessGoals.goals
      }
      businessGoalsModel.create(fields, callback);
    }

    function saveBusinessReview(callback) {
      logger.info('Saving default Business Review');
      businessReview.engagementId = guid;
      businessReviewModel.create(businessReview, callback);
    }

    function saveArchitectureQuestions(callback) {
      logger.info('Saving default Architecture Questions');
      archQuestions.engagementId = guid;
      architectureQuestionsModel.create(archQuestions, callback);
    }

    function saveWorkShopDetails(cb) {
      logger.info('Saving default WorkShop details');

      function getSave(workshop) {
        return function (callback) {
          workshop.engagementId = guid;
          workshop.status = 'NOT_STARTED';
          workshop.stakeholders = [];
          workshop.notes = [];
          workshop.scheduledDateTime = null;
          workshopModel.create(workshop, callback);
        }
      }

      let funcs = [];
      for (let i = 0; i < workshops.length; i++) {
        funcs.push(getSave(workshops[i]));
      }
      async.parallel(funcs, cb);
    }

    function saveUserStories(cb) {
      logger.info('Saving default User Stories details');

      function getSave(userStory) {
        return function (callback) {
          userStory.engagementId = guid;
          userStoryModel.create(userStory, callback);
        }
      }

      let funcs = [];
      for (let i = 0; i < stories.stories.length; i++) {
        funcs.push(getSave(stories.stories[i]));
      }
      async.parallel(funcs, cb);
    }

    function saveUserStoryConfig(cb) {
      logger.info('Saving saveUserStoryConfig');
      userStoryConfigModel.create(stories.config, cb);
    }

    function saveUserStoryData(cb) {
      logger.info('Saving default User Story Data');
      async.parallel([saveUserStories, saveUserStoryConfig], cb);
    }

    async.parallel([saveBusinessGoals, saveArchitectureQuestions, saveBusinessReview, saveWorkShopDetails, saveUserStoryData], function (err) {
      logger.log('Back from persisting google sheet data %s', err);
      callback(err, engagement);
    });
  }

  async.waterfall([createEngage,
      getGoogleSheetDefaults,
      persistEngagementDefaults
    ], cb
  );
}
