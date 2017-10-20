'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const authInit = require('../services/authInit');
const businessGoalsService = require('../services/businessGoalsService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const logger = require('../logger');

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business goals');
  } else {
    next();
  }
}

function validatePutBody(req, res, next) {
  if (!req.body.engagementId || req.body.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business goals');
  } else if (!req.body.goals || req.body.goals === '') {
    restErrorHandler.badRequest(res, 'No business goals provided for update');
  } else {
    next();
  }

}

// Get business goals based on an engagement id
function getBusinessGoals(req, res) {
  logger.info("getBusinessGoals route request: " + JSON.stringify(req.body));
  businessGoalsService.getGoals(req.query.engagementId, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

// Update business goals based on an engagement id
function updateBusinessGoals(req, res) {
  logger.verbose("updateBusinessGoals route request: " + JSON.stringify(req.body));

  businessGoalsService.updateGoals(req.body, function (err) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.NO_CONTENT).send({});
    }
  });

}

function businessGoalsRoute() {
  let businessGoals = new express.Router();
  businessGoals.use(bodyParser());

  businessGoals.get('/', authInit.ensureAuthenticated, validateGetParams, getBusinessGoals);
  businessGoals.put('/', authInit.ensureAuthenticated, validatePutBody, updateBusinessGoals);

  return businessGoals;
}

module.exports = businessGoalsRoute;
