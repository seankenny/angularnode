module.exports = function(app, passport, io){
  require('./staff')(app)

  app.get('/portal', function(req, res){
    res.render('base'); 
  });
};