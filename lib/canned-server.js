var addMessage, fetchChat, removeAllChats;

fetchChat = function(db, callback) {
  return db.collection('chat', function(err, chat) {
    if (err) {
      logError(err);
      return callback(err, null);
    } else {
      return chat.find({}, {
        limit: 50
      }).toArray(function(err, messages) {
        if (err) {
          return callback(err);
        } else {
          return callback(err, messages);
        }
      });
    }
  });
};

addMessage = function(db, color, userid, twitterId, text, callback) {
  return db.collection('chat', function(err, chat) {
    if (err) {
      logError(err);
      return callback(err, null);
    } else {
      return chat.insert({
        color: color,
        userid: userid,
        text: text,
        twitterId: twitterId
      }, callback);
    }
  });
};

removeAllChats = function(db, callback) {
  return db.collection('chat', function(err, chat) {
    if (err) {
      return logError(err);
    } else {
      return chat.remove({}, {}, function(err, numRemoved) {
        if (!err) {
          console.log("Removed " + numRemoved + " chats");
        }
        return callback(err, db);
      });
    }
  });
};

var assignUserColor, colors, fetchOrCreateUserColor, usedColors, _;

_ = require('underscore');

colors = ['red', 'blue', 'yellow', 'black'];

usedColors = {};

_.each(colors, function(e) {
  console.log(e);
  return usedColors[e] = null;
});

assignUserColor = function() {
  var color;
  color = _.find(colors, function(color) {
    return usedColors[color] === null;
  });
  usedColors[color] = true;
  return color;
};

fetchOrCreateUserColor = function(db, userid, twitterId, callback) {
  return db.collection('user_colors', function(err, userColors) {
    if (err) {
      logError(err);
      return callback(err, null);
    } else {
      return userColors.findAndModify({
        'userid': "" + userid,
        'twitterId': "" + twitterId
      }, [['_id', 'asc']], {
        $setOnInsert: {
          'userid': "" + userid,
          'twitterId': "" + twitterId
        }
      }, {
        "new": true,
        upsert: true
      }, function(err, userColor) {
        if (err) {
          logError(err);
          return callback(err, null);
        } else {
          return callback(null, userColor);
        }
      });
    }
  });
};

exports.config = {
  consumerKey: 'B2xbPGrR4Hpt4dgKeQE9g',
  consumerSecret: '8l1268xONGV2cm4dOwBmaTnRwHbCzjRueekk3FqsY'
};

var logError, mongoConnect;

logError = function(err) {
  return console.log("ERROR: " + (JSON.stringify(err, null, 2)));
};

mongoConnect = function(callback) {
  var Connection, Db, Server, db, host, port, serverOptions;
  console.log("db connected");
  Db = require('mongodb').Db;
  Connection = require('mongodb').Connection;
  Server = require('mongodb').Server;
  host = process.env['MONGO_NODE_DRIVER_HOST'] ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
  port = process.env['MONGO_NODE_DRIVER_PORT'] ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
  serverOptions = {
    'safe': true,
    'journal': true,
    'auto_reconnect': true,
    'poolSize': 15
  };
  db = new Db('canned', new Server(host, port), serverOptions);
  return db.open(callback);
};

exports.routes = {
  index: function(req, res) {
    var twitterId, userid;
    userid = fetchOrCreateUserid(req, res);
    twitterId = req.query.user;
    if (!twitterId) {
      return res.redirect(301, '/login');
    } else {
      return mongoConnect(function(err, db) {
        if (err) {
          return logError(err);
        } else {
          console.log("twitterId: " + twitterId);
          return fetchOrCreateUserColor(db, userid, twitterId, function(err, userColor) {
            if (err) {
              return logError(err);
            } else {
              return res.render('index', {
                title: 'Canned',
                color: userColor,
                userid: userid,
                twitterId: twitterId
              });
            }
          });
        }
      });
    }
  },
  reset: function(req, res) {
    return mongoConnect(function(err, db) {
      if (err) {
        return logError(err);
      } else {
        return removeAllChats(db, function(err, db) {
          if (err) {
            return logError(err);
          } else {
            return res.redirect(301, '/');
          }
        });
      }
    });
  }
};

