const arc = require('@architect/functions')
const https = require('https')
const TurndownService = require('turndown')

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

  const result = await new Promise((resolve, reject) => {
    const req = https.request('https://dev.to/api/articles', options, (res) => {
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
    req.write(postData)
    req.end()
  })

  console.log(result)
  return
})

function cleanAttribute (attribute) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}

module.exports = { handler }
