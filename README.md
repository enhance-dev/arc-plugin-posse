![enhance-type](https://user-images.githubusercontent.com/76308/223593101-1f65f07f-49c4-4a13-9203-4ab4ff72f097.svg)

# @enhance/arc-plugin-posse

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

- [Mastodon](#mastodon)

### Mastodon

In order to enable Mastodon syndication the user will need to set two environment variables in their app, `MASTODON_TOKEN` and `MASTODON_URL`.

- `MASTODON_TOKEN` - Go to your settings page, open Development, and click the New Application button to create your personal access token.
- `MASTODON_URL` - the url of your Mastodon server. For example: `https://fosstodon.org/`

Once you set this two environment variables you will need to deploy your application again for them to be read properly.

Then when a new posts is detected it will be syndicated to Mastodon following the format:

```
Item Title

Item Description

Item Link
```


