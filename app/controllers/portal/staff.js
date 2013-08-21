var model = require('../model'),
    _ = require("underscore");
    
module.exports = function(app){
    
    // TEMP
    app.get('/portal/resources', function(req, res) {
        model.staff.find().toArray(function(err, items) {
            res.send(_.map(items, function(item) { return { id: item._id, name: item.firstName };}));
            //res.send(items);
        });
    });

    app.get('/portal/staff', function(req, res) {
        model.staff.find().toArray(function(err, items) {
            res.send(items);
        });
    });

    app.get('/portal/staff/:id', function(req, res) {
        var id = req.params.id;
        model.staff.findById(id, function(err, item) {
            res.send(item);
        }); 
    });

    app.post('/portal/staff', function(req, res) {
        var staffmember = req.body;
        if (staffmember._id){
            console.log('1');
            staffmember._id = model.toObjectId(staffmember._id);
        }
        
        model.staff.save(staffmember, {upsert: true, safe:true}, function(err, result) {
            console.dir(err);
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send({ _id: staffmember._id.toString()});
            }
        });
    });

    app.del('/portal/staff/:id', function(req, res) {
        var id = req.params.id;
        model.staff.removeById(id, function(err, items) {
            res.send(200);
        }); 
    });
}