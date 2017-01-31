
module.exports = function(apiRoutes, jsonParser, Mongo, Mail) {
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
    if ( _sts == 'Все') {
      orders.find().toArray((err, docs) => {
        if (err) { res.sendStatus(400); }
        res.json( docs ); // orders
        console.log("0");
      });
    } else {
      if ( _sts == 'Любой' || _sts == '' ) {
        if (!req.query) {
          orders.find().toArray((err, docs) => {
            if (err) { res.sendStatus(400); }
            res.json( docs ); // orders
            console.log("1");
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
            console.log("2");
          });
        } else {
          orders.find({ created: { $gte: _from, $lt: _to }, "status": _sts, $or:[{"partner.tradepoint.tp": _tp}, {"partner.tradepoint.wp": _wp}, {"partner.tradepoint.city": _city}] }, {}).toArray((err, docs) => {
            if (err) { res.sendStatus(400); }
            res.json( docs ); // orders
          });
        }
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
}
