"use strict";

// Dependencies and params    ==================================================
let express = require( "express" );
let app = express();
// params
let port = 3001;
let url = 'mongodb://user:pass@localhost:27017/rfbgo-dev';
let secretkey = 'secretkey';
// mongo
let mongoUtil = require('./mongoUtil');
let ObjectID = require('mongodb').ObjectID;
// parsers
//app.use(express.cookieParser()); // read cookies (needed for auth)
//app.use(express.bodyParser()); // get information from html forms
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

// Initializing the App       ==================================================
mongoUtil.connect(url); // connecting to MongoDB
app.use( express.static(__dirname + "/../client") ); // default App route
//app.use(express.session({ secret: secretkey })); // session secret key

// Routing                    ==================================================
app.get("/consultants", (req, res) => {
  let consultants = mongoUtil.users();//consultants();

  consultants.find({"role":"0"}).limit(1).next((err,doc) => { // query
    if (err) { res.sendStatus(400); }
    console.log( JSON.stringify(doc) );
    res.json( doc ); // 1st consultant from collection
  });
});

app.get("/partners", (req, res) => {
  let partners = mongoUtil.users();//partners();

  partners.find({"role":"1"}, {"_id":false}).limit(1).next((err,doc) => { // query + projection
    if(err) { res.sendStatus(400); }
    console.log( JSON.stringify(doc) );
    res.json( doc ); // 1st partner from collection
  });
});

app.get("/tradepoints", (req, res) => {
  let tradepoints = mongoUtil.tradepoints();

  tradepoints.find().toArray((err,docs) => {
    if(err) { res.sendStatus(400); }
    console.log( JSON.stringify(docs) );
    //let pointsNames = docs.map((tradepoints) => tradepoints.name.concat(". ", tradepoints.address));
    res.json( pointsNames ); // the list of tradepoints names + addresses
  });
});

// Orders routing             ==================================================
app.get("/orders", (req, res) => {
  let orders = mongoUtil.orders();

  orders.find().toArray((err,docs) => {
    if (err) { res.sendStatus(400); }
    //console.log( JSON.stringify(docs) );
    res.json( docs ); // orders
  });
});

app.post("/orders/create", jsonParser, (req, res) => {
  let neworder = req.body.dataset || {};
  let orders = mongoUtil.orders();

  orders.insert(neworder, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order created: " + JSON.stringify( neworder ) );
    res.sendStatus(201);
  });
});

app.post("/orders/cancel", jsonParser, (req, res) => {
  let orderid = req.body.dataset || {};
  let orders = mongoUtil.orders();

  orders.findOneAndUpdate({_id: new ObjectID(orderid)}, {$set: {status: "Отменён"}}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order cancelled: " + JSON.stringify(orderid) );
    res.sendStatus(201);
  });
});

app.post("/orders/accept", jsonParser, (req, res) => {
  let setorder = req.body.dataset || {};
  let orderid = setorder._id;
  delete setorder._id;
  console.log( "Order before: " + JSON.stringify(orderid) + JSON.stringify(setorder) );

  let orders = mongoUtil.orders();

  orders.findOneAndUpdate({_id: new ObjectID(orderid)}, {$set: setorder}, function(err, result){
    console.log( "Order accepted: " + JSON.stringify(orderid) + JSON.stringify(setorder) );
    if(err) { res.sendStatus(400); }
    res.sendStatus(201);
  });
});

app.post("/orders/resolve", jsonParser, (req, res) => {
  let orderid = req.body.dataset || {};
  let orders = mongoUtil.orders();

  orders.findOneAndUpdate({_id: new ObjectID(orderid)}, {$set: {status: "Завершён"}}, function(err, result){
    if(err) { res.sendStatus(400); }
    console.log( "Order accepted: " + JSON.stringify(orderid) );
    res.sendStatus(201);
  });
});

// Starting the App           ==================================================
app.listen(port, () => console.log( "App is listening on " + port ) );
