var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('test', new Server('locahost', 27017));
// Establish connection to db
db.open(function(err, db) {
  // Create a new instance of the gridstore
  var gridStore = new GridStore(db, 'ourexamplefiletowrite.txt', 'w');

  // Open the file
  gridStore.open(function(err, gridStore) {

    // Write some data to the file
    gridStore.write('bar', function(err, gridStore) {
      assert.equal(null, err);

      // Close (Flushes the data to MongoDB)
      gridStore.close(function(err, result) {
        assert.equal(null, err);

        // Verify that the file exists
        GridStore.exist(db, 'ourexamplefiletowrite.txt', function(err, result) {
          assert.equal(null, err);
          assert.equal(true, result);

          db.close();
        });
      });
    });
  });
});