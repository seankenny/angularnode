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

  app.get('/login', function(req, res){
    res.sendfile('static/login.html', { root: config.deployPath });
  });

  app.get('/', function(req, res){
    if (!req.isAuthenticated()){
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