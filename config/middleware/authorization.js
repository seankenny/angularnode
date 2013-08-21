/*
 *  Generic require login routing middleware
 */
//NOT USED YET - EVAAA?
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    return res.redirect('/login')
  }
  next()
}