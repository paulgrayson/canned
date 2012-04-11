_ = require('underscore')

colors = ['red', 'blue', 'yellow', 'black']
usedColors = {}
_.each(colors, (e)->
  console.log( e )
  usedColors[e] = null
)

selectColor = ( userid )->
  color = _.find( colors, ( color )->
    return usedColors[color] == null
  )
  usedColors[color] = true;
  return color

exports.sockets = {
  connected: ( socket )->
    socket.on('set userid', ( userid )->

      color = selectColor( userid )
      console.log( "color "+ color )
      socket.emit("welcome", {userid: userid, color: color})

      socket.on('chat', ( data )->
        console.log(data)
        socket.broadcast.emit('chat', data)
      )
      
      socket.broadcast.emit('joined', {userid: userid, color: color})
      
      socket.on('typed', ( data )->
        console.log( data )
        socket.broadcast.emit('typed', data)
      )
    )
}


