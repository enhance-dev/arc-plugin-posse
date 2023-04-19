const http = require('http')
const https = require('https')
const { parseStringPromise } = require('xml2js')
const arc = require('@architect/functions')

async function handler () {
  const items = await getFeedItems()
  const posts = await getPosts()

  // Find out what items are new
  const filteredItems = items.filter(item => !posts.find(post => post?.link === item.link[0]))

  // Save new items to the database
  if (filteredItems.length > 0) {
    await updatePosts(filteredItems)
  }

  return
}

async function getPosts () {
  const client = await arc.tables()
  const rssfeeditems = client.rssfeeditems
  const posts = await rssfeeditems.scan({})
  return posts.Items
}

async function updatePosts (items) {
  const client = await arc.tables()
  const rssfeeditems = client.rssfeeditems
  await Promise.all(items.map(async (item) => rssfeeditems.put({ link: item.link[0] })))
}

async function getFeedItems () {
  const feed = new URL(process.env.RSS_URL)
  const response = await getFeed(feed)
  const result = await parseStringPromise(response)
  const items = result?.rss?.channel[0]?.item || []
  return items
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
