var mongoose = require('mongoose');
var User = require("../models/users");

exports.index = function(req, res) {
  var test;
    if (req.user)
    {
        console.log("User infosW = " + req.user['path'])
        if (req.user['path'])
          test = req.user['path'].replace('public','')
                    /*
        var query = User.find({}).select('a');
        query.exec(function (err, someValue) {
            if (err) return next(err);
            if (someValue)
                {

                  console.log(someValue)
                }
        });
        */
    }
    res.render('index', { title: 'Media actions', user: req.user, test: test});
};
