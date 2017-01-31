
module.exports = function(apiRoutes, jsonParser, Mongo, Mail) {
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
    } else if (role == 1) {
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

  apiRoutes.post("/user/role", (req, res) => {
    let dataset = req.body.dataset || {};
    let email = dataset.email;
    let role = dataset.role;
    let users = Mongo.users();

    users.findOneAndUpdate({"email": email}, {$set: {"role": role}}, {}, function(err, result){
      if(err) { res.sendStatus(400); console.log(err + " " + result); }
      else {
        res.status(201).send({ success: true, message: 'Role set' });

        console.log( "Role set: " + JSON.stringify(email) + " " + JSON.stringify(role) );
      }
    });
  });

  apiRoutes.post("/user/delete", (req, res) => {
    let dataset = req.body.dataset || {};
    let email = dataset.email;
    let role = dataset.role;
    let users = Mongo.users();

    if (role == 3) {
      users.deleteOne({"email": email}, {}, function(err, result){
        if(err) { res.sendStatus(400); console.log(err + " " + result); }
        else {
          res.status(201).send({ success: true, message: 'User deleted' });

          console.log( "User deleted: " + JSON.stringify(email) + " " + JSON.stringify(role) );
        }
      });
    }
  });

  apiRoutes.post('/user/letter', (req, res) => {
    let dataset = req.body.dataset || {};
    let email = dataset.email;
    let letter = dataset.letter;

    Mail.sendMail(email, letter);
  });
}
