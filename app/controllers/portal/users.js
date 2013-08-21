var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../../lib/utils')
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

module.exports.getreset = function(req, res){
  res.render('passwordreset', { message: req.flash('info')[0] });
};

//app.post('/password/reset', function(req, res){
module.exports.reset = function(req, res){
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
};