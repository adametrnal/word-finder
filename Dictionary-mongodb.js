var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var mongoEnv = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'localhost';

var mongoHost,
	mongoPort,
	dbName;

if(mongoEnv !== 'localhost'){
	mongoHost = 'ds047057.mongolab.com';
	mongoPort = 47057;
	dbName = 'heroku_app14477971';
}
else {
	mongoHost = 'localHost';
	mongoPort = 27017;
	dbName = 'dictionary-db';
}
 

console.log(mongoEnv);

// Main DB provider object
DictionaryProvider = function() {
    this.db = new Db(dbName, new Server(mongoHost, mongoPort, { auto_reconnect: true }, {}));
    this.db.open(function(error, db){
        if(mongoEnv !== 'localhost') {
        	db.authenticate('heroku_app14477971', '6d42irhc81cd0ep4jb3d3t4hef', function(error, result) {});
        }
    });
};

// This gets us in the to collection specified by 'lang'
DictionaryProvider.prototype.getDictionaries = function(lang, callback) {
    this.db.collection(lang, function(error, dictionary_collection) {
		if (error) {
			callback(error);
		}
		else {
			callback(null, dictionary_collection);
		}
    });
};

// Create a collection called 'lang' and insert dict into it
DictionaryProvider.prototype.add_dictionary = function(lang, dict, callback) {
    this.getDictionaries(lang, function(error, dictionary_collection) {
		if (error) {
			callback(error);
		}
		else {
			dictionary_collection.insert(dict, function(error, result) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, result);
				}
			});
		}
	});
};

// Retrieve a dicttionary collection with name 'lang'
DictionaryProvider.prototype.get_dictionary = function(lang, callback) {
    this.getDictionaries(lang, function(error, dictionary_collection) {
		if (error) {
			callback(error);
		}
		else {
			var cursor = dictionary_collection.find().limit(1);
            cursor.toArray(function(error, result) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, result);
				}
			});
		}
    });
};

// Export the DB provider for use in other modules.
exports.DictionaryProvider = DictionaryProvider;