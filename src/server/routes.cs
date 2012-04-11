# GET home page.
exports.routes = {
  index: ( req, res )->
    userid = req.cookies['userid']
    if !userid
      userid = Date.now() * 100 + Math.floor( Math.random() * 100 )
      # 3 month cookie
      res.cookie( 'userid', userid, { maxAge: 1000 *60 *60 *24 *120 });
    res.render('index', {
      title: 'Canned'
      color: 'red'
      userid: userid
    })
}

