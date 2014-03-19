logError = ( err )->
  console.log( "error: #{JSON.stringify( err, null, 2 )}" )

mongoConnect = ( callback )->
  console.log( "db connected" )

  Db = require('mongodb').Db
  Connection = require('mongodb').Connection
  Server = require('mongodb').Server

  host = if process.env['MONGO_NODE_DRIVER_HOST'] then process.env['MONGO_NODE_DRIVER_HOST'] else 'localhost'
  port = if process.env['MONGO_NODE_DRIVER_PORT'] then process.env['MONGO_NODE_DRIVER_PORT'] else Connection.DEFAULT_PORT

  serverOptions = {
    'auto_reconnect': true,
    'poolSize': 15
  }

  db = new Db( 'canned', new Server( host, port, serverOptions ), {} )

  db.open( callback )


