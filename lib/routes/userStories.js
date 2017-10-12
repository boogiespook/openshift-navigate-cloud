'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let userStoryService = require('../services/userStoryService');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for user story');
  } else {
    next();
  }
}

function validatePutBody(req, res, next) {
  if (!req.body.storyId || req.body.storyId === '') {
    restErrorHandler.badRequest(res, 'No storyId provided for engagement');
  }
  // TODO: Possibly add more validation here
  // else if (!req.body.goals || req.body.goals === '') {
  //   res.status(HTTPStatus.BAD_REQUEST).send({
  //     'errorCode': 'bad_request',
  //     'errorDescription': 'No business goals provided for engagement'
  //   });
  // }
  else {
    next();
  }
}

function validateDeleteBody(req, res, next) {
  console.log("validateDeleteBody req body: ", req.query);
  if (!req.query.storyId || req.query.storyId === '') {
    restErrorHandler.badRequest(res, 'No storyId provided for engagement');
  }
  else {
    next();
  }
}

// Get User Stories based on an engagement id
function getUserStories(req, res) {
  userStoryService.getStories(req.query.engagementId, req.query.workshopName, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

// Update User Story based on an engagement id
function updateUserStory(req, res) {
  userStoryService.updateUserStory(req.body, function (err) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.NO_CONTENT).send({});
    }
  });
}

// Delete User Story based on an engagement id
function deleteUserStory(req, res) {
  userStoryService.deleteUserStory(req.query.storyId, function (err) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.NO_CONTENT).send({});
    }
  });
}

function userStoriesRoute() {
  let userStories = new express.Router();
  userStories.use(cors());
  userStories.use(bodyParser());

  userStories.get('/', validateGetParams, getUserStories);
  userStories.put('/', validatePutBody, updateUserStory);
  userStories.delete('/', validateDeleteBody, deleteUserStory);
  return userStories;
}

module.exports = userStoriesRoute;
