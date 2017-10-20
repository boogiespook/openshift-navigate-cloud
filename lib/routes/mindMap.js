'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const mindMapService = require('../services/mindMapService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const logger = require('../logger');

function getMap(req, res) {
  logger.info("getNextSteps route request: " + JSON.stringify(req.body));
  mindMapService.getDefault(function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function mindMapRoute() {
  let mindMap = new express.Router();
  mindMap.use(bodyParser());

  mindMap.get('/', authInit.ensureAuthenticated, getMap);

  return mindMap;
}

module.exports = mindMapRoute;
