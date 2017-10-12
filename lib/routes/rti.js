'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let rtiService = require('../services/rtiService');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for business review');
  } else {
    next();
  }
}

function validatePostBody(req, res, next) {
  if (!req.body.rtiCode || req.body.rtiCode === '') {
    res.status(HTTPStatus.BAD_REQUEST).send({
      'errorCode': 'bad_request',
      'errorDescription': 'No rtiCode provided'
    });
  } else {
    next();
  }
}

function getRti(req, res) {
  rtiService.getRti(req.query.engagementId, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function createRti(req, res) {
  rtiService.createRti(req.body.engagementId, req.body.rtiCode, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function rtiRoute() {
  let rti = new express.Router();
  rti.use(cors());
  rti.use(bodyParser());

  rti.get('/', validateGetParams, getRti);
  rti.post('/', validatePostBody, createRti);

  return rti;
}

module.exports = rtiRoute;

// http://ready-to-innovate.com/results.php?hash=RZQ98
