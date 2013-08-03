var express = require('express')
  , path = require('path')
  , csrf = require('./csrf')();

module.exports = function(app, passport, config){

  app.configure(function(){
    app.use(express.favicon());
    
    // First looks for a static file: index.html, css, images, etc.
    app.use(express.compress());
    app.use('/vendor', express.static(config.staticPath));
    app.use('/src', express.static(config.rootPath + '/src'));
    app.use('/', express.static(config.rootPath));
    app.use('/vendor', function(req, res, next) {
      res.send(404); // If we get here then the request for a static file is invalid
    });
    app.use('/src', function(req, res, next) {
        console.log('xxx:' + config.rootPath + '/src');
      res.send(404); // If we get here then the request for a static file is invalid
    });

//    app.set('port', process.env.PORT || 3000);
//    app.set('views', config.rootPath);
 
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

//    app.use(express.static(path.join(config.rootPath, 'vendor')));

    //app.use(app.router);

    
    //app.engine('html', require('ejs').renderFile);


  });

  // development only
  app.configure('development', function(){
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });

}