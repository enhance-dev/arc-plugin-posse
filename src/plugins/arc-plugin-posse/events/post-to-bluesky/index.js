const arc = require('@architect/functions')
const https = require('https')

const BLUESKY_BASE_URL = 'https://bsky.social/xrpc'

async function authenticate () {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const postData = JSON.stringify({ 'identifier': process.env.BLUESKY_USERNAME, 'password': process.env.BLUESKY_PASSWORD })

  return new Promise((resolve, reject) => {
    const req = https.request(BLUESKY_BASE_URL + '/com.atproto.server.createSession', options, async (res) => {
      let responseBody = ''
      res.on('data', (chunk) => {
        responseBody += chunk
      })
      res.on('end', () => {
        console.log(responseBody)
        const response = JSON.parse(responseBody)
        resolve({
          jwt: response.accessJwt,
          did: response.did
        })
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.write(postData)
    req.end()
  })
}

async function sendSkeet (skeet, url, jwt, did) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    },
  }

  const iso_timestamp = (new Date()).toISOString()

  const postData = JSON.stringify({
    'repo': did,
    'collection': 'app.bsky.feed.post',
    'record': {
      '$type': 'app.bsky.feed.post',
      'text': skeet,
      'createdAt': iso_timestamp,
      'facets': [
        {
          'features': [
            {
              'uri': url,
              '$type': 'app.bsky.richtext.facet#link',
            }
          ],
          'index': {
            'byteStart': skeet.lastIndexOf('https://'),
            'byteEnd': skeet.length,
          },
        }
      ],
    },
  })

  return new Promise((resolve, reject) => {
    const req = https.request(BLUESKY_BASE_URL + '/com.atproto.repo.createRecord', options, async (res) => {
      let responseBody = ''
      res.on('data', (chunk) => {
        responseBody += chunk
      })
      res.on('end', () => {
        console.log(responseBody)
        const response = JSON.parse(responseBody)
        resolve(response)
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.write(postData)
    req.end()
  })
}

const handler = arc.events.subscribe(async (event) => {
  const { item } = event
  const { title, description, link } = item

  const descLen = 294 - title[0].length - link[0].length
  const desc = description[0].length >= descLen ? `${description[0].substring(0, descLen)}…` : description[0]

  const skeet = `${title[0]}

${desc}

${link[0]}`

  const { jwt, did } = await authenticate()
  const res = await sendSkeet(skeet, link[0], jwt, did)

  console.log(res)

  return
})

module.exports = { handler }
