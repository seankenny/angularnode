var express = require('express')
  , path = require('path')
  , csrf = require('./csrf')();

module.exports = function(app, passport, config){

  app.configure(function(){
    app.use(express.favicon());
    app.use(express.compress());

    // static
    app.use('/vendor', express.static(config.deployPath + '/vendor'));
    app.use('/src', express.static(config.deployPath + '/src'));
    app.use('/assets', express.static(config.deployPath + '/assets'));
    //app.use('/', express.static(config.deployPath));  // only if authenticated as this is our main index.html page!

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

    app.use(express.logger());

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.cookieParser());                                   // required for CSRF
    app.use(express.cookieSession(config.session)); // session storage via cookie
    app.use(express.session(config.session));  // required for CSRF

    //auth setup
    app.use(passport.initialize());
    app.use(passport.session());
    
    // csrf set up
    // app.use(express.csrf({value: csrfValue}));
    // app.use(function(req, res, next){
    //   token = req.session._csrf;
    //   res.cookie('XSRF-TOKEN', req.session._csrf);
    //   next();
    // });

    // app.use(csrf.checkCsrf);
    // app.use(csrf.addCsrf);
  });

  // development only
  app.configure('development', function(){
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });
}