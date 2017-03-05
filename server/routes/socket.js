// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};
  var claim = function (name) {
    if (!name || names[name]) { return false; }
    else { names[name] = true; return true; }
  };
  // find the lowest unused "guest" name and claim it                 ==========
  var getGuestName = function () {
    var name, nextUserId = 1;
    do { name = 'Guest ' + nextUserId; nextUserId += 1; } while (!claim(name));
    return name;
  };
  // serialize claimed names as an array
  var get = function () { var res = []; for (user in names) { res.push(user); } return res; };
  var free = function (name) { if (names[name]) { delete names[name]; } };
  return { claim: claim, free: free, get: get, getGuestName: getGuestName };
}());

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', { name: name, users: userNames.get() });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', { name: name });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', { user: name, text: data.message });
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', { name: name });
    userNames.free(name);
  });

  // validate a user's name change, and broadcast it on success
  /*socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);
      name = data.name;
      socket.broadcast.emit('change:name', { oldName: oldName, newName: name });
      fn(true);
    } else { fn(false); }
  });*/
};



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
    store: new RedisStore({}), // redis server config
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
