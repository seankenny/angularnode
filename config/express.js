var express = require('express')
  , csrf = require('./csrf')()
  , flash = require('connect-flash');

module.exports = function(app, passport, config){

  app.configure(function(){
    app.use(express.favicon());
    app.use(express.compress());

    // static
    app.use('/vendor', express.static(config.deployPath + '/vendor'));
    app.use('/src', express.static(config.deployPath + '/src'));
    app.use('/assets', express.static(config.deployPath + '/assets'));

    //If we get here then the request for a static file is invalid
    app.use('/vendor', function(req, res, next) {
      res.send(404); 
    });
    app.use('/src', function(req, res, next) {
      res.send(404);
    });
    app.use('/assets', function(req, res, next) {
      res.send(404);
    });

    app.set('views', config.appRoot + '/app/views');
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.cookieParser());                                   // required for CSRF
    app.use(express.cookieSession(config.session)); // session storage via cookie - REMOVE AND USE REDIS OR SIMILAR
    //app.use(express.session(config.session));  // required for CSRF
    
    //auth setup
    app.use(passport.initialize());
    app.use(passport.session());
    
    // csrf set up
    app.use(express.csrf());
    
    // makes the token available to the templates - see signup form for hidden input
    app.use(function(req, res, next){
      csrftoken = req.session._csrf;
      res.cookie('XSRF-TOKEN', req.session._csrf);
      next();
    });

    // angularjs xsrf requirement
    app.use(csrf.checkCsrf);
    app.use(csrf.addCsrf);

    app.use(flash());
  });

  // development only
  app.configure('development', function(){
    app.use(express.logger({format: 'dev'}));
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });

// development only
  app.configure('production', function(){
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });

  app.use(app.router);
}