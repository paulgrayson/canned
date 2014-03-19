class CannedView
  constructor: ( app )->
    @app = app
    @app.setListener( this )
    @$compose = $('#compose')
    @$composeText = $('#compose-text')
    @$composeSubmit = $('#compose-submit')
    @$composeOthers = $('#compose-others')

    # init scroll panes
    $('.scroll-pane').jScrollPane()
 
    @$composeSubmit.click =>
      if !_.isEmpty( @$composeText.attr( 'value' ) )
        text = @$composeText.attr('value')
        @app.chat( text )
        @$composeText.attr( 'value', '' )
        @app.typed( '' )

    @$composeText.keyup ( e )=>
      if e.keyCode == 13
        @$composeSubmit.click()
      else
        @app.typed( @$composeText.attr( 'value' ) )

    $('#benchmark-submit').click =>
      alert( "starting benchmark" )
      time = @app.benchmark()
      alert( "Took #{time}ms" )

  showColor: ( color )->
    @$compose.addClass( color )

  addMessage: ( userid, color, text )->
    m = $("#chat")
    api = m.jScrollPane().data('jsp')
    $el = $("<div class='message'>#{userid}: <span class='#{color}'>#{text}</span></div>")
    api.getContentPane().append( $el )
    api.reinitialise()
    api.scrollToElement( $el, false, true )

  showJoined: ( userid, color )->
    this.addMessage( userid, 'white', "<i>#{color} joined</i>" )

  showTyping: ( userid, color, text )->
    other = $("##{userid}")
    if other.length == 0
      @$composeOthers.append($("<div>").attr( 'id', userid ).addClass( color ).text(text))
    else
      if _.isEmpty( text )
        other.text( "" )
        other.hide()
      else
        other.text( "> #{text}.." )
        other.show()


