(function() {
  var Canned;

  Canned = function() {
    var $compose, $composeOthers, $composeSubmit, $composeText, socket, userid,
      _this = this;
    userid = $('#userid').text();
    $compose = $('#compose');
    $composeText = $('#compose-text');
    $composeSubmit = $('#compose-submit');
    $composeOthers = $('#compose-others');
    $composeSubmit.click(function() {
      if (!_.isEmpty($composeText.attr('value'))) {
        _this.canned.addChat(_this.canned.color, userid, $composeText.attr('value'));
        socket.emit('chat', {
          userid: userid,
          text: $composeText.attr('value')
        });
        $composeText.attr('value', '');
        return socket.emit('typed', {
          userid: userid,
          color: _this.canned.color,
          text: ''
        });
      }
    });
    $composeText.keyup(function(e) {
      if (e.keyCode === 13) {
        return $composeSubmit.click();
      } else {
        return socket.emit('typed', {
          color: _this.canned.color,
          userid: userid,
          text: $composeText.attr('value')
        });
      }
    });
    $('.scroll-pane').jScrollPane();
    socket = io.connect('http://localhost:3000');
    socket.emit('set userid', userid);
    socket.on('welcome', function(data) {
      _this.canned.color = data.color;
      return $compose.addClass(data.color);
    });
    socket.on('joined', function(data) {
      _this.canned.addChat(_this.canned.color, data.userid, "" + data.color + " joined");
      return $composeOthers.append($("<div>").attr('id', data.userid).addClass(data.color).text(""));
    });
    socket.on('chat', function(data) {
      return _this.canned.addChat(data.color, data.userid, data.text);
    });
    socket.on('typed', function(data) {
      var other;
      other = $("#" + data.userid);
      if (other.length === 0) {
        return $composeOthers.append($("<div>").attr('id', data.userid).addClass(data.color).text(data.text));
      } else {
        return other.text(data.text);
      }
    });
    return {
      color: null,
      addChat: function(color, userid, text) {
        var api, m;
        m = $("#chat");
        api = m.jScrollPane().data('jsp');
        api.getContentPane().append("<div class='message " + color + "'>" + text + "</div>");
        return api.reinitialise();
      }
    };
  };

  $(function() {
    return window.canned = Canned();
  });

}).call(this);
