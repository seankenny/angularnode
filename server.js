var app = require('express')()
  , server = require('http').createServer(app)
  , passport = require('passport')
  , io = require('socket.io').listen(server)
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];

// bootstrap mongoose config
require('./config/mongoose')(config);

// bootstrap passport config
require('./config/passport')(passport, config);

// bootstrap express config
require('./config/express')(app, passport, config);

// Bootstrap routes
require('./config/routes')(app, passport, config);

// Bootstrap controllers
//require('./controllers/index')(app, passport, io, config);

server.listen(config.port, function(){
  console.log('Express server listening on port ' + config.port);
});

// bootstrap socket.io config
require('./config/socketio')(io, config);

module.exports = app;