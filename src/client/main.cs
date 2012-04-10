Canned = ->
  $compose = $('#compose')
  $composeText = $('#compose-text')
  $composeSubmit = $('#compose-submit')
  $composeOthers = $('#compose-others')

  $composeSubmit.click( =>
    if !_.isEmpty( $composeText.attr( 'value' ) )
      this.canned.addChat( this.canned.color, $composeText.attr('value') )
      socket.emit('chat', {
        color: this.canned.color,
        text: $composeText.attr('value')
      });
      $composeText.attr( 'value', '' )
      socket.emit('typed', {
        color: this.canned.color,
        text: ''
      })
  )

  $composeText.keyup( =>
    socket.emit('typed', {
      color: this.canned.color,
      text: $composeText.attr( 'value' )
    })
  )

  # init scroll panes
  $('.scroll-pane').jScrollPane()

  socket = io.connect('http://localhost:3000');
  socket.on('welcome', ( data )=>
    this.canned.color = data.color
    $compose.addClass( data.color )
  )  
  socket.on('joined', ( data )=>
    this.canned.addChat( this.canned.color, "#{data.color} joined" )
    $composeOthers.append($("<div>").addClass( data.color ).text( "" ))
  )
  socket.on('chat', ( data )=>
    this.canned.addChat( data.color, data.text )
  )
  socket.on('typed', ( data )->
    other = $composeOthers.find(".#{data.color}")
    if other.length == 0
      $composeOthers.append($("<div>").addClass( data.color ).text( data.text ))
    else
      $composeOthers.find(".#{data.color}").text( data.text );
  )

  return {
    color: null

    addChat: (color, text)=>
      m = $("#chat")
      api = m.jScrollPane().data('jsp')
      api.getContentPane().append( "<div class='message #{color}'>#{text}</div>" )
      api.reinitialise()
  }

$( -> window.canned = Canned() )


