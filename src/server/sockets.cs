exports.sockets = {

  connected: ( socket )->
    console.log( "sockets connected" )

    socket.on 'login', ( userid, twitterId )->
      fetchOrCreateUserColor global.db, userid, twitterId, ( err, color )->
        if err
          logError( err )
        else
          fetchChat global.db, ( err, chat )->
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
      addMessage global.db, data.color, data.userid, data.twitterId, data.text, ( err, docs )->
        console.log( "wrote #{docs}" )
    
    socket.on 'typed', ( data )->
      socket.broadcast.emit('typed', data)
}


