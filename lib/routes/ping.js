'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let HTTPStatus = require('http-status');

function pingIt(req, res) {
  res.status(HTTPStatus.OK).send('"OK"');
}

function pingRoute() {
  let ping = new express.Router();
  ping.use(cors());
  ping.use(bodyParser());

  ping.get('/', pingIt);

  return ping;
}

module.exports = pingRoute;
