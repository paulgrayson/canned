fetchOrCreateUserid = ( req, res )->
  userid = req.cookies['userid']
  if !userid
    userid = Date.now() * 100 + Math.floor( Math.random() * 100 )
    # 3 month cookie
    res.cookie( 'userid', userid, { maxAge: 1000 *60 *60 *24 *120 })
  return userid

render = ( res, userid, userColor )->
  res.render 'index', {
    title: 'Canned'
    color: userColor
    userid: userid
  }

resetDb = (db, callback)->
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


exports.routes = {

  index: (req, res)->
    userid = fetchOrCreateUserid( req, res )
    mongoConnect((err, db)->
      if err
        logError(err)
      else
        fetchOrCreateUserColor(db, userid, (err, userColor)->
          if err
            logError(err)
            # TODO respond with error indication 
          else
            render(res, userid, userColor)
        )
    )

  reset: (req, res)->
    console.log('reset!!!')
    mongoConnect((err, db)->
      if err
        logError(err)
      else
        resetDb(db, (err, db)->
          if err
            logError(err)
          else
            res.redirect(301, '/')
        )
    )
}

