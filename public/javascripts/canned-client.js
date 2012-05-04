// Generated by CoffeeScript 1.3.1
(function() {
  var CannedApp, CannedView;

  CannedApp = (function() {

    CannedApp.name = 'CannedApp';

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
      this.socket.emit('chat', {
        color: this.color,
        userid: this.userid,
        text: text
      });
      return this.listener.addMessage(this.userid, this.color, text);
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
      var _this = this;
      this.socket = io.connect('http://localhost:3000');
      this.socket.on('welcome', function(data) {
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
      });
      this.socket.on('joined', function(data) {
        return _this.listener.showJoined(data.userid, data.color);
      });
      this.socket.on('chat', function(data) {
        return _this.listener.addMessage(data.userid, data.color, data.text);
      });
      return this.socket.on('typed', function(data) {
        return _this.listener.showTyping(data.userid, data.color, data.text);
      });
    };

    return CannedApp;

  })();

  CannedView = (function() {

    CannedView.name = 'CannedView';

    function CannedView(app) {
      var _this = this;
      this.app = app;
      this.app.setListener(this);
      this.$compose = $('#compose');
      this.$composeText = $('#compose-text');
      this.$composeSubmit = $('#compose-submit');
      this.$composeOthers = $('#compose-others');
      $('.scroll-pane').jScrollPane();
      this.$composeSubmit.click(function() {
        var text;
        if (!_.isEmpty(_this.$composeText.attr('value'))) {
          text = _this.$composeText.attr('value');
          _this.app.chat(text);
          _this.$composeText.attr('value', '');
          return _this.app.typed('');
        }
      });
      this.$composeText.keyup(function(e) {
        if (e.keyCode === 13) {
          return _this.$composeSubmit.click();
        } else {
          return _this.app.typed(_this.$composeText.attr('value'));
        }
      });
    }

    CannedView.prototype.showColor = function(color) {
      return this.$compose.addClass(color);
    };

    CannedView.prototype.addMessage = function(userid, color, text) {
      var $el, api, m;
      m = $("#chat");
      api = m.jScrollPane().data('jsp');
      $el = $("<div class='message " + color + "'>" + text + "</div>");
      api.getContentPane().append($el);
      api.reinitialise();
      return api.scrollToElement($el, false, true);
    };

    CannedView.prototype.showJoined = function(userid, color) {
      this.addMessage(userid, 'white', "<i>" + color + " joined</i>");
      return this.$composeOthers.append($("<div>").attr('id', userid).addClass(color).text(""));
    };

    CannedView.prototype.showTyping = function(userid, color, text) {
      var other;
      other = $("#" + userid);
      if (other.length === 0) {
        return this.$composeOthers.append($("<div>").attr('id', userid).addClass(color).text(text));
      } else {
        if (_.isEmpty(text)) {
          return other.text("");
        } else {
          return other.text("> " + text + "..");
        }
      }
    };

    return CannedView;

  })();

  $(function() {
    var app, view;
    app = new CannedApp($('#userid').text());
    return view = new CannedView(app);
  });

}).call(this);
