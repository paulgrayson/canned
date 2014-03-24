fetchOrCreateUserid = ( req, res )->
  userid = req.cookies['userid']
  if !userid
    userid = Date.now() * 100 + Math.floor( Math.random() * 100 )
    # 3 month cookie
    res.cookie( 'userid', userid, { maxAge: 1000 *60 *60 *24 *120 })
  return userid

fetchOrCreateUser = (db, userid, twitterId, callback)->
  db.collection 'users', (err, users)->
    if err
      logError(err)
      callback(err, null)
    else
      db.collection.findAndModify({
        query: {userid: userid},
        update: {
          $setOnInsert: {'userid': userid, 'twitterId': twitterId}
        },
        new: true,
        upsert: true
      }, (err, user)->
        if err
          logError(err)
          callback(err, null)
        else
          callback(null, user)
      )

