module.exports = function(app, passport, io, config) {
  //require('./api')(app, io);
  //require('./portal')(app, passport, io);

  // public
  // app.get('/', function(req, res){
  //   //res.render('brochure/index'); 
  //   res.send('BRO');
  // });

  app.get('/aboutus', function(req, res){
    res.render('brochure/about'); 
  });

  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function(req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendfile('index.html', { root: config.deployPath });
  });
};