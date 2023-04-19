module.exports = {
  set: {
    env ({ arc }) {
      let posse = arc['posse']
      if (posse) {
        let feedRow = posse.find(row => row[0] === 'feed')
        let feed = feedRow && feedRow[1]
        return {
          RSS_URL: feed
        }
      }
    },
    events () {
      let src = __dirname + '/events'
      return [
        {
          name: 'post-to-mastodon',
          src: `${src}/post-to-mastodon`,
        }
      ]
    },
    scheduled () {
      let src = __dirname + '/scheduled/check-rss-feed'
      return [
        {
          name: 'check-rss-feed',
          rate: '1 day',
          src,
        }
      ]
    }
  }
}
