'use strict';

let assert = require('assert');
let utils = require('../utility/testUtils');
let _ = require('lodash');

describe('Test architectural questions endpoints', function () {

  beforeEach(function (done) {
    // Start the node server
    utils.startServer(true, function () {
      done();
    });
  });

  it('should successfully return architectural questions', function (done) {

    utils.cloudPost('/engagement', {'name': 'test_engagement_1'}, null, function (err, engagement) {

      assert.equal(engagement.name, 'test_engagement_1');

      var params = {
        'engagementId': engagement._id
      }

      utils.cloudGet('/archquestions', params, null, function (err, archquestions) {

        console.log('archquestions:::');
        console.log(JSON.stringify(archquestions));

        // TODO: Add assertions

        done();
      });
    });
  });


  // TODO: Test the update route


});
