'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let restErrorHandler = require('./restErrorHandler');
let constants = require('../constants');
let HTTPStatus = require('http-status');

function validateLoginParams(req, res, next) {
  next();
}

function login(req, res) {
  res.status(HTTPStatus.NO_CONTENT).send({});
}

function authRoute() {
  let auth = new express.Router();
  auth.use(cors());
  auth.use(bodyParser());

  auth.post('/login', validateLoginParams, login);

  return auth;
}

module.exports = authRoute;
