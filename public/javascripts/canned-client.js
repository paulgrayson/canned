(function() {
  var Canned;

  Canned = function() {
    var $compose, $composeOthers, $composeSubmit, $composeText, socket,
      _this = this;
    $compose = $('#compose');
    $composeText = $('#compose-text');
    $composeSubmit = $('#compose-submit');
    $composeOthers = $('#compose-others');
    $composeSubmit.click(function() {
      if (!_.isEmpty($composeText.attr('value'))) {
        _this.canned.addChat(_this.canned.color, $composeText.attr('value'));
        socket.emit('chat', {
          color: _this.canned.color,
          text: $composeText.attr('value')
        });
        $composeText.attr('value', '');
        return socket.emit('typed', {
          color: _this.canned.color,
          text: ''
        });
      }
    });
    $composeText.keyup(function() {
      return socket.emit('typed', {
        color: _this.canned.color,
        text: $composeText.attr('value')
      });
    });
    $('.scroll-pane').jScrollPane();
    socket = io.connect('http://localhost:3000');
    socket.on('welcome', function(data) {
      _this.canned.color = data.color;
      return $compose.addClass(data.color);
    });
    socket.on('joined', function(data) {
      _this.canned.addChat(_this.canned.color, "" + data.color + " joined");
      return $composeOthers.append($("<div>").addClass(data.color).text(""));
    });
    socket.on('chat', function(data) {
      return _this.canned.addChat(data.color, data.text);
    });
    socket.on('typed', function(data) {
      var other;
      other = $composeOthers.find("." + data.color);
      if (other.length === 0) {
        return $composeOthers.append($("<div>").addClass(data.color).text(data.text));
      } else {
        return $composeOthers.find("." + data.color).text(data.text);
      }
    });
    return {
      color: null,
      addChat: function(color, text) {
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
