_ = require('underscore')

colors = ['red', 'blue', 'yellow', 'black']
usedColors = {}
_.each(colors, (e)->
  console.log( e )
  usedColors[e] = null
)

exports.sockets = {
  connected: ( socket )->
    color = _.find( colors, ( color )->
      return usedColors[color] == null
    )
    usedColors[color] = true;
    console.log( "color "+ color )
    socket.emit("welcome", {color: color})
    socket.on('chat', ( data )->
      console.log(data)
      socket.broadcast.emit('chat', data)
    )
    socket.broadcast.emit('joined', {color: color})
    socket.on('typed', ( data )->
      console.log( data )
      socket.broadcast.emit('typed', data)
    )
}


