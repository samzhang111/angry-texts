/* jslint node: true */
"use strict";

var moment = require('moment');
var escape = require('escape-html');

var mongoUri = process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL ||
'mongodb://localhost/badtexts';

/* GET home page. */
exports.index = function(req, res){
      var MongoClient = require('mongodb').MongoClient, format = require('util').format;
      MongoClient.connect(mongoUri, function(err, db) {
      if(err) throw err;

      var collection = db.collection('texts');

        // Locate all the entries using find
        collection.find().sort({date:-1}).limit(10).toArray(function(err, results) {
            results.forEach(function(elem) {
                elem.msg = escape(elem.msg);
                elem.date = moment(elem.date).format("h:mm A M/D/YYYY");
            });
            res.render('index', { msgs: results });
              // Let's close the db
          db.close();
        });
    });
};
