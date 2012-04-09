(function() {
  var Connection, Db, Server, db, host, port;

  Db = require('mongodb').Db;

  Connection = require('mongodb').Connection;

  Server = require('mongodb').Server;

  host = process.env['MONGO_NODE_DRIVER_HOST'] ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';

  port = process.env['MONGO_NODE_DRIVER_PORT'] ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

  console.log(host);

  console.log(port);

  db = new Db('canned', new Server(host, port, {}), {});

  db.open(function(err, db) {
    console.log("db:");
    console.log(db);
    return console.log(err);
  });

}).call(this);
