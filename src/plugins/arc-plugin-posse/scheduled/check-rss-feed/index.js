const http = require('http')
const https = require('https')
const { parseStringPromise } = require('xml2js')
const arc = require('@architect/functions')

async function handler () {
  const items = await getFeedItems()
  const posts = await getPosts()
  const sinceDate = process.env.SINCE ? new Date(process.env.SINCE) : new Date()

  // Find out what items are new
  const filteredItems = items.filter(item => sinceDate < new Date(item.pubDate[0])).filter(item => !posts.find(post => post?.link === item.link[0]))

  // Save new items to the database
  if (filteredItems.length > 0) {
    await updatePosts(filteredItems)
    // eslint-disable-next-line no-undef
    await Promise.all(filteredItems.map(async (item) => {
      await arc.events.publish({
        name: 'syndicate-post',
        payload: {
          item
        },
      })
    }))
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
    const req = client.request({ hostname: feed.host,
      port: feed.port,
      path: feed.pathname,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' } }, (res) => {
      console.log('statusCode:', res.statusCode)
      console.log('headers:', res.headers)
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
