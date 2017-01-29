"use strict";

// Dependencies               ==================================================
let express     = require('express');
let app         = express();
let mongoose    = require('mongoose');
let jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens

let Config      = require('./config'); // get our config file
let Mail        = require('./mail');
let Mongo       = require('./mongo'); // get our mongo utils
let User        = require('./user'); // get our mongoose model

// Initialization            ==================================================
Mongo.connect(Config.database); // connecting to MongoDB
mongoose.connect(Config.database); // connect to MongoDB through Mongoose
mongoose.Promise = global.Promise; //WTF???

let e           = require('./configExpress'); // Load Express Configuration
e.Express(app, express);
let jsonParser  = e.jsonParser();

// API routes                 ==================================================
let apiRoutes = express.Router(); // get an instance of the router for api routes

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
                        atWork: user.atWork, role: user.role},
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
      role: req.body.role,
      atWork: false
    });
    user.save(function(err, result) {
      if (err) { res.status(500).send({ success: false, message: err.message }); }
      else {
        var token = jwt.sign(user, Config.secret, { expiresIn: 1440 }); // expires in 24 hours
        res.json({ success: true, message: 'User & token created',
                   user: {email: user.email, name: user.name, phone: user.phone,
                          city: user.city, tradepoint: user.tradepoint,
                          atWork: user.atWork, role: user.role},
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

// route to show welcome message
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'rfbGO API' });
});
// route to return all users
apiRoutes.get('/userslonglist', (req, res) => {
  User.find({}, (err, docs) => {
    if(err) { res.sendStatus(400); }
    res.json(docs);
  });
});

// Profile API routes         ==================================================
apiRoutes.get("/tradepoints", (req, res) => {
  let city = req.query.city || {};
  let role = req.query.role || {};
  let tradepoints = Mongo.tradepoints();
  if (role == 0) {
    tradepoints.aggregate([{$match : {"city":city}}, {$group : { _id : "$wp", wp:{$first:"$wp"}, tradepoint:{$first:"$tradepoint"}, address:{$first:"$address"}, city:{$first:"$city"}}}]).toArray((err, docs) => {
      if(err) { res.sendStatus(400); }
      res.json( docs );
    });
  } else{
    tradepoints.find({"city":city}, {"_id":false}).toArray((err, docs) => {
      if(err) { res.sendStatus(400); }
      res.json( docs );
    });
  }
});
apiRoutes.post("/user/atwork", (req, res) => {
  let dataset = req.body.dataset || {};
  let actions = Mongo.actions();
  actions.insert(dataset, function(err, result){
    if(err) { res.sendStatus(400); console.log(err + " " + result); }
    else {
      res.status(201).send({ success: true, message: 'Tradepoint added' });

      console.log( "Action added: " + JSON.stringify(dataset) );
    }
  });
});
apiRoutes.post("/user/tradepoint", (req, res) => {
  let dataset = req.body.dataset || {};
  let email = dataset.email;
  let point = dataset.tradepoint;
  let users = Mongo.users();

  users.findOneAndUpdate({"email": email}, {$set: {"tradepoint": point}}, {}, function(err, result){
    if(err) { res.sendStatus(400); console.log(err + " " + result); }
    else {
      res.status(201).send({ success: true, message: 'Tradepoint set' });

      if (!point.tp) {
        var message = 'Информация о месте работы сохранена: код ' + point.wp + '; ' + point.tradepoint + ' (' + point.address + ')';
      } else {
        var message = 'Информация о месте работы сохранена:' + point.name + '; ' + point.tradepoint + ' (' + point.address + ')';
      }
      Mail.sendMail(email, message);

      console.log( "Tradepoint set: " + JSON.stringify(email) + " " + JSON.stringify(point) );
    }
  });
});

apiRoutes.post('/user/letter', (req, res) => {
  let dataset = req.body.dataset || {};
  let email = dataset.email;
  let letter = dataset.letter;

  Mail.sendMail(email, letter);
});

// Orders routing             ==================================================
apiRoutes.get("/orders", jsonParser, (req, res) => {
  let _from = req.query.from || '';
  let _to = req.query.to || '';
  let _sts = req.query.status || '';
  let _tp = req.query.tp || '';
  let _wp = req.query.wp || '';
  let _city = req.query.city || '';
  let orders = Mongo.orders();

  //console.log({ created: { $gte: _from, $lt: _to }, "tp": _tp, "wp": _wp });
  if ( _sts == 'Любой' || _sts == '' ){
    if (!req.query) {
      orders.find().toArray((err, docs) => {
        if (err) { res.sendStatus(400); }
        res.json( docs ); // orders
      });
    } else {
      orders.find({ created: { $gte: _from, $lt: _to }, $or:[{"partner.tradepoint.tp": _tp}, {"partner.tradepoint.wp": _wp}, {"partner.tradepoint.city": _city}] }, {}).toArray((err, docs) => {
        if (err) { res.sendStatus(400); }
        res.json( docs ); // orders
      });
    }
  } else {
    if (!req.query) {
      orders.find().toArray((err, docs) => {
        if (err) { res.sendStatus(400); }
        res.json( docs ); // orders
      });
    } else {
      orders.find({ created: { $gte: _from, $lt: _to }, "status": _sts, $or:[{"partner.tradepoint.tp": _tp}, {"partner.tradepoint.wp": _wp}, {"partner.tradepoint.city": _city}] }, {}).toArray((err, docs) => {
        if (err) { res.sendStatus(400); }
        res.json( docs ); // orders
      });
    }
  }
});

apiRoutes.post("/orders/create", jsonParser, (req, res) => {
  let dataset = req.body.dataset || {};
  let orders = Mongo.orders();
  let users = Mongo.users();

  orders.insert(dataset, function(err, result){
    if(err) { res.sendStatus(400); }
    res.sendStatus(201);

    users.find({ "tradepoint.wp":dataset.partner.tradepoint.wp, "role":0 }, {"email":true}).toArray((err, docs) => {
      if (docs) {
        var emails = '';
        for (var i = 0; i < docs.length-1; i++){
          emails = emails + docs[i].email + ', ';
        }
        emails = emails + docs[docs.length-1].email;
        console.log(emails);

        var message = 'Поступил новый вызов! От ' + dataset.partner.name + ' (' + dataset.partner.tradepoint.name + ') в ' + dataset.partner.tradepoint.tradepoint + '. Проверьте список вызовов.';
        Mail.sendMail(emails, message);
      } else {
        console.log('Epic fail :)');
      }
    });

    console.log( "Order created: " + JSON.stringify( dataset ) );
  });
});

apiRoutes.post("/orders/accept", jsonParser, (req, res) => {
  let dataset = req.body.dataset || {};
  let orderid = dataset._id;
  delete dataset._id;
  let orders = Mongo.orders();

  orders.findOne({_id: new Mongo.ObjID(orderid)}, (err, docs) => {
    if(err) { console.log(err); }
    let email = docs.partner.email;

    orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: dataset}, function(err, result){
      if(err) { res.sendStatus(400); }
      res.sendStatus(201);

      var message = 'Вызов принят! Консультант: ' + dataset.consultant.name  + ', ' + dataset.consultant.phone + '. Время прибытия: ' + dataset.time2go + ' мин. Проверьте список вызовов.';
      Mail.sendMail(email, message);
    });

    console.log( "Order accepted: " + JSON.stringify(orderid) + " " + JSON.stringify(dataset) );
  });
});

