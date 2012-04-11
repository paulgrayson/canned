exports.sockets = {
  connected: ( socket )->
    mongoConnect ( err, db )->
      socket.on 'set userid', ( userid )->

        fetchOrCreateUserColor db, userid, ( err, color )->
          if err
            logError( err )
          else
            console.log( "color "+ color )

            fetchChat db, ( err, chat )->
              if err
                logError( err )
              else
                console.log( chat )
                socket.emit("welcome", {
                  userid: userid
                  color: color,
                  chat: chat
                })
                socket.broadcast.emit('joined', {userid: userid, color: color})

            socket.on 'chat', ( data )->
              console.log(data)
              socket.broadcast.emit('chat', data)
              addMessage db, data.color, data.userid, data.text, ( err, docs )->
                console.log( "wrote #{docs}" )
            
            socket.on 'typed', ( data )->
              console.log( data )
              socket.broadcast.emit('typed', data)
}


