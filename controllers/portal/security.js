var   model = require('../../models/model')
    , _ = require("underscore")
    , nodemailer = require("nodemailer");
    
// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
  service: 'Gmail', // use well known service.
                      // If you are using @gmail.com address, then you don't
                      // even have to define the service name
  auth: {
      user: "appoyntme.mailer@gmail.com",
      //pass: "XXXXX"
  }
});

console.log('SMTP Configured');

// Message object
var message = {

    // sender info
    from: 'appoyntme.mailer@gmail.com',

    // Comma separated list of recipients
    to: 'srkenny@gmail.com',

    // Subject of the message
    subject: 'Nodemailer is unicode friendly ✔', //

    headers: {
        'X-Laziness-level': 1000
    },

    // plaintext body
    text: 'Hello to myself!',

    // HTML body
    html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
         '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>',
};

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
    transport.sendMail(message, function(error){
      console.log('sending!');
      if(error){
          console.log('Error occured');
          console.log(error.message);
          return;
      }
      console.log('Message sent successfully!');

      // if you don't want to use this transport object anymore, uncomment following line
      transport.close(); // close the connection pool
     });
    req.flash('info', 'Email sent');
    res.redirect('/password/reset');
  });
}