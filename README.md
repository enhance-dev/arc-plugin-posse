![enhance-type](https://user-images.githubusercontent.com/76308/223593101-1f65f07f-49c4-4a13-9203-4ab4ff72f097.svg)

# [@enhance/arc-plugin-posse](https://www.npmjs.com/package/@enhance/arc-plugin-posse)

![CI](https://github.com/enhance-dev/arc-plugin-posse/actions/workflows/ci.yml/badge.svg)
[![Published on npm](https://img.shields.io/npm/v/@enhance/arc-plugin-posse.svg?logo=npm)](https://www.npmjs.com/package/@enhance/arc-plugin-posse)


> Publish (on your) Own Site, Syndicate Elsewhere plugin for Enhance applications.

## Install

```bash
npm i @enhance/arc-plugin-posse
```

Add the following to your Architect project manifest (usually .arc):

```
@plugins
enhance/arc-plugin-posse

@posse
feed "https://url.to/rss"
```

## Project manifest settings

The following higher-level settings are available in your Architect project manifest with the `@posse` settings pragma:
- `feed` - the RSS feed to pull your posts from.
- `rate` - how frequently to poll the `feed` for new posts to syndicate. Default value is `1 day`. Accepts any valid [rate expression](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#RateExpressions).
- `since` - the day in which to start checking your `feed` for new posts. Defaults to today's date. Uses the data format `YYYY-MM-DD` which is the only correct date format.

Example:

```arc
@posse
feed "https://bookrecs.org/rss"
rate "1 day"
since "2023-04-02"
```

## Syndication Targets

- [Bluesky](#bluesky)
- [Dev.to](#dev.to)
- [Mastodon](#mastodon)
- [Twitter](#twitter)

### Bluesky

In order to enable Bluesky syndication the user will need to set two environment variables in their app, `BLUESKY_USERNAME` and `BLUESKY_PASSWORD`.

- `BLUESKY_USERNAME` - your Bluesky username without the leading `@` symbol.
- `BLUESKY_PASSWORD` - the password for your Bluesky account.

Once you set these two environment variables you will need to deploy your application again for them to be read properly.

Then when a new posts is detected it will be syndicated to Bluesky following the format:

```
Item Title

Item Description

Item Link
```

### Dev.to

In order to enable Dev.to syndication the user will need to set one environment variables in your app, `DEV_TO_API_KEY`.

- `DEV_TO_API_KEY` - visit https://dev.to/settings/extensions. In the "DEV API Keys" section create a new key by adding a description and clicking on "Generate API Key"

Once you set this environment variable you will need to deploy your application again for them to be read properly.

Then when a new posts is detected it will be syndicated to Dev.to. The plugin will convert your RSS feed item to Dev.to compatible markdown.

### Mastodon

In order to enable Mastodon syndication the user will need to set two environment variables in their app, `MASTODON_TOKEN` and `MASTODON_URL`.

- `MASTODON_TOKEN` - Go to your settings page, open Development, and click the New Application button to create your personal access token.
- `MASTODON_URL` - the url of your Mastodon server. For example: `https://fosstodon.org/`

Once you set these two environment variables you will need to deploy your application again for them to be read properly.

Then when a new posts is detected it will be syndicated to Mastodon following the format:

```
Item Title

Item Description

Item Link
```

### Twitter (Deprecated)

> Support for Twitter (X) is deprecated.

In order to enable Twitter syndication the user will need to set four environment variables in their app, `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN` and `TWITTER_ACCESS_TOKEN_SECRET`.

- `TWITTER_API_KEY` - This is the API Key under Consumer Keys in your app on developer.twitter.com.
- `TWITTER_API_SECRET` - This is the API Secret under Consumer Keys in your app on developer.twitter.com
- `TWITTER_ACCESS_TOKEN` - This is the Access Token under Authentication Tokens in your app on developer.twitter.com.
- `TWITTER_ACCESS_TOKEN_SECRET` - This is the Access Token under Authentication Tokens in your app on developer.twitter.com

to generate the `TWITTER_ACCESS_TOKEN` and `TWITTER_ACCESS_TOKEN_SECRET` you need to jump through a few hoops (as of this writing).

1. On the `Settings` tab of your app under `User authentication settings` click edit.
2. Set the `App Permissions` to `Read and write and Direct message`.
3. Set `Type of App` to `Web App, Automated App or Bot`.
4. Fill out the required fields under `App Info`.
5. Save
6. Under the `Keys and tokens` tab of your app click `Regenerate` next to `Access Token and Secret `.

Once you set these four environment variables you will need to deploy your application again for them to be read properly.

Then when a new posts is detected it will be syndicated to Twitter following the format:

```
Item Title

Item Description

Item Link
```




