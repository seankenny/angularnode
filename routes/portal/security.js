var model = require('../model'),
    _ = require("underscore");
    
module.exports = function(app, passport, config){
    
  app.get('/signin', function(req, res){
    res.render('signin', { error: req.flash('error')[0] });
  });
  
  app.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return res.redirect('/signin'); 
      }
      if (!user) { 
        var flash = { email: req.body.email, password: req.body.password };  
        if (info.invalidCredentials){
          flash.message = 'The username and password you specified are not valid.';
        }
        req.flash('error', flash);
        return res.redirect('/signin'); 
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.redirect('/signin'); 
        }
        return res.redirect('/home');
      });
    })(req, res, next);
  });

  app.get('/signup', function(req, res){
    res.render('signup', { error: req.flash('error')[0] });
  });

  app.post('/signup', function(req, res, next){
    var account = req.body;
      passport.createAccount(account, function (err, user) {
        if (err){
          
          req.flash('error', _.extend(req.body, _.extend(req.body, { message: err})));
          return res.redirect('/signup');
        };
        passport.authenticate('local')(req, res, function () {
                res.redirect('/home');
        });
    });
  });

  app.get('/signout', function(req, res){
      req.logout();
      res.redirect('/');
  });

  app.get('/password/reset', function(req, res){
    res.render('passwordreset', { message: req.flash('info')[0] });
  });

  app.post('/password/reset', function(req, res){
    req.flash('info', 'Email sent');
    res.redirect('/password/reset');
  });
}