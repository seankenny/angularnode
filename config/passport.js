var LocalStrategy = require('passport-local').Strategy,
    // users = require('../models/model').users,
    // accounts = require('../models/model').accounts,
    // bcrypt = require('bcrypt'),
    // SALT_WORK_FACTOR = 10;
    mongoose = require('mongoose')
  , User = mongoose.model('User')

module.exports = function(passport, config){

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    });
  });

  

  // passport.createAccount = function(signup, done) {

  //   if (signup.email === '' ||
  //       signup.password === '' ||
  //       signup.passwordRepeat === '' ||
  //       signup.organisationName === ''){
  //     return done({});
  //   }

  //   if (signup.password !== signup.passwordRepeat){
  //     return done('Passwords must match');
  //   } 

  //   if (signup.password.length < 8){
  //     return done('Passwords must be longer than 8');
  //   } 

  //   var account = { name: signup.organisationName };
  //   var user = { 
  //     email: signup.email,
  //     admin: true
  //   };

  //   // generate a salt & hash
  //   var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  //   user.password = bcrypt.hashSync(signup.password, salt);

  //   accounts.ensureIndex({ name:1 }, { unique:true }, function (err, index) {});
  //   accounts.insert(account, function(err, records) {
  //     if(err) {
  //       return done('There is already an organisation with this name.  Please choose another.');
  //     } 
  //     user.accountId = records[0]._id;
  //     users.insert(user, function(err, records) {
  //       if(err) {
  //           done(err);
  //       } else {
  //           done(null, records[0]);
  //       }
  //     });
  //   });
  // };

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' })
        }
        return done(null, user)
      })
    }
  ));
};