var mongoose = require('mongoose');
var Hub = require('../models/hub');
var Jimp = require("jimp");
var looksSame = require('looks-same');
var multer = require('multer');
var fs = require("fs");

var upload = multer({dest: 'public/uploads/'})

exports.display = function(req, res, next)
{
  if (req.user === 'undefined' || req.user == null)
    res.redirect('/login');
  res.render('hub', {title: 'Upload', user:req.user});
};

function checkType(data)
{
  var n = data.mimetype.localeCompare("image/jpeg");
  if (n == 0)
  {
    data.filename += ".png";
    Jimp.read("./public" + data.path, function (err, lenna)
    {
      if (err) throw err;
      lenna.write("./public/uploads/" + data.filename); // save
    });
  }
  return (n);
}

exports.upload = function(req, res, next)
{
  if (req.user === 'undefined' || req.user == null)
    res.redirect('/login');
  var hubData =
  {
    author: req.user.username,
    originalname: req.files[0].originalname,
    mimetype: req.files[0].mimetype,
    destination: req.files[0].destination,
    filename: req.files[0].filename,
    path: "/uploads/" + req.files[0].filename,
    size: req.files[0].size,
    date: new Date(),
    visibleName: req.body.name,
    description: req.body.description,
    price: req.body.price
  }
  if (checkType(hubData) == 0)
  {
    hubData.path += ".png";
  }
  upload.any();
  Hub.create(hubData, function (error, hub) {
    if (error)
      console.log(error)
    else
      console.log(hub);
  });
res.render('hub', {title: 'Upload', user:req.user});
}
