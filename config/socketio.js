module.exports = function(io, config){
  if (config.longPolling){
    io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
    io.set('log level', 2);
    });
  }
}