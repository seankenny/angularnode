var path = require('path')
  , appRoot = path.normalize(__dirname + '/../');

var session = {
  key: 'myapp',
  secret: 'skZ!@@VVMja6*KJlFksl%j6m',
  //cookie: {httpOnly: true, secure: true}  // cookies over HTTPS only
};

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/appoyntmedb',
    port: 3000,
    session: {
      secret: 'skZ!@@VVMja6*KJlFksl%j6m'
    },
    deployPath: appRoot + 'build',
    appRoot: appRoot
  },
  production: {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
    port: process.env.PORT,
    session: {
      secret: 'skZ!@@VVMja6*KJlFksl%j6m'
    },
    deployPath: appRoot + 'bin',
    longPolling: true,
    appRoot: appRoot
  }
}