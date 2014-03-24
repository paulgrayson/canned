# fetch up to 50 messages
fetchChat = ( db, callback )->
  db.collection 'chat', ( err, chat )->
    if err
      logError( err )
      callback( err, null )
    else
      chat.find( {}, { limit: 50 } ).toArray ( err, messages )->
        if err
          callback( err )
        else
          callback( err, messages )
          

addMessage = ( db, color, userid, twitterId, text, callback )->
  db.collection 'chat', ( err, chat )->
    if err
      logError( err )
      callback( err, null )
    else
      chat.insert({
        color: color
        userid: userid
        text: text
        twitterId: twitterId
      }, callback )


removeAllChats = (db, callback)->
  db.collection('chat', (err, chat)->
    if err
      logError(err)
    else
      chat.remove({}, {}, (err, numRemoved)->
        if !err
          console.log("Removed #{numRemoved} chats")
        callback(err, db)
      )
  )

