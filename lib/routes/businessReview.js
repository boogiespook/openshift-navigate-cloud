'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const businessReviewService = require('../services/businessReviewService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const logger = require('../logger');

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business review');
  } else {
    next();
  }
}

function validatePutBody(req, res, next) {
  if (!req.body.engagementId || req.body.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business review');
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
function getBusinessReview(req, res) {

  logger.info('Get Business Review route');

  businessReviewService.getBusinessReview(req.query.engagementId, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function updateBusinessReview(req, res) {

  logger.info('Update Business Review route');

  businessReviewService.updateBusinessReview(req.body, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function businessReviewRoute() {
  let businessReview = new express.Router();
  businessReview.use(bodyParser());

  businessReview.get('/', authInit.ensureAuthenticated, validateGetParams, getBusinessReview);
  businessReview.put('/', authInit.ensureAuthenticated, validatePutBody, updateBusinessReview);

  return businessReview;
}

module.exports = businessReviewRoute;
