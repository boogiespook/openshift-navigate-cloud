'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let nextStepsService = require('../services/nextStepsService');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');
let logger = require('../logger');

function validateCreateBody (req, res, next) {
  if (!req.body.engagementId || req.body.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business review');
  } else {
    next();
  }
}

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business review');
  } else {
    next();
  }
}

function getNextSteps(req, res) {
  logger.info("getNextSteps route request: " + JSON.stringify(req.body));
  nextStepsService.getNextSteps(req.query.engagementId, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function createNextSteps (req, res) {
  logger.info("createNextSteps route request: " + JSON.stringify(req.body));
  nextStepsService.createNextSteps(req.body, function (err, data) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(data);
    }
  });
}

function nextStepsRoute() {
  let nextSteps = new express.Router();
  nextSteps.use(cors());
  nextSteps.use(bodyParser());

  nextSteps.get('/', validateGetParams, getNextSteps);
  nextSteps.post('/', validateCreateBody, createNextSteps);

  return nextSteps;
}

module.exports = nextStepsRoute;
