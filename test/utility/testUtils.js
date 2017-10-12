'use strict';

var exec = require('child_process').exec;
var request = require('request');
var path = require('path');
var fs = require('fs');

var BASE_URL = 'http://127.0.0.1';
// var BASE_URL = 'https://psdev-hbosx7bqi36etjedccdailky-evals-dev.mbaas1.tom.redhatmobile.com';

function getUrl(path) {
  if (BASE_URL.indexOf('127.0.0.1') > -1) {
    return [BASE_URL, ':', 8001, path].join('');
  } else {
    return [BASE_URL, path].join('');
  }
}

/**
 * Get an integer between min and max.
 * @param   {Number} min
 * @param   {Number} max
 * @returns {Number}
 */
function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

var port = randomInt(2000, 10000);

/**
 * Get the port our test server is running on.
 * @return {Number}
 */
exports.getServerPort = function () {
  return port;
};

exports.loadTestsOfType = function (type) {
  var p = path.join(__dirname, '../', type);
  var files = fs.readdirSync(p);

  files.forEach(function (file) {
    if (path.extname(file) === '.js') {
      require(path.join(__dirname, '../', type, file));
    }
  });
};

exports.clearDatabase = function (callback) {
  // let cmd = 'mongo localhost:27017/navigate ./test/utility/dropAll.js';
  // exec(cmd, function(err, stdout, stderr) {
  //   if (err) {
  //     console.error(err);
  //     process.exit();
  //   }
  //   else {
  //     console.log(stdout);
  //     callback();
  //   }
  // });
  callback();
};

/**
 * Start a server by requiring application.js
 * @param {Function} callback
 */
exports.startServer = function (clearDB, callback) {
  console.log('Starting test server on port, please wait %s', port);

  process.env.ENV_LOCAL = true;

  function start(callback) {

    // Give the app a chance to start
    setTimeout(function () {
      return callback();
    }, 5000);

    require('../../application.js');
  }

  if (clearDB) {
    exports.clearDatabase(function () {
      start(callback);
    })
  } else {
    start(callback);
  }
};

exports.cloudPost = function (path, data, headers, cb) {
  var url = getUrl(path);

  console.log('Posting to %s', url);
  data = data || null;

  request.post({
    url: url,
    form: data,
    headers: headers
  }, function (err, response, data) {
    if (err) {
      console.error('cloudCall error: %s', err);
      return cb(err, null);
    }
    var d;
    try {
      d = JSON.parse(data);
      cb(null, d, response);
    } catch (e) {
      // console.log('Problem parsing data cloudPost, %s', e);
      // console.log(data);
      // console.log(response.statusCode);
      cb(null, data, response);
    }
  })
};

exports.cloudPut = function (path, data, headers, cb) {
  var url = getUrl(path);

  console.log('Posting to %s', url);
  data = data || null;

  request.put({
    url: url,
    form: data,
    headers: headers
  }, function (err, response, data) {
    if (err) {
      console.error('cloudCall error: %s', err);
      return cb(err, null);
    }
    var d;
    try {
      d = JSON.parse(data);
      cb(null, d, response);
    } catch (e) {
      // console.log('Problem parsing data cloudPost, %s', e);
      // console.log(data);
      // console.log(response.statusCode);
      cb(null, data, response);
    }
  })
};

exports.cloudGet = function (path, data, headers, cb) {
  var url = getUrl(path);

  console.log('Http GET: %s', url);
  data = data || null;

  request.get({
    url: url,
    qs: data,
    headers: headers,
  }, function (err, response, data) {
    if (err) {
      console.error('cloudGet error: %s', err);
      return cb(err, null);
    }
    var d;
    try {
      d = JSON.parse(data);
      cb(null, d, response);
    } catch (e) {
      console.log('Problem parsing data cloudGet, %s', e);
      console.log(data);
      console.log(response.statusCode);
      cb(null, data, response);
    }
  })
};

exports.cloudDelete = function (path, data, cb) {
  var url = getUrl(path);

  console.log('Http DELETE: %s', url);
  data = data || null;

  request.delete({
    url: url
  }, function (err, response, data) {
    if (err) {
      console.error('cloudDelete error: %s', err);
      return cb(err, null);
    }
    var d;
    try {
      d = JSON.parse(data);
      cb(null, d, response);
    } catch (e) {
      console.log('Problem parsing data cloudDelete, %s', e);
      console.log(data);
      console.log(response.statusCode);
      cb(null, data, response);
    }
  })
};