mongoConnect(function(err, db) {
  return exports.sockets = {
    connected: function(socket) {
      console.log("connected");
      socket.on('login', function(userid, twitterId) {
        return fetchOrCreateUserColor(db, userid, twitterId, function(err, color) {
          if (err) {
            return logError(err);
          } else {
            return fetchChat(db, function(err, chat) {
              if (err) {
                return logError(err);
              } else {
                socket.emit("welcome", {
                  userid: userid,
                  twitterId: twitterId,
                  color: color,
                  chat: chat
                });
                return socket.broadcast.emit('joined', {
                  userid: userid,
                  twitterId: twitterId,
                  color: color
                });
              }
            });
          }
        });
      });
      socket.on('chat', function(data) {
        socket.broadcast.emit('chat', data);
        return addMessage(db, data.color, data.userid, data.twitterId, data.text, function(err, docs) {
          return console.log("wrote " + docs);
        });
      });
      return socket.on('typed', function(data) {
        return socket.broadcast.emit('typed', data);
      });
    }
  };
});

var TwitterAPI, TwitterLogin,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TwitterAPI = require('node-twitter-api');

exports.TwitterLogin = TwitterLogin = (function() {
  function TwitterLogin(consumerKey, consumerSecret) {
    this.receiveCredentials = __bind(this.receiveCredentials, this);
    this.receiveAccessToken = __bind(this.receiveAccessToken, this);
    this.receiveRequestToken = __bind(this.receiveRequestToken, this);
    this.credentials = {};
    this.api = new TwitterAPI({
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      callback: 'http://localhost:3000/oauth-callback'
    });
  }

  TwitterLogin.prototype.loginAction = function(req, res) {
    return this.api.getRequestToken((function(_this) {
      return function() {
        var url;
        url = _this.receiveRequestToken.apply(_this, arguments);
        if (url) {
          return res.redirect(301, url);
        }
      };
    })(this));
  };

  TwitterLogin.prototype.callbackAction = function(req, res) {
    return this.api.getAccessToken(this.credentials.request.token, this.credentials.request.tokenSecret, req.query.oauth_verifier, (function(_this) {
      return function() {
        _this.receiveAccessToken.apply(_this, arguments);
        return _this.api.verifyCredentials(_this.credentials.access.token, _this.credentials.access.tokenSecret, function() {
          var data;
          data = _this.receiveCredentials.apply(_this, arguments);
          return res.redirect(301, '/?user=' + data['screen_name']);
        });
      };
    })(this));
  };

  TwitterLogin.prototype.receiveRequestToken = function(error, requestToken, requestTokenSecret, results) {
    if (error) {
      return console.log("Error getting OAuth request token : " + error);
    } else {
      this.credentials.request = {
        token: requestToken,
        tokenSecret: requestTokenSecret
      };
      return 'https://api.twitter.com/oauth/authenticate?oauth_token=' + this.credentials.request.token;
    }
  };

  TwitterLogin.prototype.receiveAccessToken = function(error, accessToken, accessTokenSecret, results) {
    if (error) {
      return console.log(error);
    } else {
      return this.credentials.access = {
        token: accessToken,
        tokenSecret: accessTokenSecret
      };
    }
  };

  TwitterLogin.prototype.receiveCredentials = function(error, data, response) {
    if (error) {
      return console.log("something was wrong with either accessToken or accessTokenSecret");
    } else {
      console.log(data["screen_name"]);
      this.credentials.data = data;
      return data;
    }
  };

  return TwitterLogin;

})();

var fetchOrCreateUserid;

fetchOrCreateUserid = function(req, res) {
  var userid;
  userid = req.cookies['userid'];
  if (!userid) {
    userid = Date.now() * 100 + Math.floor(Math.random() * 100);
    res.cookie('userid', userid, {
      maxAge: 1000 * 60 * 60 * 24 * 120
    });
  }
  return userid;
};
