$(function() {
  var app, view;
  app = new CannedApp($('#userid').text());
  return view = new CannedView(app);
});

var CannedApp;

CannedApp = (function() {
  function CannedApp(userid) {
    this.userid = userid;
    this.color = null;
    this.initSocket();
    this.login(this.userid);
  }

  CannedApp.prototype.setListener = function(listener) {
    return this.listener = listener;
  };

  CannedApp.prototype.chat = function(text) {
    this.listener.addMessage(this.userid, this.color, text);
    return this.socket.emit('chat', {
      color: this.color,
      userid: this.userid,
      text: text
    });
  };

  CannedApp.prototype.typed = function(text) {
    return this.socket.emit('typed', {
      color: this.color,
      userid: this.userid,
      text: text
    });
  };

  CannedApp.prototype.login = function(userid) {
    return this.socket.emit('login', userid);
  };

  CannedApp.prototype.initSocket = function() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on('welcome', (function(_this) {
      return function(data) {
        var message, _i, _len, _ref, _results;
        _this.color = data.color;
        _this.listener.showColor(_this.color);
        _ref = data.chat;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          message = _ref[_i];
          _results.push(_this.listener.addMessage(message.userid, message.color, message.text));
        }
        return _results;
      };
    })(this));
    this.socket.on('joined', (function(_this) {
      return function(data) {
        return _this.listener.showJoined(data.userid, data.color);
      };
    })(this));
    this.socket.on('chat', (function(_this) {
      return function(data) {
        return _this.listener.addMessage(data.userid, data.color, data.text);
      };
    })(this));
    return this.socket.on('typed', (function(_this) {
      return function(data) {
        if (data.userid !== _this.userid) {
          return _this.listener.showTyping(data.userid, data.color, data.text);
        }
      };
    })(this));
  };

  CannedApp.prototype.benchmark = function() {
    var i, ms, start, stop, _i;
    start = new Date();
    for (i = _i = 1; _i <= 1000; i = ++_i) {
      this.socket.emit('chat', {
        color: this.color,
        userid: this.userid,
        text: "Hello " + i + " and goodbye!"
      });
    }
    stop = new Date();
    return ms = stop.getTime() - start.getTime();
  };

  return CannedApp;

})();

var CannedView;

CannedView = (function() {
  function CannedView(app) {
    this.app = app;
    this.app.setListener(this);
    this.$compose = $('#compose');
    this.$composeText = $('#compose-text');
    this.$composeSubmit = $('#compose-submit');
    this.$composeOthers = $('#compose-others');
    $('.scroll-pane').jScrollPane();
    this.$composeSubmit.click((function(_this) {
      return function() {
        var text;
        if (!_.isEmpty(_this.$composeText.attr('value'))) {
          text = _this.$composeText.attr('value');
          _this.app.chat(text);
          _this.$composeText.attr('value', '');
          return _this.app.typed('');
        }
      };
    })(this));
    this.$composeText.keyup((function(_this) {
      return function(e) {
        if (e.keyCode === 13) {
          return _this.$composeSubmit.click();
        } else {
          return _this.app.typed(_this.$composeText.attr('value'));
        }
      };
    })(this));
    $('#benchmark-submit').click((function(_this) {
      return function() {
        var time;
        alert("starting benchmark");
        time = _this.app.benchmark();
        return alert("Took " + time + "ms");
      };
    })(this));
  }

  CannedView.prototype.showColor = function(color) {
    return this.$compose.addClass(color);
  };

  CannedView.prototype.addMessage = function(userid, color, text) {
    var $el, api, m;
    m = $("#chat");
    api = m.jScrollPane().data('jsp');
    $el = $("<div class='message'>" + userid + ": <span class='" + color + "'>" + text + "</span></div>");
    api.getContentPane().append($el);
    api.reinitialise();
    return api.scrollToElement($el, false, true);
  };

  CannedView.prototype.showJoined = function(userid, color) {
    return this.addMessage(userid, 'white', "<i>" + color + " joined</i>");
  };

  CannedView.prototype.showTyping = function(userid, color, text) {
    var other;
    other = $("#" + userid);
    if (other.length === 0) {
      return this.$composeOthers.append($("<div>").attr('id', userid).addClass(color).text(text));
    } else {
      if (_.isEmpty(text)) {
        other.text("");
        return other.hide();
      } else {
        other.text("> " + text + "..");
        return other.show();
      }
    }
  };

  return CannedView;

})();
