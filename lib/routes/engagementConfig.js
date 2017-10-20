'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const engagementConfigService = require('../services/engagementConfigService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');

function validateGetParams(req, res, next) {
  if (!req.query.configId || req.query.configId === '') {
    restErrorHandler.badRequest(res, 'No configId provided');
  } else {
    next();
  }
}

function getEngagementConfig(req, res) {
  engagementConfigService.getEngagementConfig(req.query.configId, function (err, config) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(config);
    }
  });
}

function engagementConfigRoute() {
  let engagementConfig = new express.Router();
  engagementConfig.use(bodyParser());

  engagementConfig.get('/', authInit.ensureAuthenticated, validateGetParams, getEngagementConfig);

  return engagementConfig;
}

module.exports = engagementConfigRoute;
