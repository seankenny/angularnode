var mongo = require('mongoskin');
var BSON = mongo.BSONPure;
var mongoUri = process.env.MONGOLAB_URI || 
               process.env.MONGOHQ_URL || 
               'mongodb://localhost:27017/mydb';

var db = mongo.db(mongoUri);

module.exports = {
  staff: db.collection('staff'),
  toObjectId: function(_id){ return BSON.ObjectID(_id); },
  toDate: function(stringDate){ return new Date(stringDate); },
  dateRange: function(fromDate, toDate){ 
    toDate = toDate || fromDate;
    
    var fromDateParts = fromDate.split('-');
    var toDateParts = toDate.split('-');
    
    var startDate = new Date(fromDateParts[0], fromDateParts[1]-1, fromDateParts[2]);
    var endDate = new Date(toDateParts[0], toDateParts[1]-1, toDateParts[2]);
    endDate.setDate(endDate.getDate()+1);
    return {
    fromDate: startDate,
    toDate: endDate
  };},
  db: db
};