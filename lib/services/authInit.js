var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var logger = require('../logger');
var HTTPStatus = require('http-status');

exports.init = function () {

  var samlConfig = {
    // issuer: 'https://localhost:8001/auth/login/callback',
    issuer: 'http://localhost:3000/',
    callbackUrl: 'https://localhost:8001/auth/login/callback',
    entryPoint: 'https://capriza.github.io/samling/samling.html',
    // entryPoint: 'https://auth.redhat.com/auth/realms/EmployeeIDP/protocol/openid-connect',
    // entryPoint: 'https://auth.dev.redhat.com/auth/realms/EmployeeIDP/protocol/saml',    // I think this is the correct one
    authnContext: 'urn:oasis:names:tc:SAML:2.0:protocol',
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    disableRequestedAuthnContext: true
    // cert: 'MIIE+TCCA+GgAwIBAgIED/4AJDANBgkqhkiG9w0BAQsFADBBMRAwDgYDVQQKDAdSZWQgSGF0MQ0wCwYDVQQLDARwcm9kMR4wHAYDVQQDDBVDZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMTcwNjIwMTI1MDE0WhcNMjIwNjE5MTI1MDE0WjCBqDELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRAwDgYDVQQHDAdSYWxlaWdoMRYwFAYDVQQKDA1SZWQgSGF0LCBJbmMuMQwwCgYDVQQLDANJQU0xITAfBgNVBAMMGFJlZCBIYXQgRGV2IEVtcGxveWVlIFNTTzElMCMGCSqGSIb3DQEJARYWc2VydmljZWRlc2tAcmVkaGF0LmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAL3FbVhuUHM/YEzKwz3yUljQIl7MgsgZjSM47Xx4QQ1/petCh8hWhgRgY0TZMw8rFeqa+na0EfM0Q/Hj6PKu9yg215WaIV5EfyfoF3q/B+RMlhpeygAE5ir7omGL/PX/wun9zWFIH8ip+sM1LZbGTdQmKRpm53y2WFHBs8L1lpHXakFK6Ea7H99OWdez4qHoHfyTIXHaawtXGjgriR3uOm2JbuP/ZvzEj7wVAqo6gFCA2aQfB0/ca8MZcChvxK+pfu070N9o6dMD8YrS6RFIPZ6ALecNjVyF+ODwkpDnbRsRqY+34cn4r4vx0BH06t2ODdgUVgEMV2EWh5YJdPAiLC2+a4CV5ofDu+dOldEx8i3CWd6U59Lv+CsXnTk7BGzP9O1vJDQl1UK0yJ+GZMs+NoHkX25QM470nD/etg8xKrtvFlWV1lMiSHkAP891DNJfjKUBbRQx7G9Ip0HXgXwOiDf3kafiWWqDCi37MFBF4xI+p8rSp8DhGqnaquerjzytY+0KKyIzMp/Vc7R9Vm21jPyTTzXOQgwIxcaOeLb686ipMSzW0dZT/IORmyAXhkkXN+iF0BKdoVeNotz7vu2zyfxNJvb6+XXj43kaLbYQ1Ee6LJoTpc6h6y6tbs1GGJ3it+4+5SzMezeu65FljAWt79Iee6VQ/bnwHfgcR4kM2S9lAgMBAAGjgZAwgY0wHwYDVR0jBBgwFoAUe9oJ9Uld2ddcyTb4VdIbl54RL34wOwYIKwYBBQUHAQEELzAtMCsGCCsGAQUFBzABhh9odHRwOi8vb2NzcC5yZWRoYXQuY29tL2NhL29jc3AvMA4GA1UdDwEB/wQEAwIE8DAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDQYJKoZIhvcNAQELBQADggEBAB+1ewuY5p1mPnRQWL+gZ5GQ2nXhelnCyq9a4K0An5ip/FryQG+pL6WwEXLsA6WY474UzHPaDfHK1TMDN6WEge613AhE9lM32UtSYOSTBUAwZJ5uK5i/8aUpl9xZ3N50GqQR+aLM+r5/5lMZ0+YUy+apX0srETUmwNiO1e1qvClefDdXPISjm9ipI52FHw6mJ8m2+utEaj/A9aNv5yrrz+Fg/7PyF2tlPwlVcyInDuQXVL6KWXarjI0NEc+5QZ2I82u2kUFvuo93VgxfuAIuTGE0Z9YKm8r97+t6ugrciHuO6JtlyO2q9d7OicjdwsFQOvwNRDLI7xTsHt5hBBIU64Y='
  };


  // When Passport authenticates a request, it parses the credentials contained in the request.
  // It then invokes the verify callback with those credentials as arguments, in this case username and password.
  // If the credentials are valid, the verify callback invokes done to supply Passport with the user that authenticated.
  passport.use(new SamlStrategy(samlConfig, function verifyCallback(user, done) {
    console.log('verifyCallback::: user:::: ');
    console.log(JSON.stringify(user));

    // {
    //     "issuer": "https://capriza.github.io/samling/samling.html",
    //     "nameID": "asdf",
    //     "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
    //     "sessionIndex": "_samling_318509_5508434888"
    // }

    // TODO: may need to add to the user object here
    // user may need to be stored in mongo to contain extra session type information

    // If they don't exist here this may be the point to create them.
    return done(null, user);
  }));

  console.log('Passport.js Configured.')


  // Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
  // In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  passport.serializeUser(function(user, done) {
    console.log('serializeUser::: user:::: ');
    console.log(JSON.stringify(user));
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log('deserializeUser::: user:::: ');
    console.log(JSON.stringify(user));
    done(null, user);
  });

}

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.  If
// the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
exports.ensureAuthenticated = function(req, res, next) {
  debugger;
  if (req.isAuthenticated()) {
    return next();
  }
  logger.info('User is not authenticated');
  res.status(HTTPStatus.UNAUTHORIZED).send({});
}
