exports.routes = {

  index: (req, res)->
    userid = fetchOrCreateUserid( req, res )
    twitterId = req.query.user
    if !twitterId
      res.redirect(301, '/login')
    else
      mongoConnect((err, db)->
        if err
          logError(err)
        else
          console.log("twitterId: #{twitterId}")
          fetchOrCreateUserColor(db, userid, twitterId, (err, userColor)->
            if err
              logError(err)
              # TODO respond with error indication 
            else
              res.render 'index', {
                title: 'Canned'
                color: userColor
                userid: userid
                twitterId: twitterId
              }
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

