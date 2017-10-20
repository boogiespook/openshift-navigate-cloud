'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const HTTPStatus = require('http-status');
const restErrorHandler = require('./restErrorHandler');

function reset(req, res) {

  // TODO:
  // Add some security around this - only possible in dev environment

  // dal.removeAllCollections(function (err) {
  //   if (err) {
  //     restErrorHandler.internalServerError(res);
  //   }
  //   else {
  //     res.status(HTTPStatus.NO_CONTENT).send({});
  //   }
  // })
}

function adminRoute() {
  let admin = new express.Router();
  admin.use(bodyParser());

  admin.get('/reset', authInit.ensureAuthenticated, reset);

  return admin;
}

module.exports = adminRoute;
