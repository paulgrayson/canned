_ = require('underscore')

colors = ['red', 'blue', 'yellow', 'black']
usedColors = {}
_.each(colors, (e)->
  console.log( e )
  usedColors[e] = null
)

assignUserColor = ->
  color = _.find( colors, ( color )->
    return usedColors[color] == null
  )
  usedColors[color] = true;
  return color

fetchOrCreateUserColor = ( db, userid, twitterId, callback )->
  db.collection 'user_colors', ( err, userColors )->
    if err
      logError( err )
      callback( err, null )
    else
      userColors.findOne {userid: userid}, ( err, userColor )->
        if err
          logError( err )
          callback( err, null )
        else
          console.log( userColor )
          if !userColor
            userColor = assignUserColor()
            userColors.insert { userid: userid, color: userColor, twitterId: twitterId }, ( err, docs )->
            if err
              logError( err )
            else
              callback( null, userColor.color )
          else
            callback( null, userColor.color )


