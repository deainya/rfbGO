"use strict";

let mongo = require('mongodb');
let client = mongo.MongoClient;
let _db;

module.exports = {
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
  consultants(){
    return _db.collection('consultants');
  },
  orders(){
    return _db.collection('orders');
  },
  partners(){
    return _db.collection('partners');
  },
  tradepoints(){
    return _db.collection('tradepoints');
  },
  users(){
    return _db.collection('users');
  }
}
