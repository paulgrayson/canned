exports.sockets = {
  connected: ( socket )->
    mongoConnect ( err, db )->
      socket.on('set userid', ( userid )->

        fetchOrCreateUserColor db, userid, ( err, color )->
          if err
            logError( err )
          else
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


