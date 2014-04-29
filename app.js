var http = require('http');
var express = require('express');
var canned = require('./lib/canned-server');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongo = require('mongodb');
var port = 3000;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
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

// Use this middleware to prevent browser caching
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

var twitterLogin = new canned.TwitterLogin(canned.config.consumerKey, canned.config.consumerSecret);

// Initialise mongo connection then start http
var mongoUrl = function() {
  var host = process.env['MONGO_NODE_DRIVER_HOST'] || 'localhost';
  var port = process.env['MONGO_NODE_DRIVER_PORT'] || mongo.Connection.DEFAULT_PORT;
  return 'mongodb://'+ host +':'+ port +'/canned';
};

mongo.MongoClient.connect(mongoUrl(), function(err, database) {
  if(err) throw err;
  global.db = database;
  server.listen(port, function() {
    console.log("Express server listening on port %d", port);
  });
  io.sockets.on('connection', function (socket) {
    canned.sockets.connected( socket );
    console.log("Listening on sockets");
  });
});

app.get('/', canned.routes.index);
app.get('/reset', nocache, canned.routes.reset);
app.get('/login', nocache, function(req, res) { twitterLogin.loginAction(req, res) });
app.get('/oauth-callback', function(req, res) { twitterLogin.callbackAction(req, res) });

