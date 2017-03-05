"use strict";

// Dependencies               ==================================================

let bodyParser  = require('body-parser'); // to get params from POST requests
let Config      = require('./config'); // get our config file
let Mail        = require('./mail'); // to send email
let Mongo       = require('./mongo'); // get our mongo utils

let express     = require('express');
let socket      = require('./routes/socket.js');
let app         = express();
//let app         = express.createServer();
let server      = require('http').Server(app);
let io          = require('socket.io')(server); // Hook socket.io into Express
//var server = require('http').Server(app);
//var io = require('socket.io')(server);

// Initialization            ==================================================
Mongo.connect(Config.database); // connecting to MongoDB
let jsonParser  = bodyParser.json();
app.configure(require('./configExpress')(app, express, bodyParser)); // Load Express Configuration

// API routes                 ==================================================
let apiRoutes = express.Router(); // get an instance of the router for api routes
require('./routes/auth')(app, apiRoutes); // auth routes
// route to show welcome message
apiRoutes.get('/', (req, res) => {  res.json({ message: 'rfbGO API' }); });
require('./routes/users')(apiRoutes, jsonParser, Mongo, Mail); // users routes
require('./routes/orders')(apiRoutes, jsonParser, Mongo, Mail); // orders routes

//Hz
io.sockets.on('connection', socket);

// Apply the API routes       ==================================================
app.use('/api', apiRoutes);

// Start the server           ==================================================
//app.listen( Config.port, () => console.log( "Started on port: " + Config.port ) );
server.listen(Config.port, () => console.log( "Started on port: " + Config.port ));
