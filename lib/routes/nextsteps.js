'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const nextStepsService = require('../services/nextStepsService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const logger = require('../logger');

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
  nextSteps.use(bodyParser());

  nextSteps.get('/', authInit.ensureAuthenticated, validateGetParams, getNextSteps);
  nextSteps.post('/', authInit.ensureAuthenticated, validateCreateBody, createNextSteps);

  return nextSteps;
}

module.exports = nextStepsRoute;
