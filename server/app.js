"use strict";

// Dependencies               ==================================================
let express     = require('express');
let app         = express();

let bodyParser  = require('body-parser'); // to get params from POST requests
let Config      = require('./config'); // get our config file
let Mail        = require('./mail'); // to send email
let Mongo       = require('./mongo'); // get our mongo utils

var server      = require('http').createServer(app);
var io          = require('socket.io')(server);

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

// Apply the API routes       ==================================================
app.use('/api', apiRoutes);

// Socket.io                  ==================================================
io.on('connection', function(socket){
  socket.on('room join', function(data) {
    socket.join(data.room);
    io.in(data.room).emit('has joined', data);
  });

  socket.on('message', function(msg){
    io.emit('message', msg);
  });

});

/*io.on('connection', function(socket) {
  //Globals
  var defaultRoom = 'general';
  var rooms = ["General", "angular", "socket.io"];
  //Emit the rooms array socket.emit('setup', { rooms: rooms });

  //Listens for new user
  socket.on('new user', function(data) {
    data.room = defaultRoom;
    //New user joins the default room
    socket.join(defaultRoom);
    //Tell all those in the room that a new user joined
    io.in(defaultRoom).emit('user joined', data);
  });

  //Listens for switch room
  socket.on('switch room', function(data) {
    //Handles joining and leaving rooms
    //console.log(data);
    socket.leave(data.oldRoom);
    socket.join(data.newRoom);
    io.in(data.oldRoom).emit('user left', data);
    io.in(data.newRoom).emit('user joined', data);

  });

  //Listens for a new chat message
  socket.on('new message', function(data) {
    //Create message
    var newMsg = new Chat({
      username: data.username,
      content: data.message,
      room: data.room.toLowerCase(),
      created: new Date()
    });
    //Save it to database
    newMsg.save(function(err, msg){
      //Send message to those connected in the room
      io.in(msg.room).emit('message created', msg);
    });
  });
});*/

// Start the server           ==================================================
server.listen( Config.port, () => console.log( "Started on port: " + Config.port ));
//app.listen( Config.port, () => console.log( "Started on port: " + Config.port ) );


/*
How to share sessions with Socket.IO 1.x and Express 4.x?


The solution is surprisingly simple. It's just not very well documented. It is possible to use the express session middleware as a Socket.IO middleware too with a small adapter like this:

sio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

!!!!!Here's a full example with express 4.x, Socket.IO 1.x and Redis:

var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var RedisStore = require("connect-redis")(session);

var app = express();
var server = Server(app);
var sio = require("socket.io")(server);

var sessionMiddleware = session({
    store: new RedisStore({}), // XXX redis server config
    secret: "keyboard cat",
});

sio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

app.get("/", function(req, res){
    req.session // Session object in a normal request
});

sio.sockets.on("connection", function(socket) {
  socket.request.session // Now it's available from Socket.IO sockets too! Win!
});


server.listen(8080);
*/
