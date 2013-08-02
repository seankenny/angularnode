var express = require('express');

// required for angular
var csrfValue = function(req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);  // angulars csrf header
  return token;
};

function checkCsrf(req, res, next) {
  if (req.path.substring(0, 7) == "/portal") {
    express.csrf({value: csrfValue});
  } else {
    next();
  }
}

// this is required for angularjs as it has it's own way of dealing with things.
function addCsrf(req, res, next) {
  if (req.path.substring(0, 7) == "/portal") {
    token = req.session._csrf;
    res.cookie('XSRF-TOKEN', req.session._csrf);
    next();
  } else {
    next();
  }
}

module.exports = function(){
  return {
    checkCsrf: checkCsrf,
    addCsrf: addCsrf
  }
}