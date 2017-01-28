"use strict";

let nodemailer  = require('nodemailer'); // send emails
let Config      = require('./configConstants'); // get our config file

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(Config.smtps);

module.exports = {
  sendMail(mailOptions) = transporter.sendMail(mailOptions, function(err, info){
    if(err){ return console.log(err); }
    console.log("Message sent: " + info.response);
  });
}
