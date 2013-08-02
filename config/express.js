var express = require('express')
  , path = require('path')
  , csrf = require('./csrf')();

module.exports = function(app, passport, config){

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', config.root + '/build');
    // app.set('views', config.root + '/views');
    //app.set('view engine', 'jade');

    app.use(express.cookieParser());                                   // required for CSRF
    app.use(express.cookieSession(config.session)); // session storage via cookie
    app.use(express.session(config.session));  // required for CSRF

    //auth setup
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // csrf set up
    // app.use(express.csrf({value: csrfValue}));
    // app.use(function(req, res, next){
    //   token = req.session._csrf;
    //   res.cookie('XSRF-TOKEN', req.session._csrf);
    //   next();
    // });

    // app.use(csrf.checkCsrf);
    // app.use(csrf.addCsrf);

    app.use(express.compress());
    app.use(app.router);
    app.use(express.static(path.join(config.root, 'build')));

    app.use(express.logger());
    app.engine('html', require('ejs').renderFile);
  });

  // development only
  app.configure('development', function(){
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });

}