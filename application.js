'use strict';
//test
const express = require('express');
const cors = require('cors');
const dbConnection = require('./lib/models/dbConnection');
const app = express();
const logger = require('./lib/logger');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const authInit = require('./lib/services/authInit');
var ejs = require('ejs');

app.use(cors({
  'origin' : true,
  'credentials' :true
}));

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// app.all('*', function(req, res, next) {


//tests
// TODO: not sure if this is needed
app.use(require('method-override')());
// TODO:
// See https://github.com/expressjs/session
// store
// The session store instance, defaults to a new MemoryStore instance.
app.use(require('express-session')({
  secret: 'wYAEJhxEDTkDqmHFr7EDY2GLybLuCQ',
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
authInit.init();

app.set('views', __dirname + '/lib/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

app.use('/auth', require('./lib/routes/auth.js')());
app.use('/businessgoals', require('./lib/routes/businessGoals.js')());
app.use('/businessreview', require('./lib/routes/businessReview.js')());
app.use('/archquestions', require('./lib/routes/architectureQuestions.js')());
app.use('/engagement', require('./lib/routes/engagement.js')());
app.use('/rti', require('./lib/routes/rti.js')());
app.use('/workshops', require('./lib/routes/workshops.js')());
app.use('/userstory', require('./lib/routes/userStories.js')());
app.use('/engagementconfig', require('./lib/routes/engagementConfig.js')());
app.use('/nextsteps', require('./lib/routes/nextsteps.js')());
app.use('/admin', require('./lib/routes/admin.js')());
app.use('/admin', require('./lib/routes/admin.js')());
app.use('/mindmap', require('./lib/routes/mindMap.js')());
app.use('/sys/info/ping', require('./lib/routes/ping.js')());


// TODO:
// Add error handling middleware


function dbConnect () {
  dbConnection.connect(function (err) {
    if (err) {
      logger.error('Exiting app, failed to connect to Mongo DB');
      process.exit();
    }
    else {
      logger.info('App started at: ' + new Date() + ' on port: ' + port);
    }
  });
}

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// If NODE_ENV is not set we can assume that we are running locally
// In which case we need
if (!process.env.NODE_ENV) {
  const options = {
    key: fs.readFileSync('./localCredentials/key.pem'),
    cert: fs.readFileSync('./localCredentials/cert.pem')
  };

  https.createServer(options, app).listen(port);
  // TODO: possibly put this in the CB
  dbConnect();
}
else {
  // Create http server
  // TODO: May need to revisit this. This may need to be HTTPS with Pass through routing in OS
  app.listen(port, host, function() {
    dbConnect();
  });
}





