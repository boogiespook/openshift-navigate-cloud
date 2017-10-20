'use strict';

const privatekey = require('../privatekey.json');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const async = require('async');
const _ = require('lodash');
const logger = require('../logger');


// TODO: need to tidy this up

function getSheetData(auth, range, type, keys, callback) {
  let sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1IBZ7pyw8BYJYq86iDheegdQfPFcIldcyWHEhJZe2VKo',
    range: range,
  }, function (err, response) {
    if (err) {
      logger.error('The google sheets API returned an error: ' + err);
      callback(err);
    } else {
      logger.info('Back from getting %s details ', type);

      let result = [];
      _.each(response.values, function (value) {
        result.push(_.zipObject(keys, value));
      })
      callback(null, result);
    }
  });
}

function getSingleColumnSheetData(auth, range, type, callback) {
  let sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1IBZ7pyw8BYJYq86iDheegdQfPFcIldcyWHEhJZe2VKo',
    range: range,
  }, function (err, response) {
    if (err) {
      logger.error('The google sheets API returned an error: ' + err);
      callback(err);
    } else {
      logger.info('Back from getting %s details ', type);

      // let result = [];
      // _.each(response.values, function (value) {
      //   result.push(_.zipObject(keys, value));
      // })
      callback(null, _.flatten(response.values));
    }
  });
}

