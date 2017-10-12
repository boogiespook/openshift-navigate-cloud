'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let engagementService = require('../services/engagementService');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');

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
  engagement.use(cors());
  engagement.use(bodyParser());

  engagement.get('/', getEngagements);
  engagement.post('/', validatePostBody, createEngagement);

  return engagement;
}

module.exports = engagementRoute;
