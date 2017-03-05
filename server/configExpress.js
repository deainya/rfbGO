"use strict";

//let morgan      = require('morgan'); // will log requests to the console so we can see what is happening

module.exports = function(app, express, bodyParser) {
  app.use(bodyParser.json()); // get our request parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  //app.use(express.cookieParser()); // read cookies (needed for auth)
  //app.use(morgan('dev')); // use morgan to log requests to the console
  app.use(express.methodOverride());

  app.use( express.static(__dirname + "/../client") ); // default route

  app.use(app.router);
}
