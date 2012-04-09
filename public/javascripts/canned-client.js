(function() {
  var Canned;

  Canned = function() {
    var $composeSubmit, $composeText,
      _this = this;
    $composeText = $('#compose-text');
    $composeSubmit = $('#compose-submit');
    $composeSubmit.click(function() {
      if (!_.isEmpty($composeText.attr('value'))) {
        _this.canned.addChat('red', $composeText.attr('value'));
        return $composeText.attr('value', '');
      }
    });
    $('.scroll-pane').jScrollPane();
    return {
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
