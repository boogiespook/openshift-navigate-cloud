'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const authInit = require('../services/authInit');
const restErrorHandler = require('./restErrorHandler');
const constants = require('../constants');
const HTTPStatus = require('http-status');
const passport = require('passport');
const logger = require('../logger');

// TODO:
// https://stackoverflow.com/questions/44593120/saml2-0-authentication-with-node-js-and-spa

function validateLoginParams(req, res, next) {
  next();
}

function login(req, res) {
  res.status(HTTPStatus.NO_CONTENT).send({});
}

// Map to convert between user claims released from WS-Federation and SAML 2 / Shibboleth
var map = {
  email: {
    shibboleth: 'urn:oid:0.9.2342.19200300.100.1.3',
    ws_federation: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    custom: 'email'
  },
  first_name: {
    shibboleth: 'urn:oid:2.5.4.42',
    ws_federation: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    custom: 'firstname'
  },
  surname: {
    shibboleth: 'urn:oid:2.5.4.4',
    ws_federation: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    custom: 'lastname'
  },
  display_name: {
    shibboleth: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    ws_federation: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    custom: 'name'
  },
  groups: {
    shibboleth: 'http://schemas.xmlsoap.org/claims/Group',
    ws_federation: 'http://schemas.xmlsoap.org/claims/Group',
    custom: 'groups'
  }
};

// e.g. lookupFromProfile('email', project) => 'bob@example.com'
var lookupFromProfile = function(friendly, profile) {

  console.log('lookupFromProfile:: ');
  console.log('friendly:: ' + JSON.stringify(friendly, null, 2));
  console.log('\n\n');
  console.log('profile:: ' + JSON.stringify(profile, null, 2));
  console.log('\n\n');

  if (friendly === 'groups' && !profile) {
    return [];
  }

  if (!profile) {
    return;
  }

  var keys = map[friendly];

  console.log('keys::: ' + JSON.stringify(keys, null, 2));

  if (!keys) {
    console.log('no keys, returning');
    return;
  }

  if (keys.custom in profile) return profile[keys.custom];
  if (keys.shibboleth in profile) return profile[keys.shibboleth];
  if (keys.ws_federation in profile) return profile[keys.ws_federation];
};


// Process SAML assertion received and persist
function processToken(req, cb) {
  // sample req.user
  // {
  //   "issuer": "https://capriza.github.io/samling/samling.html",
  //   "sessionIndex": "_samling_1028824_6036300763",
  //   "nameID": "adsfasfdasf",
  //   "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
  //   "email": "briangal@gmail.com",
  //   "firstname": "Brian",
  //   "lastname": "Gallagher",
  //   "display_name": "Brian Gallagher",
  //   "groups": "navigate"
  // }

  console.log('req.user::: ' + req.user);

  // var firstName = lookupFromProfile('first_name', req.user);
  // // var firstName = lookupFromProfile('NameID', req.user);
  // var lastName = lookupFromProfile('surname', req.user);
  // var email = lookupFromProfile('email', req.user);

  // console.log('email:::: ' + email);

  // var groups = lookupFromProfile('groups', req.user)? lookupFromProfile('groups', req.user) : [];

  // Token Base64 encoded, decode before persisting
  var samlb64 = req.body.SAMLResponse;

  console.log('samlb64::: ' + samlb64);

  var b64Buffer = new Buffer(samlb64, 'base64');
  var samlXML = b64Buffer.toString();

  console.log('samlXML::: ' + samlXML);

  // Set assertion for session
  req.session.saml = samlXML;

  console.log('calling back');

  cb();
}


function successCallback (req, res) {

  console.log('successCallback::: If this function gets called, authentication was successful.');

  console.log('SAML Assertion claims, as parsed by passport-saml ');
  console.log('SAML Assertion claims, as parsed by passport-saml ');
  console.log('SAML Assertion claims, as parsed by passport-saml ');
  console.log(JSON.stringify(req.user, null, 2));
  console.log('\n\n\n\n');

  console.log('Base64 encoded SAML Response ');
  console.log(JSON.stringify(req.body.SAMLResponse, null, 2));
  console.log('\n');

  console.log('/login/callback   req.session ::: ' + JSON.stringify(req.session, null, 2));
  console.log('\n');
  // console.log(req.session.id);
  // console.log(req.session.cookie);
  console.log("/login/callback   req.sessionID:::: " + req.sessionID);
  // console.log("/login/callback   req.cookies['connect.sid']:::: " + req.cookies['connect.sid']);
  console.log('\n');


  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user's SAML Assertion claims, as parsed by passport-saml
  // `req.body.SAMLResponse` contains a Base64 encoded SAML Response

  // Persist our SAML assertion for this user via $fh.db
  processToken(req, function(err) {
    if (err) {
      console.log('error::::::');
      return res.status(400).json({
        msg: 'Error: ' + err
      })
    }

    // Redirect to Login OK (signals successful auth to Mobile Client)
    console.log('redirecting to /auth/login/ok');
    return res.redirect('/auth/login/ok');
    // res.status(HTTPStatus.NO_CONTENT).send({});
  });
}

function success(req, res) {
  console.log('returning success');
  // res.render('logged_in', {});
  // res.status(HTTPStatus.NO_CONTENT).send({});
  res.redirect('http://localhost:3000/engagements');
}

function authRoute() {
  var auth = new express.Router();
  auth.use(bodyParser());

  // auth.post('/login', validateLoginParams, login);

  auth.get('/login', passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true
  }));

  // auth.post('/login', passport.authenticate('saml', {
  //   failureRedirect: '/',
  //   failureFlash: true
  // }));

  auth.post('/login/callback',
    passport.authenticate('saml', {
      failureRedirect: '/',
      failureFlash: true
    }), successCallback);

  auth.get('/login/ok', authInit.ensureAuthenticated, success);

  return auth;
}

module.exports = authRoute;
