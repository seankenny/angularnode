var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, config){

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
      done(err, user);
    });
  });

  // TEMP START
  var users = [
      { id: 1, password: 'jill', username: 'jill@appoynt.me' }
    , { id: 2, password: 'jack', username: 'jack@appoynt.me' }  
  ];

  function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
      fn(null, users[idx]);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  }

  function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  }
  // TEMP END

  passport.use(
    new LocalStrategy(
      function(email, password, done) {
        console.log('******************************');
        console.log(email);
        console.log(password);
        // TEMP START
        findByUsername(email, function(err, user) {
          console.log('******************************');
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (user.password != password) { return done(null, false); }
          return done(null, user);
        });

      // User.findOne({ email: email }, function (err, user) {
      //   if (err) { return done(err) }
      //   if (!user) {
      //     return done(null, false, { message: 'Unknown user' })
      //   }
      //   if (!user.authenticate(password)) {
      //     return done(null, false, { message: 'Invalid password' })
      //   }
      //   return done(null, user)
      // })
      // TEMP END
    }
  ));
};