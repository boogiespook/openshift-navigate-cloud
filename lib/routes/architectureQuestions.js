'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const archQuestionsService = require('../services/archQuestionsService');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const restErrorHandler = require('./restErrorHandler');

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for architecture questions');
  } else {
    next();
  }
}

function validatePutBody(req, res, next) {
  if (!req.body.engagementId || req.body.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for architecture questions');
  }
  // TODO: could probably add more validation here.
  // else if (!req.body.goals || req.body.goals === '') {
  //   res.status(HTTPStatus.BAD_REQUEST).send({
  //     'errorCode': 'bad_request',
  //     'errorDescription': 'No business goals provided for architecture questions'
  //   });
  // }
  else {
    next();
  }
}

// Get business goals based on an engagement id
function getArchitectureQuestions(req, res) {
  archQuestionsService.getArchQuestions(req.query.engagementId, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function updateArchitectureQuestions(req, res) {
  archQuestionsService.updateArchQuestions(req.body, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function archQuestionsRoute() {
  let archQuestions = new express.Router();
  archQuestions.use(bodyParser());

  archQuestions.get('/', authInit.ensureAuthenticated, validateGetParams, getArchitectureQuestions);
  archQuestions.put('/', authInit.ensureAuthenticated, validatePutBody, updateArchitectureQuestions);

  return archQuestions;
}

module.exports = archQuestionsRoute;
