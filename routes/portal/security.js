var model = require('../model'),
    _ = require("underscore");
    
module.exports = function(app, passport, config){
    
  app.get('/signin', function(req, res){
    var f = req.flash('error');
    console.log(f);
    res.render('signin', { error: req.flash('error') });
  });
  
  app.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      console.dir(err);
      console.dir(user);
      console.dir(info);
      
      
      if (err) { 
        return res.redirect('/signin'); 
      }
      if (!user) { 
        var flash = { form: req.body };  
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
        return res.redirect('/');
      });
    })(req, res, next);
  });

  // app.post('/signin', passport.authenticate('local', function(err, user, info) {
  //   if (err) { 
  //     req.flash('info', ['Welcome', 'Please Enjoy']);
  //     return res.redirect('/signin'); 
  //   }
  //   if (!user) { 
  //     req.flash('info', ['Welcome', 'Please Enjoy']);
  //     return res.redirect('/signin'); 
  //   }
  //   req.logIn(user, function(err) {
  //     if (err) { 
  //       req.flash('info', ['Welcome', 'Please Enjoy']);
  //       return next(err); 
  //     }
  //     return res.redirect('/');
  //   });
  // });

  //app.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }));

  app.get('/signup', function(req, res){
    res.sendfile('static/signup.html', { root: config.deployPath });
  });

  app.post('/signup', function(req, res){
    var account = req.body;
      passport.createAccount(account, function (err, user) {
        if (err){
          return res.redirect('/signup');
        };
        passport.authenticate('local')(req, res, function () {
                res.redirect('/');
        });
    });
  });

  app.get('/signout', function(req, res){
      req.logout();
      res.redirect('/');
  });

  app.get('/password/reset', function(req, res){
    res.sendfile('static/passwordreset.html', { root: config.deployPath });
  });

  app.post('/password/reset', function(req, res){
    res.sendfile('static/passwordreset.html', { root: config.deployPath });
  });
}