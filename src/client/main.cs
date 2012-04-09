Canned = ->
  $composeText = $('#compose-text')
  $composeSubmit = $('#compose-submit')

  $composeSubmit.click( =>
    if !_.isEmpty( $composeText.attr( 'value' ) )
      this.canned.addChat( 'red', $composeText.attr('value') )
      $composeText.attr( 'value', '' )
  )

  # init scroll panes
  $('.scroll-pane').jScrollPane()

  return {
    addChat: (color, text)->
      m = $("#chat")
      api = m.jScrollPane().data('jsp')
      api.getContentPane().append( "<div class='message #{color}'>#{text}</div>" )
      api.reinitialise()
  }

$( -> window.canned = Canned() )


