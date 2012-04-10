# GET home page.
exports.routes = {
  index: ( req, res )->
    res.render('index', {
      title: 'Canned',
      color: 'red'
    })
}

