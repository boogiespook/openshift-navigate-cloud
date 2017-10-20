'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const HTTPStatus = require('http-status');

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.  If
// the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('is authenticated');
    return next();
  }
  console.log('is not authenticated');
  res.status(HTTPStatus.UNAUTHORIZED).send();
}

function pingIt(req, res) {
  res.status(HTTPStatus.OK).send('"OK"');
}

function pingRoute() {
  let ping = new express.Router();
  ping.use(bodyParser());

  ping.get('/', authInit.ensureAuthenticated, pingIt);

  return ping;
}

module.exports = pingRoute;
