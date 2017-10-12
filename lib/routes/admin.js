'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let HTTPStatus = require('http-status');
let restErrorHandler = require('./restErrorHandler');

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
  admin.use(cors());
  admin.use(bodyParser());

  admin.get('/reset', reset);

  return admin;
}

module.exports = adminRoute;
