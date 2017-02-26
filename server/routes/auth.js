"use strict";

let jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
let mongoose    = require('mongoose');
let request    = require('request');

let Config      = require('./../config'); // get our config file
let User        = require('./user'); // get our mongoose model

mongoose.connect(Config.database); // connect to MongoDB through Mongoose
mongoose.Promise = global.Promise; //WTF???

module.exports = function(app, apiRoutes) {
  apiRoutes.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) throw err;
      if (!user) {
        //res.json({ success: false, message: 'Authentication failed. Wrong creditenials' });
        return res.status(401).send({ success: false, message: 'Authentication failed. Wrong credentials' }); // User not found
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          //res.json({ success: false, message: 'Authentication failed. Wrong creditenials' });
          return res.status(401).send({ success: false, message: 'Authentication failed. Wrong credentials' }); // Wrong password
        }
        // if user is found and password is right then create a token
        console.log(user);
        var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
        //res.send({ token: token });
        res.json({ success: true, message: 'Token created',
                   user: {email: user.email, name: user.name, phone: user.phone,
                          city: user.city, tradepoint: user.tradepoint,
                          role: user.role}, //atWork: user.atWork,
                   token: token });
      });
    });
  });

  apiRoutes.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ success: false, message: 'Email is already taken' });
      }
      if (!req.body.email || !req.body.password) {
        return res.status(400).send({ success: false, message: 'Bad credentials' });
      }
      var user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
        city: req.body.city,
        tradepoint: {},
        role: req.body.role//,
        //atWork: false
      });
      user.save(function(err, result) {
        if (err) { res.status(500).send({ success: false, message: err.message }); }
        else {
          var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
          res.json({ success: true, message: 'User & token created',
                     user: {email: user.email, name: user.name, phone: user.phone,
                            city: user.city, tradepoint: user.tradepoint,
                            role: user.role}, //atWork: user.atWork,
                     token: token });
        }
      });
    });
  });

  // route middleware to verify a token
  apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      // verifies secret and checks expiration
      jwt.verify(token, Config.secret, function(err, decoded){
        if (err) {
          return res.status(401).send({ success: false, message: 'Failed to authenticate token' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token return an error
      return res.status(401).send({ success: false, message: 'No token provided' });
    }
  });

  /*Git
  Client ID
  8495acac0163be5fd2f7
  Client Secret
  e55a88b407cffc88f1487cd877c2c681d235d9a1*/

  //Google
  //Client secret
  //y_xltbcKTcjeSdE3DrX7bb2r
  //Client ID
  //94725787074-o8kjs9381bq1suldeskpssm7jcb4gklb.apps.googleusercontent.com

  /*{"web":{"client_id":"94725787074-o8kjs9381bq1suldeskpssm7jcb4gklb.apps.googleusercontent.com",
          "project_id":"phonic-axle-117820",
          "auth_uri":"https://accounts.google.com/o/oauth2/auth",
          "token_uri":"https://accounts.google.com/o/oauth2/token",
          "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
          "client_secret":"y_xltbcKTcjeSdE3DrX7bb2r",
          "redirect_uris":["http://rfbgo.ru/profile"]
        }
  }*/

   // route to Google Auth hopefully
  app.post('/auth/google', (req, res) => {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {

      'client_id'      : '94725787074-o8kjs9381bq1suldeskpssm7jcb4gklb.apps.googleusercontent.com',
      'client_secret'  : 'y_xltbcKTcjeSdE3DrX7bb2r',
      'redirect_uri'   : 'http://localhost:3005/register'
      //code: req.body.code,
      //client_id: req.body.clientId || 'y_xltbcKTcjeSdE3DrX7bb2r',
      //client_secret: '94725787074-o8kjs9381bq1suldeskpssm7jcb4gklb.apps.googleusercontent.com', //config.GOOGLE_SECRET,
      //redirect_uri: 'http://rfbgo.ru/profile', //req.body.redirectUri,
      //grant_type: 'authorization_code'
    };
    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
        if (profile.error) {
          return res.status(500).send({message: profile.error.message});
        }
        // Step 3a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ google: profile.sub }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
            }
            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, Config.secret);
            console.log(payload);

            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.google = profile.sub;
              user.avatar = user.avatar || profile.picture.replace('sz=50', 'sz=200');
              user.name = user.name || profile.name;
              user.save(function() {
                var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ google: profile.sub }, function(err, existingUser) {
            /*if (existingUser) {
              return res.send({ token: createJWT(existingUser) });
            }*/
            console.log(profile);
            /*var user = new User();
            user.google = profile.sub;
            user.avatar = profile.picture.replace('sz=50', 'sz=200');
            user.name = profile.name;
            user.save(function(err) {
              var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
              //res.send({ token: token });
              res.json({ success: true, message: 'Token created',
                         user: {email: user.email, name: user.name, phone: user.phone,
                                city: user.city, tradepoint: user.tradepoint,
                                role: user.role},
                         token: token });
            });*/
          });
        }
      });
    });
  });

}
