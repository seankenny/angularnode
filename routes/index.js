module.exports = function(app, passport, io) {
  require('./api')(app, io);
  require('./portal')(app, passport, io);

  // PUBLIC
  app.get('/', function(req, res){
    //res.render('brochure/index'); 
    res.render('index.html'); 
  });

  app.get('/about', function(req, res){
    res.render('brochure/about'); 
  });
};