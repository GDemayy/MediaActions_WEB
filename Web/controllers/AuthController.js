var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/users");
var aes256 = require('aes256');
var multer = require('multer');
var userController = {};
var upload = multer({dest: 'public/uploads/profile'})

userController.home = function (req, res) {
    res.render('index', {user: req.user});
};

userController.register = function (req, res) {
    res.render('register', {user: req.user});
};

userController.doRegister = function (req, res, next) {
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.render('register', {title: 'Register', error: true,
            errorText: "The password don't match !"});
        res.send("passwords don't match");
        //return next(err);
    }
    //upload.any();
    if (req.body.email && req.body.username && req.body.password && req.body.passwordConf)
    {
        var i = 0;
        var contact = 0;
        var pwd = req.body.password;
        while (pwd[i])
        {
            if (pwd[i] < "0" || (pwd[i] > "9" && pwd[i] < "A") || (pwd[i] > "Z" && pwd[i] < "a") || pwd[i] > "z")
                contact = 1;
            i++;
        }
        if (i >= 8 && contact == 0) {
            var array = pwd.split("");
            array.reverse();
            var cipher = aes256.createCipher(array.join(('')));
            console.log(req.files[0].path)
            var nuser = new User({
                email: req.body.email,
                username: req.body.username,
                provider: 'local',
                path: req.files[0].path,
                password: cipher.encrypt(req.body.password)
            });
            console.log("Data de l'utilisateur :" + nuser);
            User.register(nuser, req.body.password, function (error, user) {
                if (error) {
                    return res.render('register', { user: user });
                }
                passport.authenticate('local')(req, res, function (error, user) {
                    req.session.user = nuser;
                    upload.any();
                    res.render('index', { user: nuser });
                });
            });
        }
        else {
            return res.render('register', { user: user });
        }
    }
};

userController.login = function(req, res) {
  res.render('login', {user: req.user, error: null});
};

userController.doLogin = function(req, res, next) {
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' })(req, res, function (error, user) {
        if (error)
        {
            console.log(error);
            return res.render('login', {error: error});
        }
        req.session.user = user;
        return res.render('index', {user: req.user});
    });
};

userController.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = userController;
