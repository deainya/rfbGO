"use strict";

let config      = require('./config'); // get our config file
let nodemailer  = require('nodemailer'); // send emails

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(config.smtps);

module.exports = {
  sendMail(mailOptions){
    return transporter.sendMail(mailOptions, function(err, info){
      if(err){ return console.log(err); }
      console.log("Message sent"); // + info.response
    });
  }
}
