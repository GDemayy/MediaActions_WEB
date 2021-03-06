var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/users");
var aes256 = require('aes256');
var Hub = require('../models/hub');


var apiController = {};

apiController.login = function (req, res) {
    passport.authenticate('local')(req, res, function (error, user) {

        if (error) res.status(401).json({error: error});
        else res.json({user: req.user});
    });
}; 

apiController.register = function (req, res) {
    if (req.body.password !== req.body.passwordConf) {
        res.status(401);
        return res.json({error : 'Password don\'t match!]'});
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        var pwd = req.body.password;
        var array = pwd.split("");
        array.reverse();
        var cipher = aes256.createCipher(array.join(('')));
        var nuser = new User({email: req.body.email,
            username: req.body.username,
            provider: 'local-android',
            password: cipher.encrypt(req.body.password)});
        User.register(nuser, req.body.password, function (error, user) {
           if (error)
           {
               res.status(401);
               return res.json({error: error});
           }
        });
        res.status(200);
        return res.json([{message: 'Register OK'}, {user: nuser}]);
    }
    else {
        res.status(401);
        return res.json({error: 'One of fields is empty'})
    }
};

apiController.gallery = function(req, res) {
    Hub.find ( {}, {} ).exec(function (err, Result) {
        var data = [
            [String, String]
        ]

        var images = [];
        var nb = 0;

        for (var i = 0; i < Result.length; i++)
        {
            data.originalname = Result[i]["originalname"];
            data.mimetype = Result[i]["mimetype"];
            data.destination = Result[i]["destination"];
            data.filename = Result[i]["filename"];
            data.path = Result[i]["path"];
            data.size = Result[i]["size"];
            data.visibleName = Result[i]["visibleName"];
            data.description = Result[i]["description"];
            data.price = Result[i]["price"];

            if (data.description == null)
                data.description = "null";
            nb++;
            images.push({Path: data.path, Name: data.visibleName, Description: data.description, Price: data.price});
        }
        res.json({images});
    });
};


module.exports = apiController;