const http = require('http')
const https = require('https')
const { parseStringPromise } = require('xml2js')

async function handler () {
  const feed = new URL(process.env.RSS_URL)
  const response = await getFeed(feed)
  const result = await parseStringPromise(response)
  const items = result?.rss?.channel[0]?.item || []
  console.log(items)
  return
}

function getFeed (feed) {
  const client = feed.protocol === 'http:' ? http : https
  return new Promise((resolve, reject) => {
    const req = client.request(feed, (res) => {
      let responseBody = ''
      res.on('data', (chunk) => {
        responseBody += chunk
      })
      res.on('end', () => {
        resolve(responseBody)
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.end()
  })
}

module.exports = { handler }
