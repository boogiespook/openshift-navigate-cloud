'use strict';

module.exports = {
  'ERRORS': {
    'INTERNAL_SERVER_ERROR': {
      'code': 'internal_server_error',
      'errorDescription': 'Internal Server Error',
      'defaultUserMessage': 'Service is currently unavailable, please try again later'
    },
    'BAD_REQUEST': {
      'code': 'bad_request',
      'errorDescription': 'Bad Request, invalid API or parameters provided.',
      'defaultUserMessage': 'Service is currently unavailable, please try again later'
    },
    'UNAUTHORISED': {
      'code': 'unauthorised',
      'errorDescription': 'User is unauthorised to perform this action',
      'defaultUserMessage': 'You are not authorised to perform this action'
    },
    'SERVICE_NOT_APPLICABLE': {
      'code': 'service_not_applicable',
      'errorDescription': 'This service is not applicable to this user.',
      'defaultUserMessage': 'This service is not applicable to this user.'
    },
    'SERVICE_UNAVAILABLE': {
      'code': 'service_unavailable',
      'errorDescription': 'Service is currently unavailable',
      'defaultUserMessage': 'Service is currently unavailable, please try again later'
    }
  }
}
