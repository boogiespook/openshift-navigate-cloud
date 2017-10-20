'use strict';

const nextStepsModel = require('../models/nextStepsModel');

exports.getNextSteps = function (engagementId, cb) {
  nextStepsModel.getByEngagementId(engagementId, cb);
};

exports.createNextSteps = function (data, cb) {
  nextStepsModel.create(data, cb);
};



// {
//     "count": 3,
//     "list": [
//         {
//             "type": "NextSteps",
//             "guid": "59ba8656b119054a2d59ea83",
//             "fields": {
//                 "engagementId": "12312312321",
//                 "name": "Asdfsadf",
//                 "_createDateTime": 1505396310226
//             }
//         },
//         {
//             "type": "NextSteps",
//             "guid": "59ba865cb119054a2d59ea84",
//             "fields": {
//                 "engagementId": "12312312321",
//                 "name": "Asdfsadf",
//                 "_createDateTime": 1505396316524
//             }
//         },
//         {
//             "type": "NextSteps",
//             "guid": "59ba865db119054a2d59ea85",
//             "fields": {
//                 "engagementId": "12312312321",
//                 "name": "Asdfsadf",
//                 "_createDateTime": 1505396317873
//             }
//         }
//     ]
// }