"use strict";

// Dependencies               ==================================================
let express     = require('express');
//let app         = express();

let bodyParser  = require('body-parser'); // to get params from POST requests
let Config      = require('./config'); // get our config file
let Mail        = require('./mail'); // to send email
let Mongo       = require('./mongo'); // get our mongo utils

let socket      = require('./routes/socket.js');
var app         = express.createServer();
var io          = require('socket.io').listen(app); // Hook socket.io into Express

// Initialization            ==================================================
Mongo.connect(Config.database); // connecting to MongoDB
let jsonParser  = bodyParser.json();
require('./configExpress')(app, express, bodyParser); // Load Express Configuration

// API routes                 ==================================================
let apiRoutes = express.Router(); // get an instance of the router for api routes
require('./routes/auth')(app, apiRoutes); // auth routes
// route to show welcome message
apiRoutes.get('/', (req, res) => {  res.json({ message: 'rfbGO API' }); });
require('./routes/users')(apiRoutes, jsonParser, Mongo, Mail); // users routes
require('./routes/orders')(apiRoutes, jsonParser, Mongo, Mail); // orders routes

io.sockets.on('connection', socket);

// Apply the API routes       ==================================================
app.use('/api', apiRoutes);

// Start the server           ==================================================
app.listen( Config.port, () => console.log( "Started on port: " + Config.port ) );
