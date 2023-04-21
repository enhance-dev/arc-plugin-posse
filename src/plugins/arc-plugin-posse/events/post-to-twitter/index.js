const arc = require('@architect/functions')
const { TwitterApi } = require('twitter-api-v2')

const handler = arc.events.subscribe(async (event) => {
  const { item } = event
  const { title, description, link } = item

  const descLen = 274 - title[0].length - link[0].length
  const desc = description[0].length >= descLen ? `${description[0].substring(0, descLen)}…` : description[0]

  const tweet = `${title[0]}

${desc}

${link[0]}`

  const client = new TwitterApi({
    appKey: process.env.V1_TWITTER_API_KEY,
    appSecret: process.env.V1_TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  })

  const createdTweet = await client.v1.tweet(tweet, {})
  console.log(createdTweet)

  return
})

module.exports = { handler }
