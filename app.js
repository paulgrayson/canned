
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , _ = require('underscore');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

// Sockets

var colors = ['red', 'blue', 'yellow', 'black'];
var usedColors = {};
_.each(colors, function(e){
  console.log( e );
  usedColors[e] = null;
});

io.sockets.on('connection', function (socket) {
  color = _.find( colors, function( color ) {
    return usedColors[color] === null;
  });
  usedColors[color] = true;
  console.log( "color "+ color )
  socket.emit("welcome", {color: color});
  socket.on('chat', function (data) {
    console.log(data);
    socket.broadcast.emit('chat', data);
  });
  socket.broadcast.emit('joined', {color: color});
  socket.on('typed', function (data) {
    console.log( data );
    socket.broadcast.emit('typed', data);
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
