render = ( res, userid, userColor )->
  res.render 'index', {
    title: 'Canned'
    color: userColor
    userid: userid
  }

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
    mongoConnect((err, db)->
      if err
        logError(err)
      else
        removeAllChats(db, (err, db)->
          if err
            logError(err)
          else
            res.redirect(301, '/')
        )
    )

}

