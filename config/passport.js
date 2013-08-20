var LocalStrategy = require('passport-local').Strategy,
    users = require('../routes/model').users,
    accounts = require('../routes/model').accounts,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

module.exports = function(passport, config){

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    users.findById(id, done);
  });

  var findByEmail = function(email, done) {
    users.findOne({email: email}, function(err, user) {
      if(err || user){
        return done(err, user);
      } 
      return done(null, null);
    });
  }

  passport.createAccount = function(signup, done) {
    if (signup.password !== signup.passwordRepeat){
      return done(new Error("Passwords must match"));
    } 

    var account = { name: signup.organisationName };
    var user = { 
      email: signup.email,
      admin: true
    };

    // generate a salt & hash
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    user.password = bcrypt.hashSync(signup.password, salt);

    accounts.ensureIndex({ name:1 }, { unique:true }, function (err, index) {});
    accounts.insert(account, function(err, records) {
      if(err) {
          return done(err);
      } 
      user.accountId = records[0]._id;
      users.insert(user, function(err, records) {
        if(err) {
            done(err);
        } else {
            done(null, records[0]);
        }
      });
    });
  };

  passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        console.log('here');
        findByEmail(email, function(err, user) {
          if (err) {
            return done(err); // system exception
          }
          if (!user) {
            return done(null, false, { invalidCredentials: true }); 
          }
          if(bcrypt.compareSync(user.password, password)) {
            return done(null, false, { invalidCredentials: true }); 
          }
          return done(null, user);  // valid
        });
    }
  ));
};