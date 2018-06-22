var mongoose = require('mongoose');
var User = require("../models/users");

exports.index = function(req, res) {
  res.render('index', { title: 'Media actions', user: req.user});
};
