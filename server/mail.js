"use strict";

let config      = require('./config'); // get our config file
let nodemailer  = require('nodemailer'); // send emails

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(config.smtps);

module.exports = {
  sendMail(mail_to, message, htmlmessage){
    if (!htmlmessage) {
      var mailOptions = {
        from: config.mail_addresser, // sender address
        to: mail_to, // list of receivers
        subject: config.mail_subject, // subject line
        text: message, // plaintext body
        html: message // html body
      };
    } else {
      var mailOptions = {
        from: config.mail_addresser, // sender address
        to: mail_to, // list of receivers
        subject: config.mail_subject, // subject line
        text: message, // plaintext body
        html: htmlmessage // html body
      };
    }
    return transporter.sendMail(mailOptions, function(err, info){
      if(err){ return console.log(err); } else { return console.log("The letter has been sent"); }
    });
  }
}
