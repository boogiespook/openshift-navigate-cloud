# openshift-navigate-cloud

## Prerequisites
Install MongoDB<br>
Install Node.js version 6.9.1<br>
Install Global Node Modules<br>
  * [grunt cli] (https://github.com/gruntjs/grunt-cli)
  * [mocha] (https://mochajs.org/)

## Running
cd openshift-navigate-cloud<br>
npm install<br>
grunt serve<br>

## Env Vars required in non local environments
NODE_ENV
SAML_ISSUER
SAML_CALLBACK_URL
SAML_ENTRY_POINT
SAML_REDIRECT
AUTHN_SIGN_KEY
RH_SIGN_KEY
LOG_LEVEL
MONGODB_USER
MONGODB_PASSWORD
MONGODB_HOST

TODO:
Google Sheets