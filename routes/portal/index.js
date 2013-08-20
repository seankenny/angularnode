module.exports = function(app, passport, config){
  //require('./staff')(app)
  require('./security')(app, passport, config)

  // app.get('/portal', function(req, res){
  //   res.render('base'); 
  // });
};