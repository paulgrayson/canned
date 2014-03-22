TwitterAPI = require('node-twitter-api');

exports.TwitterLogin = class TwitterLogin

  constructor: (consumerKey, consumerSecret)->
    @credentials = {}
    @api = new TwitterAPI(consumerKey: consumerKey, consumerSecret: consumerSecret, callback: 'http://localhost:3000/oauth-callback')

  loginAction: (req, res)->
    @api.getRequestToken(=>
      url = @receiveRequestToken.apply(this, arguments)
      res.redirect(301, url) if url
    )
        
  callbackAction: (req, res)->
    @api.getAccessToken(@credentials.request.token,
                        @credentials.request.tokenSecret,
                        req.query.oauth_verifier,
                        =>
                          @receiveAccessToken.apply(this, arguments)
                          @api.verifyCredentials(@credentials.access.token, @credentials.access.tokenSecret, =>
                            data = @receiveCredentials.apply(this, arguments)
                            res.redirect(301, '/?user='+ data['screen_name'])
                          )
    )


  receiveRequestToken: (error, requestToken, requestTokenSecret, results)=>
    if error
      console.log("Error getting OAuth request token : " + error)
    else
      @credentials.request = {
        token: requestToken,
        tokenSecret: requestTokenSecret
      }
      return 'https://api.twitter.com/oauth/authenticate?oauth_token='+ @credentials.request.token

  receiveAccessToken: (error, accessToken, accessTokenSecret, results)=>
    if error
      console.log(error)
    else
      @credentials.access = {
        token: accessToken,
        tokenSecret: accessTokenSecret
      }

  receiveCredentials: (error, data, response)=>
    if error
      console.log("something was wrong with either accessToken or accessTokenSecret")
    else
      console.log(data["screen_name"])
      @credentials.data = data
      return data


    
