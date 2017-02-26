"use strict";

let mongo = require('mongodb');
let client = mongo.MongoClient;
let _db;

module.exports = {
  ObjID: mongo.ObjectID,
  connect(url) {
    client.connect(url, (err, db) => {
      if(err) {
        console.log("Error connecting to Mongo");
        process.exit(1);
      }
      _db = db;
      console.log("Connected to Mongo");
    });
  },
  actions(){
    return _db.collection('actions');
  },
  orders(){
    return _db.collection('orders');
  },
  tradepoints(){
    return _db.collection('tradepoints');
  },
  users(){
    return _db.collection('users');
  }
}
