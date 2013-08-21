var   mongoose = require('mongoose')
    , fs = require('fs');

module.exports = function(config){
  // Bootstrap models
  var models_path = config.appRoot + '/models'

  fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')){
      require(models_path + '/' + file)
  }
});

  mongoose.connect(config.db);
}