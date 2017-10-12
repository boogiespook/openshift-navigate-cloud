'use strict';

let HTTPStatus = require('http-status');
let constants = require('../constants');
let ERRORS = constants.ERRORS;
let logger = require('../logger');

exports.internalServerError = function (res, errorDescription, userMessage, errorCode) {
  logger.info('Sending Internal server error back to client, code: %s, %s', HTTPStatus.BAD_REQUEST, res.errorDescription);
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
    'errorCode': errorCode || ERRORS.INTERNAL_SERVER_ERROR.code,
    'errorDescription': errorDescription || ERRORS.INTERNAL_SERVER_ERROR.errorDescription,
    'userMessage': userMessage || ERRORS.INTERNAL_SERVER_ERROR.defaultUserMessage
  });
}

exports.badRequest = function (res, errorDescription, userMessage, errorCode) {
  logger.info('Sending Bad Request error back to client, code: %s, %s', HTTPStatus.BAD_REQUEST, res.errorDescription);
  res.status(HTTPStatus.BAD_REQUEST).send({
    'errorCode': errorCode || ERRORS.BAD_REQUEST.code,
    'errorDescription': errorDescription || ERRORS.BAD_REQUEST.errorDescription,
    'userMessage': userMessage || ERRORS.BAD_REQUEST.defaultUserMessage
  });
}
