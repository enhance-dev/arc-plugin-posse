const arc = require('@architect/functions')
const { createRestAPIClient } = require('masto')

const handler = arc.events.subscribe(async (event) => {
  const { item } = event
  const { title, description, link } = item

  const descLen = 494 - title[0].length - link[0].length
  const desc = description[0].length >= descLen ? `${description[0].substring(0, descLen)}…` : description[0]

  const toot = `${title[0]}

${desc}

${link[0]}`

  const masto = createRestAPIClient({
    url: process.env.MASTODON_URL,
    accessToken: process.env.MASTODON_TOKEN,
  })

  const status = await masto.v1.statuses.create({
    status: toot,
    visibility: 'public',
  })

  console.log(status)

  return
})

module.exports = { handler }
