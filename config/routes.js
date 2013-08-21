
/*!
 * Module dependencies.
 */

//var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/portal/users')
  //, articles = require('../controllers/articles')
  //, auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

//var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport, config) {

  // user routes
  app.get('/signin', users.signin)
  app.post('/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/signup', users.signup)
  app.post('/signup', users.register)
  
  app.get('/signout', users.signout)

  app.get('/password/reset', users.getresetpassword)
  app.post('/password/reset', users.resetpassword)
  
  //app.post('/users', users.create)
  //app.get('/users/:userId', users.show)
  
  //app.param('userId', users.user)

  // article routes
  // app.get('/articles', articles.index)
  // app.get('/articles/new', auth.requiresLogin, articles.new)
  // app.post('/articles', auth.requiresLogin, articles.create)
  // app.get('/articles/:id', articles.show)
  // app.get('/articles/:id/edit', articleAuth, articles.edit)
  // app.put('/articles/:id', articleAuth, articles.update)
  // app.del('/articles/:id', articleAuth, articles.destroy)

  //app.param('id', articles.load)

  // home route
  //app.get('/', articles.index)

  app.get('/about', function(req, res){
    res.sendfile('about.html', { root: config.appRoot + '/app/views' });  
  });

  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function(req, res) {
    if (req.isAuthenticated()){
      // Just send the index.html for other files to support HTML5Mode
      res.sendfile('index.html', { root: config.deployPath });
    } else {
      res.sendfile('index.html', { root: config.appRoot + '/app/views' });  
    }
  });

}