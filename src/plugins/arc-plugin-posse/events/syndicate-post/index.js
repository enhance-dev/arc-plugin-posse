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

  // user has setup Twitter syndication
  if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_TOKEN_SECRET ) {
    await arc.events.publish({
      name: 'post-to-twitter',
      payload: {
        item
      },
    })
  }

  // user has setup Dev.to syndication
  if (process.env.DEV_TO_API_KEY) {
    await arc.events.publish({
      name: 'post-to-devto',
      payload: {
        item
      },
    })
  }

  // user has setup Dev.to syndication
  if (process.env.BLUESKY_USERNAME && process.env.BLUESKY_PASSWORD) {
    await arc.events.publish({
      name: 'post-to-bluesky',
      payload: {
        item
      },
    })
  }

  return
})

module.exports = { handler }
