class CannedApp

  constructor: ( userid )->
    @userid = userid
    @color = null
    this.initSocket()
    this.login( @userid )

  setListener: ( listener )->
    @listener = listener

  chat: ( text ) ->
    @listener.addMessage( @userid, @color, text )
    @socket.emit( 'chat', {
      color: @color
      userid: @userid
      text: text
    })

  typed: ( text )->
    @socket.emit( 'typed', {
      color: @color
      userid: @userid
      text: text
    })

  login: ( userid )->
    @socket.emit( 'login', userid )

  initSocket: ->
    # TODO DRY this
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
      if data.userid != @userid
        @listener.showTyping( data.userid, data.color, data.text )

  benchmark: ->
    start = new Date()
    for i in [1..1000]
      @socket.emit( 'chat', {
        color: @color
        userid: @userid
        text: "Hello #{i} and goodbye!"
      })
    stop = new Date()
    ms = stop.getTime() - start.getTime()


