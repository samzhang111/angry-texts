/* jslint node: true */
"use strict";

var moment = require('moment');
var escape = require('escape-html');

var mongoUri = process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL ||
'mongodb://localhost/badtexts';

/* GET home page. */
exports.show = function(req, res){
    var hashid = req.params.id;
    var MongoClient = require('mongodb').MongoClient, format = require('util').format;

    MongoClient.connect(mongoUri, function(err, db) {
        if(err) throw err;

        var collection = db.collection('texts');

        // Locate all the entries using find
        collection.findOne( { id: hashid }, function(err, result) {
            if (result === null) {
                console.dir("error" + hashid);
                res.render('error', {id: hashid});
            }
            else {
                result.msg = escape(result.msg);
                result.date = moment(result.date).format("h:mm A M/D/YYYY");

                res.render('id', {item:result});//{item: result});
            }
        db.close();
        });
    });

};

exports.report = function(req, res) {
    /* possible reasons:
     * 0 - not angry
     * 1 - spam
     * 2 - contains personal info
     * other */
    if (req.query.reason) {
        var hashid = req.params.id;
        var MongoClient = require('mongodb').MongoClient, format = require('util').format;
        
        var remote_ip = req.headers['X-Forwarded-For'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        var time = Date.now();

        MongoClient.connect(mongoUri, function(err, db) {
            if(err) throw err;

            var collection = db.collection('reports');
            collection.findOne( {id: hashid, ip:remote_ip}, function(err, result) {
                if (!result) {
                    collection.insert({
                        id:hashid,
                        date:time,
                        why:req.query.reason,
                        ip:remote_ip
                    }, function(err, docs) {
                        db.close();
                    });
                }
            });

        });
    }

    res.render();

};
