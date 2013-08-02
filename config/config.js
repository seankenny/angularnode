var path = require('path')
  , rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/appoyntmedb',
    port: 3000,
    session: {
      secret: 'skZ!@@VVMja6*KJlFksl%j6m'
    },
    root: rootPath
    //notifier: notifier,
    // app: {
    //   name: 'Nodejs Express Mongoose Demo'
    // },
    // twitter: {
    //   consumerKey = 'OoS4aVvIuCrcjJps0VUw',
    //   consumerSecret =  'VITr9mZvbb2OVge02vNAzSgHvSg6LGkHnZMad4vUJH0',
    //   callbackURL =  'http://appoynt.me.io/auth/twitter/callback'
    // }
  },
  production: {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
    port: process.env.PORT,
    session: {
      secret: 'skZ!@@VVMja6*KJlFksl%j6m'
    },
    root: rootPath,
    longPolling: true
    //notifier: notifier,
    // app: {
    //   name: 'Nodejs Express Mongoose Demo'
    // },
    // twitter: {
    //   consumerKey = 'OoS4aVvIuCrcjJps0VUw',
    //   consumerSecret =  'VITr9mZvbb2OVge02vNAzSgHvSg6LGkHnZMad4vUJH0',
    //   callbackURL =  'http://appoynt.me.io/auth/twitter/callback'
    // }
  },
}