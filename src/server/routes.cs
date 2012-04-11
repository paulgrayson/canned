
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

# GET home page.
exports.routes = {
  index: ( req, res )->
    userid = fetchOrCreateUserid( req, res )
    mongoConnect ( err, db )->
      if err
        logError( err )
      else
        fetchOrCreateUserColor db, userid, ( err, userColor )->
          if err
            logError( err )
            # TODO respond with error indication 
          else
            render( res, userid, userColor )
}

