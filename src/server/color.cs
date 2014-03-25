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
      userColors.findAndModify(
        {'userid': ""+ userid, 'twitterId': ""+ twitterId},
        [['_id', 'asc']],
        {$setOnInsert: {'userid': ""+userid, 'twitterId': ""+twitterId}},
        {
          new: true,
          upsert: true
        }
      , (err, userColor)->
        if err
          logError(err)
          callback(err, null)
        else
          callback(null, userColor)
      )



