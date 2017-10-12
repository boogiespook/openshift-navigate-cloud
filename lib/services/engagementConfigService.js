'use strict';

let engagementConfigModel = require('../models/engagementConfigModel');

exports.getEngagementConfig = function (configId, cb) {
  engagementConfigModel.getByConfigId(configId, function (err, data) {
    if (err) {
      logger.error('Error getting engagement config %s', err);
      cb(err);
    } else if (!data) {
      logger.error('Error getting engagement config, no items returned');
      cb(new Error('No engagement config to return'));
    } else {
      cb(null, data);
    }
  });
}
