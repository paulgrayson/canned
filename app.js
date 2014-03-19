var http = require('http')
  , express = require('express')
  , canned = require('./lib/canned-server');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

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


// Routes

app.get('/', canned.routes.index);
app.get('/reset', canned.routes.reset);


// Sockets and Server

io.sockets.on('connection', function (socket) {
  canned.sockets.connected( socket );
});

server.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});
