logError = ( err )->
  console.log( "Error: #{JSON.stringify( err, null, 2 )}" )

mongoConnect = ( callback )->
  Db = require('mongodb').Db
  Connection = require('mongodb').Connection
  Server = require('mongodb').Server

  host = if process.env['MONGO_NODE_DRIVER_HOST'] then process.env['MONGO_NODE_DRIVER_HOST'] else 'localhost'
  port = if process.env['MONGO_NODE_DRIVER_PORT'] then process.env['MONGO_NODE_DRIVER_PORT'] else Connection.DEFAULT_PORT
  console.log( host )
  console.log( port )

  db = new Db( 'canned', new Server( host, port, {} ), {} )

  db.open( callback )


