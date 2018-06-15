var mongoose = require('mongoose');
var User     = require('../models/users')

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

function funkytown()
{
    User.find({}, {}).exec(function(err, Result){
	console.log(Result);
    })
}

exports.profil = function(req, res, next) {
  var image;
  if (req.user)
  {
    if (req.user['path'])
      var image = req.user['path'].replace('public','')
  }
  else {
    image = "nopath"
  }
  funkytown();
  res.render('profil', { title: 'Media actions', user: req.user, image: image});
};
