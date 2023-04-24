const arc = require('@architect/functions')
const https = require('https')
const TurndownService = require('turndown')
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const handler = arc.events.subscribe(async (event) => {
  const { item } = event
  const { title, description, link, category, enclosure = [] } = item
  const main_image = enclosure.find(item => item['$'].type.startsWith('image'))['$'].url

  const { origin } = new URL(process.env.RSS_URL)

  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
  })
  turndownService.addRule('image', {
    filter: 'img',
    replacement: function (content, node) {
      let alt = cleanAttribute(node.getAttribute('alt'))
      let src = node.getAttribute('src') || ''
      let title = cleanAttribute(node.getAttribute('title'))
      let titlePart = title ? ' "' + title + '"' : ''
      return src ? '![' + alt + ']' + '(' + origin + src + titlePart + ')' : ''
    }
  })

  const markdown = turndownService.turndown(item['content:encoded'][0])

  const postData = JSON.stringify({
    article: {
      title: title[0],
      description: description[0],
      canonical_url: link[0],
      published: false,
      body_markdown: markdown,
      tags: category,
      main_image
    },
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.DEV_TO_API_KEY,
      'User-Agent': 'arc-plugin-posse'
    },
  }

  const result = await postToDevTo(options, postData)

  // Need to deal with 429 issues from dev.to.
  //
  let retryCount = 0
  let { retryAfter, statusCode } = result
  while (statusCode === 429 && retryCount < 2) {
    retryCount++
    await sleep((retryAfter * 1000) + (retryCount * 200))
    const retryResult = await postToDevTo(options, postData)
    statusCode = retryResult.statusCode
    retryAfter = retryResult.retry
    if (statusCode === 429 && retryCount >= 2) {
      console.log(`Giving up after 3 tries. Manually add ${link[0]} to dev.to.`)
    }
  }

  return
})

function postToDevTo (options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request('https://dev.to/api/articles', options, async (res) => {
      let responseBody = ''
      res.on('data', (chunk) => {
        responseBody += chunk
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: responseBody,
          retry: res.headers['retry-after'] || 0
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

function cleanAttribute (attribute) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}

module.exports = { handler }
