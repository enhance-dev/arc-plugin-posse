const arc = require('@architect/functions')

const handler = arc.events.subscribe(async (event) => {
  const { item } = event

  // user has setup Mastodon syndication
  if (process.env.MASTODON_TOKEN && process.env.MASTODON_URL) {
    await arc.events.publish({
      name: 'post-to-mastodon',
      payload: {
        item
      },
    })
  }

  return
})

module.exports = { handler }
