var mongoose = require('mongoose');

const nodemailer = require('nodemailer');
const MAIL_USER = "contact@media-actions.eu";
const MAIL_PASS = "contact";

exports.show = function(req, res, next) {

    res.render('contact', {result: "none", user : req.user});
};

exports.send = function(req, res, next) {
    var email = req.body.email;
    if (email)
    {
      var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediaactionsfrance@gmail.com',
        pass: 'TeamKSO64Ever' // Le mot de passe est en dur, tu vas faire quoi? :hap:
      }
    });
    var mailOptions = {
      from: 'mediaactionsfrance@gmail.com',
      to: 'mediaactionsfrance@gmail.com',
      subject: 'Un message de' + req.body.email,
      text: ': \n' + req.body.message + '\nFrom \n' + req.body.email
    };
    transporter.sendMail(mailOptions, function(error, info){
    if (error)
      console.log(error);
    else
      console.log('Email sent: ' + info.response);
    });
      res.render('contact', {result: "ok", user:req.user});
    }
};
