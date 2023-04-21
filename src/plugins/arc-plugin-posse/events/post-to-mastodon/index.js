const arc = require('@architect/functions')
const { login } = require('masto')

const handler = arc.events.subscribe(async (event) => {
  const { item } = event
  const { title, description, link } = item

  const toot = `${title[0]}

${description[0]}

${link}`

  // console.log(toot)

  const masto = await login({
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
