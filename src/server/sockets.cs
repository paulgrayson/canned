mongoConnect ( err, db )->

  exports.sockets = {
    connected: ( socket )->
      console.log( "connected" )

      socket.on 'login', ( userid, twitterId )->
        fetchOrCreateUserColor db, userid, twitterId, ( err, color )->
          if err
            logError( err )
          else
            fetchChat db, ( err, chat )->
              if err
                logError( err )
              else
                socket.emit("welcome", {
                  userid: userid,
                  twitterId: twitterId,
                  color: color,
                  chat: chat
                })
                socket.broadcast.emit('joined', {userid: userid, twitterId: twitterId, color: color})

      socket.on 'chat', ( data )->
        socket.broadcast.emit('chat', data)
        addMessage db, data.color, data.userid, data.twitterId, data.text, ( err, docs )->
          console.log( "wrote #{docs}" )
      
      socket.on 'typed', ( data )->
        socket.broadcast.emit('typed', data)
  }


