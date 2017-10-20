'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const engagementService = require('../services/engagementService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');

function validatePutBody(req, res, next) {
  // TODO: add validation, should be minimum fields
  next();
}

function validatePostBody(req, res, next) {
  if (!req.body.name || req.body.name === '') {
    restErrorHandler.badRequest(res, 'No name provided for engagement');
  } else {
    next();
  }
}

function createEngagement(req, res) {
  engagementService.createEngagement(req.body, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

// Return all engagement
function getEngagements(req, res) {
  engagementService.getEngagements(function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function engagementRoute() {
  let engagement = new express.Router();
  engagement.use(bodyParser());

  engagement.get('/', authInit.ensureAuthenticated, getEngagements);
  engagement.post('/', authInit.ensureAuthenticated, validatePostBody, createEngagement);

  return engagement;
}

module.exports = engagementRoute;
