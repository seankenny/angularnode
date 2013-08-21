var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../../lib/utils');

module.exports.signin = function(req, res){
    res.render('signin', {
      title: 'Login',
      message: req.flash('error')
    });
    //res.render('signin', { error: req.flash('error')[0] });
  };
  
module.exports.session = function (req, res) {
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo)
    delete req.session.returnTo
    return
  }
  res.redirect('/')
};

module.exports.signup = function(req, res){
  res.render('signup', {
    title: 'Sign up',
    user: new User()
  });
};

module.exports.register = function(req, res, next){
  //var account = req.body;
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.render('signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  });
};

module.exports.signout = function(req, res){
  req.logout();
  res.redirect('/');
};

module.exports.getresetpassword = function(req, res){
  res.render('passwordreset', { message: req.flash('info')[0] });
};

//app.post('/password/reset', function(req, res){
module.exports.resetpassword = function(req, res){
  req.flash('info', 'Email sent');
  res.redirect('/password/reset');
};