apiRoutes.post("/orders/resolve", jsonParser, (req, res) => {
  let dataset = req.body.dataset || {};
  let orderid = dataset._id;
  delete dataset._id;
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: dataset}, function(err, result){
    if(err) { res.sendStatus(400); }
    res.sendStatus(201);

    if (result.value.consultant.email) {
      var email = result.value.consultant.email;
      var message = 'Вызов от ' + result.value.partner.name + ' (' + result.value.partner.tradepoint.name + ') в ' + result.value.partner.tradepoint.tradepoint + ' завершён. Проверьте список вызовов.';
      Mail.sendMail(email, message);
    }

    console.log( "Order resolved: " + JSON.stringify(orderid) + " " + JSON.stringify(dataset) );
  });
});

apiRoutes.post("/orders/cancel", jsonParser, (req, res) => {
  let dataset = req.body.dataset || {};
  let orderid = dataset._id;
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: {status: "Отменён"}, $currentDate: {"cancelled": {$type: "date"}}}, function(err, result){
    if(err) { res.sendStatus(400); }
    res.sendStatus(201);

    if (result.value.consultant.email) {
      var email = result.value.consultant.email;
      var message = 'Вызов от ' + result.value.partner.name + ' (' + result.value.partner.tradepoint.name + ') в ' + result.value.partner.tradepoint.tradepoint + ' отменён. Проверьте список вызовов.';
      Mail.sendMail(email, message);
    }

    console.log( "Order cancelled: " + JSON.stringify(orderid) );
  });
});

// Apply the API routes       ==================================================
app.use('/api', apiRoutes);

// Start the server           ==================================================
app.listen(Config.port, () => console.log( "Started on port: " + Config.port ) );
