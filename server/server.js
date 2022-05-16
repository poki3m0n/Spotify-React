const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const spotifyWebApi = require('spotify-web-api-node')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    // console.log('#######')
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'cc3a2766f2384b2aab308c3dcff62470',
        clientSecret:'1ee59d6d3e0141c68d22854199b4f8a8',
        refreshToken,
    })

    // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi
.refreshAccessToken()
.then(
    data => {
      res.json({
          accessToken: data.body.access_token,
          expiresIn: data.body.expires_in,
      })
  
      // Save the access token so that it's used in future calls
    }).catch(err => {
            // console.log(err)
            res.sendStatus(400)
        })
})

app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'cc3a2766f2384b2aab308c3dcff62470',
        clientSecret:'1ee59d6d3e0141c68d22854199b4f8a8',
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    }).catch(err => {
    //    console.log(err)
        res.sendStatus(400)
    })

})

app.listen(3001)