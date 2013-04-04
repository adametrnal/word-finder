//var	mongo = require('mongodb');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'localhost';

var mongoPort = 27017; 

console.log(mongoUri);

// Main DB provider object
DictionaryProvider = function() {
    this.db = new Db("dictionary-db", new Server(mongoUri, mongoPort, { auto_reconnect: true }, {}));
    this.db.open(function(error, db){
        //db.authenticate(user, pass, function(error, result) {});
    });
};

// This gets us in the to 'locations' collection, which is where
// the farmstand records live.
DictionaryProvider.prototype.getDictionaries= function(callback) {
    this.db.collection('dictionaries', function(error, dictionary_collection) {
		if (error) {
			callback(error);
		}
		else {
			callback(null, dictionary_collection);
		}
    });
};

// Write the suppiled records into the database.
DictionaryProvider.prototype.add_dictionary = function(dict, callback) {
    this.getDictionaries(function(error, dictionary_collection) {
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

DictionaryProvider.prototype.get_dictionary = function(lang, callback) {
    this.getDictionaries(function(error, dictionary_collection) {
		if (error) {
			callback(error);
		}
		else {
			var cursor = dictionary_collection.find({ 'lang': lang }).limit(1);
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