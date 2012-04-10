(function() {
  var Connection, Db, Server, colors, db, host, port, usedColors, _;

  Db = require('mongodb').Db;

  Connection = require('mongodb').Connection;

  Server = require('mongodb').Server;

  host = process.env['MONGO_NODE_DRIVER_HOST'] ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';

  port = process.env['MONGO_NODE_DRIVER_PORT'] ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

  console.log(host);

  console.log(port);

  db = new Db('canned', new Server(host, port, {}), {});

  db.open(function(err, db) {
    return db.collection('colors', function(err, colors) {
      return console.log(colors);
    });
  });

  exports.routes = {
    index: function(req, res) {
      return res.render('index', {
        title: 'Canned',
        color: 'red'
      });
    }
  };

  _ = require('underscore');

  colors = ['red', 'blue', 'yellow', 'black'];

  usedColors = {};

  _.each(colors, function(e) {
    console.log(e);
    return usedColors[e] = null;
  });

  exports.sockets = {
    connected: function(socket) {
      var color;
      color = _.find(colors, function(color) {
        return usedColors[color] === null;
      });
      usedColors[color] = true;
      console.log("color " + color);
      socket.emit("welcome", {
        color: color
      });
      socket.on('chat', function(data) {
        console.log(data);
        return socket.broadcast.emit('chat', data);
      });
      socket.broadcast.emit('joined', {
        color: color
      });
      return socket.on('typed', function(data) {
        console.log(data);
        return socket.broadcast.emit('typed', data);
      });
    }
  };

}).call(this);
