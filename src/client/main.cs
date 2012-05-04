class CannedApp

  constructor: ( userid )->
    @userid = userid
    @color = null
    this.initSocket()
    this.login( @userid )

  setListener: ( listener )->
    @listener = listener

  chat: ( text ) ->
    @socket.emit( 'chat', {
      color: @color
      userid: @userid
      text: text
    })
    @listener.addMessage( @userid, @color, text )

  typed: ( text )->
    @socket.emit( 'typed', {
      color: @color
      userid: @userid
      text: text
    })

  login: ( userid )->
    @socket.emit( 'login', userid )

  initSocket: ->
    @socket = io.connect('http://localhost:3000')
    @socket.on 'welcome', ( data )=>
      @color = data.color
      @listener.showColor( @color )
      for message in data.chat
        @listener.addMessage( message.userid, message.color, message.text )
    @socket.on 'joined', ( data )=>
      @listener.showJoined( data.userid, data.color )
    @socket.on 'chat', ( data )=>
      @listener.addMessage( data.userid, data.color, data.text )
    @socket.on 'typed', ( data )=>
      @listener.showTyping( data.userid, data.color, data.text )

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
 
    @$composeSubmit.click( =>
      if !_.isEmpty( @$composeText.attr( 'value' ) )
        text = @$composeText.attr('value')
        @app.chat( text )
        @$composeText.attr( 'value', '' )
        @app.typed( '' )
    )

    @$composeText.keyup( ( e )=>
      if e.keyCode == 13
        @$composeSubmit.click()
      else
        @app.typed( @$composeText.attr( 'value' ) )
    )

  showColor: ( color )->
    @$compose.addClass( color )

  addMessage: ( userid, color, text )->
    m = $("#chat")
    api = m.jScrollPane().data('jsp')
    $el = $("<div class='message #{color}'>#{text}</div>")
    api.getContentPane().append( $el )
    api.reinitialise()
    api.scrollToElement( $el, false, true )

  showJoined: ( userid, color )->
    this.addMessage( userid, 'white', "<i>#{color} joined</i>" )
    @$composeOthers.append($("<div>").attr( 'id', userid ).addClass( color ).text( "" ))

  showTyping: ( userid, color, text )->
      other = $("##{userid}")
      if other.length == 0
        @$composeOthers.append($("<div>").attr( 'id', userid ).addClass( color ).text( text ))
      else
        if _.isEmpty( text )
          other.text( "" )
        else
          other.text( "> #{text}.." )


$( ->
   app = new CannedApp( $('#userid').text() )
   view = new CannedView( app )
)


