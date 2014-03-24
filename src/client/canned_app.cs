class CannedApp

  constructor: ( userid, twitterId )->
    @userid = userid
    @twitterId = twitterId
    @color = null
    this.initSocket()
    this.login(@userid, @twitterId)

  setListener: ( listener )->
    @listener = listener

  chat: ( text ) ->
    @listener.addMessage( @userid, @twitterId, @color, text )
    @socket.emit( 'chat', {
      color: @color
      userid: @userid
      twitterId: @twitterId
      text: text
    })

  typed: ( text )->
    @socket.emit( 'typed', {
      color: @color
      userid: @userid
      text: text
      twitterId: @twitterId
    })

  login: ( userid, twitterId )->
    @socket.emit( 'login', userid, twitterId )

  initSocket: ->
    # TODO DRY this
    @socket = io.connect('http://localhost:3000')
    @socket.on 'welcome', ( data )=>
      @color = data.color
      @listener.showColor( @color )
      for message in data.chat
        @listener.addMessage( message.userid, message.twitterId, message.color, message.text )
    @socket.on 'joined', ( data )=>
      @listener.showJoined( data.userid, data.twitterId, data.color )
    @socket.on 'chat', ( data )=>
      @listener.addMessage( data.userid, data.twitterId, data.color, data.text )
    @socket.on 'typed', ( data )=>
      if data.userid != @userid
        @listener.showTyping( data.userid, data.twitterId, data.color, data.text )