function getAll(auth, cb) {

  function getBusinessGoals(callback) {
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1IBZ7pyw8BYJYq86iDheegdQfPFcIldcyWHEhJZe2VKo',
      range: 'Business_Goals!A2:W',
    }, function (err, response) {
      if (err) {
        logger.info('The API returned an error: ' + err);
        callback(err);
      } else {
        logger.info('Back from getting business goals');

        let result = {};
        result.goals = _.map(response.values, function (row, i) {
          return {
            'goal': row[0],
            'description': row[1],
            'order': row[2],
            'goalId': i+1
          }
        });

        callback(null, result);
      }
    });
  }

  function getBusinessReviewQuestions(callback) {
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1IBZ7pyw8BYJYq86iDheegdQfPFcIldcyWHEhJZe2VKo',
      range: 'Business_Review!A2:W',
    }, function (err, response) {
      if (err) {
        logger.error('The API returned an error: ' + err);
        callback(err);
      } else {
        logger.info('Back from getting architecture questions');

        // let keys = ['Question_Text', 'Type', 'Category'];
        let keys = ['questionText', 'fieldType', 'category', 'options', 'icon'];
        let questions = [], question;

        _.each(response.values, function (value, index) {
          question = _.zipObject(keys, value);
          question.qid = 'qs-' + (parseInt(index)+1).toString();
          question.answer = '';
          if (question.fieldType != 'FreeText') {
            question.freeText = '';
          }
          if (!question.options) {
            delete question.options;
          }
          else {
            logger.info('question.options::: ');
            logger.info(question.options);
            let opts = question.options.split(',');
            question.options = [];
            _.each(opts, function (opt) {
              question.options.push({
                'key': opt,
                'value': opt
              })
            });
          }
          questions.push(question);
        })

        let categories = _.uniq(_.map(questions, 'category'));
        let endResult = {
          'categories': []
        }
        _.each(categories, function (cat) {
          let qs = _.filter(questions, ['category', cat]);
          endResult.categories.push({
            'name': cat,
            'questions': qs,
            'summary': '',
            'icon': qs && qs[0].icon,
            'forecast': 'SUN'
          })
          let cats = endResult.categories;
          cats[cats.length - 1].questions.forEach(function (v) {
            delete v.category;
          });
        })

        callback(null, endResult);
      }
    });
  }

  function getArchitectureQuestions(callback) {
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1IBZ7pyw8BYJYq86iDheegdQfPFcIldcyWHEhJZe2VKo',
      range: 'Architecture_Questions!A2:W',
    }, function (err, response) {
      if (err) {
        logger.info('The API returned an error: ' + err);
        callback(err);
      } else {
        logger.info('Back from getting architecture questions');

        // let keys = ['Question_Text', 'Type', 'Category'];
        let keys = ['questionText', 'fieldType', 'category', 'options', 'icon'];
        let questions = [], question;

        _.each(response.values, function (value, index) {
          question = _.zipObject(keys, value);
          question.qid = 'qs-' + (parseInt(index)+1).toString();
          question.answer = '';
          if (question.type != 'FreeText') {
            question.freeText = '';
          }
          if (!question.options) {
            delete question.options;
          }
          else {
            logger.info('question.options::: ');
            logger.info(question.options);
            let opts = question.options.split(',');
            question.options = [];
            _.each(opts, function (opt) {
              question.options.push({
                'key': opt,
                'value': opt
              })
            });
          }

          questions.push(question);
        })

        let categories = _.uniq(_.map(questions, 'category'));
        let endResult = {
          'categories': []
        }
        _.each(categories, function (cat) {
          let qs = _.filter(questions, ['category', cat]);
          endResult.categories.push({
            'name': cat,
            'questions': qs,
            'summary': '',
            'icon': qs && qs[0].icon,
            'forecast': 'SUN'
          })
          let cats = endResult.categories;
          cats[cats.length - 1].questions.forEach(function (v) {
            delete v.category;
          });
        })

        // let a = {
        //   'engagementId': '1231231231',
        //   'categories': [{
        //     'name': 'security',
        //     'questions': [{
        //       'Type': 'Boolean',
        //       'Question_Text': 'Are you secure',
        //       'answer': true
        //     }, {
        //       'Type': 'FreeText',
        //       'Question_Text': 'Are you secure',
        //       'answer': 'yes, we are secure'
        //     }],
        //     'summary': 'Summary goes here',
        //     'forecast': 1
        //   }]
        // }

        callback(null, endResult);
      }
    });
  }

  function getWorkshopDetails(callback) {
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1IBZ7pyw8BYJYq86iDheegdQfPFcIldcyWHEhJZe2VKo',
      range: 'Workshops!A2:W',
    }, function (err, response) {
      if (err) {
        logger.info('The API returned an error: ' + err);
        callback(err);
      } else {
        logger.info('Back from getting workshop details');

        let keys = ['name', 'description', 'order', 'icon'];
        let result = [];

        _.each(response.values, function (value) {
          result.push(_.zipObject(keys, value));
        });

        callback(null, result);
      }
    });
  }

  function getUserStoryEffort(callback) {
    logger.info('Getting user story effort from google sheets');
    let keys = ['effort', 'effortValue'];
    getSheetData(auth, 'US_Effort!A2:W', 'User Story Effort', keys, callback);
  }

  function getUserStoryPriority(callback) {
    logger.info('Getting user story priority from google sheets');
    let keys = ['priority', 'priorityValue'];
    getSheetData(auth, 'US_Priority!A2:W', 'User Story Priority', keys, callback);
  }

  function getPreTypes(callback) {
    logger.info('Getting pre types from google sheets');
    getSingleColumnSheetData(auth, 'Pre_Type!A2:W', 'User Story Pre_Type', callback);
  }

  function getRtiAreas(callback) {
    logger.info('Getting rti areas from google sheets');
    getSingleColumnSheetData(auth, 'RTI_Area!A2:W', 'User Story RTI_Area', callback);
  }

  function getActors(callback) {
    logger.info('Getting Actors from google sheets');
    getSingleColumnSheetData(auth, 'Actors!A2:W', 'User Story Actors', callback);
  }

  function getEngagementConfig(callback) {
    async.series([
      getUserStoryEffort,
      getUserStoryPriority,
      getPreTypes,
      getRtiAreas,
      getActors
    ], function (err, data) {
      if (err) {
        callback(err);
      } else {

        logger.info('Got Engagement Config, calling back');

        callback(null, {
          'configId': (+new Date()).toString(),
          'userStoryEffort': data[0],
          'userStoryPriority': data[1],
          'preTypes': data[2],
          'rtiAreas': data[3],
          'actors': data[4]
        });
      }
    });
  }

  function getUserStories(config, callback) {
    logger.info('Getting User Stories from google sheets');
    let keys = ['usId', 'preType', 'rtiArea', 'actor', 'workshop', 'effort', 'priority', 'userStory'];

    getSheetData(auth, 'UserStories!A2:W', 'User Stories', keys, function (err, data) {
      if (err) {
        callback(err);
      } else {
        let result = {
          config: config,
          stories: data
        }

        _.each(result.stories, function (story) {
          story.configId = config.configId;
        })

        callback(null, result);
      }
    });
  }

  function getUserStorieData(callback) {
    async.waterfall([getEngagementConfig, getUserStories], callback);
  }

  async.parallel([
    getBusinessGoals,
    getArchitectureQuestions,
    getWorkshopDetails,
    getUserStorieData,
    getBusinessReviewQuestions
  ], function (err, results) {
    if (err) {
      console.error('Error getting spreadsheet data %s', err);
      cb(err);
    } else {
      cb(null, {
        'businessGoals': results[0],
        'architecturalQuestions': results[1],
        'workshops': results[2],
        'stories': results[3],
        'businessReviewQuestions': results[4],
      });
    }
  });
}

exports.getAllDefaults = function (cb) {

  // configure a JWT auth client
  let jwtClient = new google.auth.JWT(
         privatekey.client_email,
         null,
         privatekey.private_key,
         ['https://www.googleapis.com/auth/spreadsheets']);
  //authenticate request
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      logger.error('Error authorising google sheets %s', JSON.stringify(err));
      cb(err);
    } else {
      getAll(jwtClient, function (err, data) {
        if (err) {
          logger.error('Error getting all spreadsheet data %s', JSON.stringify(err));
          cb(err);
        } else {
          cb(null, data);
        }
      });
    }
  });
}





