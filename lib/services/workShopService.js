'use strict';

let workshopModel = require('../models/workshopModel');
let logger = require('../logger');
let _ = require('lodash');

exports.getWorkShops = function (engagementId, cb) {
  logger.info('workShopService getWorkShops for engagement id: ' + engagementId);

  function parseWorkShops(workshop) {
    var result = JSON.parse(JSON.stringify(workshop));
    result.workShopId = workshop._id;
    return result;
  }

  workshopModel.getByEngagementId(engagementId, function (err, data) {
    logger.verbose('workShopService workshopModel.getByEngagementId for engagement id response: ' + JSON.stringify(data));

    if (err) {
      logger.error('Error getting workshop details %s', err);
      cb(err);
    } else {
      cb(null, _.map(data, parseWorkShops));
    }
  });
}

exports.updateWorkShop = function (workshop, cb) {
  workshopModel.update(workshop, cb);
}

