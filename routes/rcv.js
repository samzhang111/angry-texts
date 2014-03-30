var moment = require('moment');

var mongoUri = process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL ||
'mongodb://localhost/test';

/* GET users listing. */
exports.process = function(io) {
    return function(req, res){
        if (req.query.text !== undefined) {
            var MongoClient = require('mongodb').MongoClient
                , format = require('util').format;

            MongoClient.connect(mongoUri, function(err, db) {
                if(err) throw err;

                var collection = db.collection('badtexts');
                var now = Date.now()

                var fmtnow =  moment(now).format("h:mm A M/D/YYYY");

                collection.insert({date:now, msg:req.query.text}, function(err, docs) {
                    io.sockets.emit('text', {date:fmtnow, msg:req.query.text});
                    //inserted new message
                });

                db.close();
                })
        }
        res.send();
    }
};
