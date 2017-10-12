'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let engagementConfigService = require('../services/engagementConfigService');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');

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
  engagementConfig.use(cors());
  engagementConfig.use(bodyParser());

  engagementConfig.get('/', validateGetParams, getEngagementConfig);

  return engagementConfig;
}

module.exports = engagementConfigRoute;
