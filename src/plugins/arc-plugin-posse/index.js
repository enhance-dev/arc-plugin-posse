module.exports = {
  set: {
    env ({ arc }) {
      let posse = arc['posse']
      if (posse) {
        let feedRow = posse.find(row => row[0] === 'feed')
        let feed = feedRow && feedRow[1]
        let sinceRow = posse.find(row => row[0] === 'since')
        let since = sinceRow && sinceRow[1]
        return {
          RSS_URL: feed,
          SINCE: since
        }
      }
    },
    events () {
      let src = __dirname + '/events'
      return [
        {
          name: 'post-to-mastodon',
          src: `${src}/post-to-mastodon`,
        },
        {
          name: 'syndicate-post',
          src: `${src}/syndicate-post`,
        }
      ]
    },
    scheduled ({ arc }) {
      let src = __dirname + '/scheduled/check-rss-feed'
      let rate = null
      let posse = arc['posse']
      if (posse) {
        let rateRow = posse.find(row => row[0] === 'rate')
        rate = (rateRow && rateRow[1]) || '1 day'
      }
      return [
        {
          name: 'check-rss-feed',
          rate,
          src,
        }
      ]
    },
    tables () {
      return {
        name: 'rssfeeditems',
        partitionKey: 'link',
        partitionKeyType: 'string',
      }
    }
  }
}
