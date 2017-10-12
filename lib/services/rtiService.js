var Horseman = require('node-horseman');
var pjs = require('phantomjs').path;
var logger = require('../logger');
var base64Img = require('base64-img');
var rtiModel = require('../models/rtiModel');

function noop() {};

function sendPhantomUpgradeError(cb, err) {
  cb(new Error('Error with phantom'));
}

exports.createRti = function (engagementId, rtiCode, cb) {

  logger.info('Creating RTI for engagement %s and rtiCode %s', engagementId, rtiCode);

  var sent = false;

  var hm = new Horseman({
    phantomPath: pjs,
    webSecurity: false,
    interval: 1000,
    timeout: 30000,
    ignoreSSLErrors: true
  });

  try {

    // exmaple: http://ready-to-innovate.com/results.php?hash=RZQ98

    hm
      .viewport(2400,1350)
      .open('http://ready-to-innovate.com/results.php?hash='+rtiCode)
      .waitForSelector('#canvas')
      .wait(2000)
      .evaluate( function(){
        var canvas = document.getElementById("canvas");
        var img = canvas.toDataURL("image/png");
        return img;
      })
      .then(function(base64){
        logger.info('Found the following image::::  ');
        // console.log(base64);

        // base64Img.img(base64, 'dest', '1', function(err, filepath) {
        //   console.log('filepath:' + filepath);
        // });

        cb(null, {
          'image': base64
        });

        var data = {
          'engagementId': engagementId,
          'base64': base64
        }
        rtiModel.create(data, noop);

        return hm.close();
      })

    hm.on('error', function (err) {
      // TODO: save this somewhere - mongo
      logger.info.bind(console);
      logger.error('Error fired trying to determine blue upgrade eligibility', err);
      if (!sent) {
        sent = true;
        sendPhantomUpgradeError(cb, err);
        return hm.close();
      }
    });

  } catch (e) {
    logger.error('Error caught trying to determine blue upgrade eligibility', e);
    if (!sent) {
      sent = true;
      sendPhantomUpgradeError(cb, e);
      return hm.close();
    }
  }
}


exports.getRti = function (engagementId) {

}