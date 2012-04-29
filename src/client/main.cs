Canned = ->
  userid = $('#userid').text()
  $compose = $('#compose')
  $composeText = $('#compose-text')
  $composeSubmit = $('#compose-submit')
  $composeOthers = $('#compose-others')

  $composeSubmit.click( =>
    if !_.isEmpty( $composeText.attr( 'value' ) )
      this.canned.addChat( this.canned.color, userid, $composeText.attr('value') )
      socket.emit('chat', {
        color: this.canned.color
        userid: userid
        text: $composeText.attr('value')
      });
      $composeText.attr( 'value', '' )
      socket.emit('typed', {
        userid: userid
        color: this.canned.color
        text: ''
      })
  )

  $composeText.keyup( ( e )=>
    if e.keyCode == 13
      $composeSubmit.click()
    else
      socket.emit('typed', {
        color: this.canned.color
        userid: userid
        text: $composeText.attr( 'value' )
      })
  )

  # init scroll panes
  $('.scroll-pane').jScrollPane()

  socket = io.connect('http://localhost:3000')
  socket.emit( 'set userid', userid ) 
  socket.on('welcome', ( data )=>
    this.canned.color = data.color
    $compose.addClass( data.color )
    for message in data.chat
      this.canned.addChat( message.color, message.userid, message.text )
  )  
  socket.on('joined', ( data )=>
    this.canned.addChat( 'white', data.userid, "<i>#{data.color} joined</i>" )
    $el = $composeOthers.append($("<div>").attr( 'id', data.userid ).addClass( data.color ).text( "" ))
  )
  socket.on('chat', ( data )=>
    this.canned.addChat( data.color, data.userid, data.text )
  )
  socket.on('typed', ( data )->
    other = $("##{data.userid}")
    if other.length == 0
      $composeOthers.append($("<div>").attr( 'id', data.userid ).addClass( data.color ).text( data.text ))
    else
      if _.isEmpty( data.text )
        other.text( "" )
      else
        other.text( "> #{data.text}.." )
  )

  return {
    color: null

    addChat: ( color, userid, text )=>
      m = $("#chat")
      api = m.jScrollPane().data('jsp')
      $el = api.getContentPane().append( "<div class='message #{color}'>#{text}</div>" )
      api.reinitialise()
      api.scrollToElement( $el, false, false )
  }

$( -> window.canned = Canned() )


