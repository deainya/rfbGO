"use strict";

// Dependencies               ==================================================
let express     = require('express');
let app         = express();
let bodyParser  = require('body-parser'); // will let us get parameters from our POST requests
let mongoose    = require('mongoose');
let morgan      = require('morgan'); // will log requests to the console so we can see what is happening
let jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens

let Config      = require('./config'); // get our config file
let Mongo       = require('./mongo'); // get our mongo utils
let User        = require('./user'); // get our mongoose model

// Initialization            ==================================================
Mongo.connect(Config.database); // connecting to MongoDB
mongoose.connect(Config.database); // connect to MongoDB through Mongoose
let jsonParser = bodyParser.json(); // ?
app.use(bodyParser.json()); // get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(morgan('dev')); // use morgan to log requests to the console
app.use( express.static(__dirname + "/../client") ); // default route

// Routing                    ==================================================
/*app.get("/consultants", (req, res) => {
  let consultants = Mongo.users();//consultants();

  consultants.find({"role":"0"}, {"_id":false}).limit(1).next((err,doc) => { // query
    if (err) { res.sendStatus(400); }
    console.log( JSON.stringify(doc) );
    res.json( doc ); // 1st consultant from collection
  });
});

app.get("/partners", (req, res) => {
  let partners = Mongo.users();//partners();

  partners.find({"role":"1"}, {"_id":false}).limit(1).next((err,doc) => { // query + projection
    if(err) { res.sendStatus(400); }
    console.log( JSON.stringify(doc) );
    res.json( doc ); // 1st partner from collection
  });
});*/

app.post("/profile/tradepoint", (req, res) => {
  let dataset = req.body.dataset;
  let email = req.body.dataset.email;
  let tp = req.body.dataset.tradepoint;
  let users = Mongo.users();

  console.log(dataset);
  console.log(email);
  console.log(tp);

  users.findOneAndUpdate({"email": email}, {$set: {"tradepoint": tp}}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Tradepoint saved: " + JSON.stringify(email) + " " + JSON.stringify(tp) );
    res.sendStatus(201);

    //let pointsNames = docs.map((tradepoints) => tradepoints.name.concat(". ", tradepoints.address));
    //res.json( pointsNames ); // the list of tradepoints names + addresses
  });
});

app.get("/tradepoints", (req, res) => {
  let city = req.query.city || {};
  let tradepoints = Mongo.tradepoints();

  tradepoints.find({"city":city}, {"_id":false}).toArray((err,docs) => {
    if(err) { res.sendStatus(400); }
    console.log( JSON.stringify(docs) );
    res.json( docs );

    //let pointsNames = docs.map((tradepoints) => tradepoints.name.concat(". ", tradepoints.address));
    //res.json( pointsNames ); // the list of tradepoints names + addresses
  });
});

// Orders routing             ==================================================
app.get("/orders", (req, res) => {
  let _from = req.query.from || {};
  let _to = req.query.to || {};
  let _status = req.query.status || {};
  let orders = Mongo.orders();

  //console.log(req.query);
  //console.log(req.params);
  console.log({ created: { $gte: _from, $lt: _to }, status: _status });

  if (!req.query) {
    orders.find().toArray((err,docs) => {
      if (err) { res.sendStatus(400); }
      console.log( JSON.stringify(docs) );
      res.json( docs ); // orders
    });
  } else {
    orders.find({ created: { $gte: _from, $lt: _to } }, {}).toArray((err,docs) => {
      if (err) { res.sendStatus(400); }
      console.log( JSON.stringify(docs) );
      res.json( docs ); // orders
    });
  }
});

app.post("/orders/create", jsonParser, (req, res) => {
  let neworder = req.body.dataset || {};
  let orders = Mongo.orders();

  orders.insert(neworder, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order created: " + JSON.stringify( neworder ) );
    res.sendStatus(201);
  });
});

app.post("/orders/cancel", jsonParser, (req, res) => {
  let orderid = req.body.dataset || {};
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: {status: "Отменён"}, $currentDate: {"cancelled": {$type: "date"}}}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order cancelled: " + JSON.stringify(orderid) );
    res.sendStatus(201);
  });
});

app.post("/orders/accept", jsonParser, (req, res) => {
  let setorder = req.body.dataset || {};
  let orderid = setorder._id;
  delete setorder._id;
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: setorder}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order accepted: " + JSON.stringify(orderid) + " - " + JSON.stringify(setorder) );
    res.sendStatus(201);
  });
});

app.post("/orders/resolve", jsonParser, (req, res) => {
  let setorder = req.body.dataset || {};
  let orderid = setorder._id;
  delete setorder._id;
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: setorder}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order resolved: " + JSON.stringify(orderid) + " - " + JSON.stringify(setorder) );
    res.sendStatus(201);
  });
});

// API routes                 ==================================================
let apiRoutes = express.Router(); // get an instance of the router for api routes

apiRoutes.post('/register', function(req, res) {
  console.log(req.body);
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ success: false, message: 'E-mail is already taken' });
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
      tradepoint: req.body.tradepoint,
      address: req.body.address,
      role: req.body.role,
      atWork: false
    });
    user.save(function(err, result) {
      if (err) { res.status(500).send({ success: false, message: err.message }); }
      var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
      res.json({ success: true, message: 'User & token created',
                 'user': {email: user.email, name: user.name, phone: user.phone, city: user.city, atWork: user.atWork, role: user.role},
                 //tradepoint: user.tradepoint,  address: user.address,
                 token: token });
      //res.send({ token: token });
    });
  });
});

apiRoutes.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) throw err;
    if (!user) {
      //res.json({ success: false, message: 'Authentication failed. Wrong creditenials.' });
      return res.status(401).send({ success: false, message: 'Authentication failed. Wrong credentials 1' }); // User not found
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        //res.json({ success: false, message: 'Authentication failed. Wrong creditenials.' });
        return res.status(401).send({ success: false, message: 'Authentication failed. Wrong credentials 2' }); // Wrong password
      }
      // if user is found and password is right then create a token
      var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
      res.json({ success: true, message: 'Token created',
                 user: {email: user.email, name: user.name, phone: user.phone, city: user.city, role: user.role, atWork: user.atWork},
                 tradepoint: user.tradepoint, // address: user.address,
                 token: token });
      //res.send({ token: token });
    });
  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token']; // check header or url parameters or post parameters for token
  if (token) {
    jwt.verify(token, Config.secret, function(err, decoded) { // verifies secret and checks exp
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token' });
      } else {
        req.decoded = decoded; // if everything is good, save to request for use in other routes
        next();
      }
    });
  } else {
    return res.status(401).send({ success: false, message: 'No token provided' }); // if there is no token return an error
  }
});

// route to show welcome message
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Authentication API' });
});
// route to return all users
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) { res.json(users); });
});
// apply the api routes
app.use('/auth', apiRoutes);

// Start the server           ==================================================
app.listen(Config.port, () => console.log( "App is listening on port " + Config.port ) );
