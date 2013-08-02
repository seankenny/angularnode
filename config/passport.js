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

  passport.use(new LocalStrategy(function(email, password, done) {
      // TEMP START
      findByUsername(email, function(err, user) {
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

  // passport.use(new LocalStrategy(
  //   function(username, password, done) {
  //     // Find the user by username.  If there is no user with the given
  //     // username, or the password is not correct, set the user to `false` to
  //     // indicate failure and set a flash message.  Otherwise, return the
  //     // authenticated `user`.
  //     findByUsername(username, function(err, user) {
  //       if (err) { return done(err); }
  //       if (!user) { return done(null, false); }
  //       if (user.password != password) { return done(null, false); }
  //       return done(null, user);
  //     });
  //   }
  // ));

// passport.use(new TwitterStrategy({
//         consumerKey: 'OoS4aVvIuCrcjJps0VUw',
//         consumerSecret: 'VITr9mZvbb2OVge02vNAzSgHvSg6LGkHnZMad4vUJH0',
//         callbackURL: "http://sisu.io/auth/twitter/callback"
//     },
//     function(token, tokenSecret, profile, done) {
//       done(null, true);
//       // findByUsername(username, function(err, user) {
//       //     if (err) { return done(err); }
//       //     if (!user) { return done(null, false); }
//       //     if (user.password != password) { return done(null, false); }
//       //     return done(null, user);
//       //   });

//       // console.log('callback! ->' + profile.id);
//       //   var user = users[profile.id] || 
//       //              (users[profile.id] = { id: profile.id, name: profile.username });
//       //   done(null, true);//user);
//     }
// ));
};