(function() {
  var Connection, Db, Server, colors, db, host, port, selectColor, usedColors, _;

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
      var userid;
      userid = req.cookies['userid'];
      if (!userid) {
        userid = Date.now() * 100 + Math.floor(Math.random() * 100);
        res.cookie('userid', userid, {
          maxAge: 1000 * 60 * 60 * 24 * 120
        });
      }
      return res.render('index', {
        title: 'Canned',
        color: 'red',
        userid: userid
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

  selectColor = function(userid) {
    var color;
    color = _.find(colors, function(color) {
      return usedColors[color] === null;
    });
    usedColors[color] = true;
    return color;
  };

  exports.sockets = {
    connected: function(socket) {
      return socket.on('set userid', function(userid) {
        var color;
        color = selectColor(userid);
        console.log("color " + color);
        socket.emit("welcome", {
          userid: userid,
          color: color
        });
        socket.on('chat', function(data) {
          console.log(data);
          return socket.broadcast.emit('chat', data);
        });
        socket.broadcast.emit('joined', {
          userid: userid,
          color: color
        });
        return socket.on('typed', function(data) {
          console.log(data);
          return socket.broadcast.emit('typed', data);
        });
      });
    }
  };

}).call(this);
