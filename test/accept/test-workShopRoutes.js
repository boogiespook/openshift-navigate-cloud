'use strict';

let assert = require('assert');
let utils = require('../utility/testUtils');
let _ = require('lodash');

describe('Test workshop endpoints', function () {

  beforeEach(function (done) {
    // Start the node server
    utils.startServer(true, function () {
      done();
    });
  });

  it('should successfully return a workshop', function (done) {

    utils.cloudPost('/engagement', {'name': 'test_engagement_1'}, null, function (err, engagement) {

      // console.log('engagement:::');
      // console.log(JSON.stringify(engagement));

      assert.equal(engagement.name, 'test_engagement_1');

      var params = {
        'engagementId': engagement._id
      }

      utils.cloudGet('/workshops', params, null, function (err, workshops) {

        console.log('workshops:::');
        console.log(JSON.stringify(workshops));

        assert.equal(workshops.length > 0, true, 'There should be at least 1 workshop');
        assert.equal(workshops[0].status, 'NOT_STARTED', 'Status is incorrect');

        done();
      });
    });
  });


  // TODO: Test the update route


});
