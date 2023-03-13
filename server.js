const express = require('express')
const app = express()
const port = 3333

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(
  {
    clientId: '779849225665-todbd5jpcjl216fpduvnbv84brrq0qtv.apps.googleusercontent.com',
    clientSecret: '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',
    redirectUri: 'http://localhost'
  }
)

// Call this function to validate OAuth2 authorization code sent from client-side
async function verifyToken(token) {
    client.setCredentials({ access_token: token })
    const userinfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    console.log(userinfo);
    return userinfo.data
  }

async function verifyCode(code) {
    let { tokens } = await client.getToken(code)
    client.setCredentials({ access_token: tokens.access_token })
    const userinfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
    return userinfo.data
  }


app.get('/', (req, res) => {
    const access_token = req.query.access_token
    verifyToken(access_token).then((userInfo) => {
        // use userInfo and do your server-side logics here
        res.json({
            data: userInfo
        })
      }).catch((error) => {
        // validation failed and userinfo was not obtained
        res.json({
            error: error
        })
      })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})