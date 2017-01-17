"use strict";

// Dependencies               ==================================================
let express     = require('express');
let app         = express();
let bodyParser  = require('body-parser'); // will let us get parameters from our POST requests
let mongoose    = require('mongoose');
let morgan      = require('morgan'); // will log requests to the console so we can see what is happening
let jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
let nodemailer  = require('nodemailer'); // send emails

let Config      = require('./config'); // get our config file
let Mongo       = require('./mongo'); // get our mongo utils
let User        = require('./user'); // get our mongoose model

// Email test                 ==================================================
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport('smtps://deainru%40gmail.com:mail4deainru@smtp.gmail.com');
// Initialization            ==================================================
Mongo.connect(Config.database); // connecting to MongoDB
mongoose.connect(Config.database); // connect to MongoDB through Mongoose
mongoose.Promise = global.Promise; //WTF???

let jsonParser = bodyParser.json(); // ?
app.use(bodyParser.json()); // get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(morgan('dev')); // use morgan to log requests to the console
app.use( express.static(__dirname + "/../client") ); // default route

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

      console.log( docs );

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
      console.log( "Action added: " + JSON.stringify(dataset) );
      res.status(201).send({ success: true, message: 'Tradepoint added' });
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
      console.log( "Tradepoint set: " + JSON.stringify(email) + " " + JSON.stringify(point) );
      res.status(201).send({ success: true, message: 'Tradepoint set' });

      // Email notification test 1
      var mailOptions = {
          from: '"rfbGO" <rfbGO@deain.ru>', // sender address
          to: email, // list of receivers
          subject: 'rfbGO notification ✔', // subject line
          text: 'Информация о торговой точке успешно сохранена', // plaintext body
          html: 'Информация о торговой точке успешно сохранена: <b>' + point.tradepoint + '</b>' // html body
      };
      transporter.sendMail(mailOptions, function(err, info){
        if(err){ return console.log(err); }
        console.log("Message sent: " + info.response);
      });
    }
  });
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

  console.log({ created: { $gte: _from, $lt: _to }, "tp": _tp, "wp": _wp });
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
    console.log( "Order created: " + JSON.stringify( dataset ) );
    res.sendStatus(201);

    users.find({ "tradepoint.wp":dataset.partner.tradepoint.wp, "role":0 }, {"email":true}).toArray((err, docs) => {
      if (docs) {
        var emails = '';
        for (var i = 0; i < docs.length-1; i++){
          emails = emails + docs[i].email + ', ';
        }
        emails = emails + docs[docs.length-1].email;
        console.log(emails);

        // Email notification test 3
        var mailOptions = {
            from: '"rfbGO" <rfbGO@deain.ru>', // sender address
            to: emails, // list of receivers
            subject: 'rfbGO notification ✔', // subject line
            text: 'Поступил новый вызов!', // plaintext body
            html: 'Поступил новый вызов! От <b>' + dataset.partner.tradepoint.name + '</b> в ' + dataset.partner.tradepoint.tradepoint + '.' // html body
        };
        transporter.sendMail(mailOptions, function(err, info){
          if(err){ return console.log(err); }
          console.log("Message sent: " + info.response);
        });
      } else {
        console.log('Epic fail :)');
      }
    });

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
      console.log( "Order accepted: " + JSON.stringify(orderid) + " " + JSON.stringify(dataset) );
      res.sendStatus(201);

      // Email notification test 2
      var mailOptions = {
          from: '"rfbGO" <rfbGO@deain.ru>', // sender address
          to: email, // list of receivers
          subject: 'rfbGO notification ✔', // subject line
          text: 'Вызов принят', // plaintext body
          html: 'Вызов принят' // html body
      };
      transporter.sendMail(mailOptions, function(err, info){
        if(err){ return console.log(err); }
        console.log("Message sent: " + info.response);
      });
    });
  });
});

apiRoutes.post("/orders/resolve", jsonParser, (req, res) => {
  let dataset = req.body.dataset || {};
  let orderid = dataset._id;
  delete dataset._id;
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: dataset}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order resolved: " + JSON.stringify(orderid) + " " + JSON.stringify(dataset) );
    res.sendStatus(201);

    //console.log(result);
    if (result.value.consultant.email) {
      // Email notification test 4
      var mailOptions = {
          from: '"rfbGO" <rfbGO@deain.ru>', // sender address
          to: result.value.consultant.email, // list of receivers
          subject: 'rfbGO notification ✔', // subject line
          text: 'Вызов завершён', // plaintext body
          html: 'Вызов завершён' // html body
      };
      transporter.sendMail(mailOptions, function(err, info){
        if(err){ return console.log(err); }
        console.log("Message sent: " + info.response);
      });
    }
  });
});

apiRoutes.post("/orders/cancel", jsonParser, (req, res) => {
  let dataset = req.body.dataset || {};
  let orderid = dataset._id;
  let orders = Mongo.orders();

  orders.findOneAndUpdate({_id: new Mongo.ObjID(orderid)}, {$set: {status: "Отменён"}, $currentDate: {"cancelled": {$type: "date"}}}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order cancelled: " + JSON.stringify(orderid) );
    res.sendStatus(201);
  });
});

// Apply the API routes       ==================================================
app.use('/api', apiRoutes);

// Start the server           ==================================================
app.listen(Config.port, () => console.log( "Started on port: " + Config.port ) );
