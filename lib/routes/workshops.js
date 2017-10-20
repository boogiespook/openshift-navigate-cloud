'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const workShopService = require('../services/workShopService');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const logger = require('../logger');

function validateGetParams(req, res, next) {
  if (!req.query.engagementId || req.query.engagementId === '') {
    restErrorHandler.badRequest(res, 'No engagementId provided for workshop list');
  } else {
    next();
  }
}

function validatePutBody(req, res, next) {
  if (!req.body.workShopId || req.body.workShopId === '') {
    restErrorHandler.badRequest(res, 'No workshopId provided for engagement');
  }

  // TODO: Possibly add more validation here
  // else if (!req.body.goals || req.body.goals === '') {
  //   res.status(HTTPStatus.BAD_REQUEST).send({
  //     'errorCode': 'bad_request',
  //     'errorDescription': 'No business goals provided for engagement'
  //   });
  // }
  else {
    next();
  }
}

function getWorkShops(req, res) {
  workShopService.getWorkShops(req.query.engagementId, function (err, dtls) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.OK).send(dtls);
    }
  });
}

function updateWorkShop(req, res) {
  workShopService.updateWorkShop(req.body, function (err) {
    if (err) {
      restErrorHandler.internalServerError(res);
    } else {
      res.status(HTTPStatus.NO_CONTENT).send({});
    }
  });
}

function workShopRoute() {
  let workShop = new express.Router();
  workShop.use(bodyParser());

  workShop.get('/', authInit.ensureAuthenticated, validateGetParams, getWorkShops);
  workShop.put('/', authInit.ensureAuthenticated, validatePutBody, updateWorkShop);

  return workShop;
}

module.exports = workShopRoute;
