'use strict';

let assert = require('assert');
let utils = require('../utility/testUtils');
let _ = require('lodash');

describe('Test engagement endpoints', function () {

  beforeEach(function (done) {
    // Start the node server
    utils.startServer(true, function () {
      done();
    });
  });

  it('should successfully create an engagement', function (done) {

    let data = {
      'name': 'test_engagement_1'
    };

    utils.cloudPost('/engagement', data, null, function (err, result) {

      console.log('result:::');
      console.log(JSON.stringify(result));

      assert.equal(result.name, 'test_engagement_1');

      done();
    });
  });

  it('should successfully return 2 engagements', function (done) {

    utils.cloudPost('/engagement', {
      'name': 'test_engagement_1'
    }, null, function () {
      utils.cloudPost('/engagement', {
        'name': 'test_engagement_2'
      }, null, function () {
        utils.cloudGet('/engagement', {}, null, function (err, result) {

          console.log('result:::');
          console.log(JSON.stringify(result));

          assert.equal(_.size(result), 2);
          done();
        });
      });
    });
  });

});
