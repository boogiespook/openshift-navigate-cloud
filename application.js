'use strict';

let express = require('express');
let cors = require('cors');
let dbConnection = require('./lib/models/dbConnection');
let app = express();
let logger = require('./lib/logger');


// Enable CORS for all requests
app.use(cors());

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));


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


// TOOD: need to remove process.env.FH_PORT
let port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
let host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, host, function() {
  dbConnection.connect(function (err) {
    if (err) {
      logger.error('Exiting app, failed to connect to Mongo DB');
      process.exit();
    }
    else {
      logger.info('App started at: ' + new Date() + ' on port: ' + port);
    }
  });
});
