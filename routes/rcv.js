/* jslint node: true */
"use strict";

var config = require('../config');
var moment = require('moment');
var Hashids = require('hashids');
var salt = process.env.SALT || config.salt;
var hashids = new Hashids(salt);
var mongoUri = process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL ||
'mongodb://localhost/badtexts';

/* GET users listing. */
exports.process = function(io) {
    return function(req, res){
        if (req.query.text !== undefined &&
            req.query.messageId !== undefined) {
            var MongoClient = require('mongodb').MongoClient, format = require('util').format;

            MongoClient.connect(mongoUri, function(err, db) {
                if(err) throw err;

                var collection = db.collection('texts');
                var now = Date.now();

                var fmtnow =  moment(now).format("h:mm A M/D/YYYY");
                var hashid = hashids.encrypt(parseInt(req.query.messageId, 16));

                var phone_hash = require('crypto').createHash("md5").update(req.query.msisdn).digest("hex");
                collection.insert({
                    id:hashid,
                    type:req.query.type,
                    code:req.query['network-code'],
                    sender:phone_hash,
                    date:now,
                    msg:req.query.text,
                    timestamp:req.query['message-timestamp'],
                    concat:req.query.concat,
                    concatref:req.query['concat-ref'],
                    concattotal:req.query['concat-total'],
                    concatpart:req.query['concat-part'],
                    data:req.query.data,
                    udh:req.query.udh
                }, function(err, docs) {
                    io.sockets.emit('text', {id:hashid, date:fmtnow, msg:req.query.text});
                    //inserted new message
                });
            });
        }
        res.send();
    };
};
