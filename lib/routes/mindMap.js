'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let mindMapService = require('../services/mindMapService');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');
let logger = require('../logger');

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
  mindMap.use(cors());
  mindMap.use(bodyParser());

  mindMap.get('/', getMap);

  return mindMap;
}

module.exports = mindMapRoute;
