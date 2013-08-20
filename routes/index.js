module.exports = function(app, passport, io, config) {
  require('./api')(app, io);
  require('./portal')(app, passport, config);

  app.get('/about', function(req, res){
    res.sendfile('about.html', { root: config.appRoot + '/views' });  
  });

  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function(req, res) {
    if (req.isAuthenticated()){
      // Just send the index.html for other files to support HTML5Mode
      res.sendfile('index.html', { root: config.deployPath });
    } else {
      res.sendfile('index.html', { root: config.appRoot + '/views' });  
    }
  });
};