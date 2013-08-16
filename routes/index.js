module.exports = function(app, passport, io, config) {
  //require('./api')(app, io);
  //require('./portal')(app, passport, io);

  // public
  // app.get('/', function(req, res){
  //   //res.render('brochure/index'); 
  //   res.send('BRO');
  // });

  app.get('/about', function(req, res){
    res.sendfile('static/about.html', { root: config.deployPath });
  });

  app.get('/signin', function(req, res){
    console.log('h2');
    res.sendfile('static/signin.html', { root: config.deployPath });
  });

  app.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin' }));

  app.get('/signup', function(req, res){
    res.sendfile('static/signup.html', { root: config.deployPath });
  });

  app.post('/signup', function(req, res){
    // do something!
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

  app.get('/', function(req, res){
    if (req.isAuthenticated()){
      res.sendfile('index.html', { root: config.deployPath });  
    } else {
      res.sendfile('static/index.html', { root: config.deployPath });  
    }
  });

  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function(req, res) {
    if (!req.isAuthenticated()){
      // Just send the index.html for other files to support HTML5Mode
      res.sendfile('index.html', { root: config.deployPath });
    } else {
      res.send(404);
    }
  });
};