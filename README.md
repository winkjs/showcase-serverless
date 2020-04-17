# Serverless demo

A demo of how to use wink with [Zeit's serverless functions](https://zeit.co/docs/v2/serverless-functions/introduction). Currently it has only one API endpoint `/api/wink-pos-tagger` that takes a `sentence` parameter. Some examples:

* [wink-pos-tagger](https://showcase-serverless.winkjs.now.sh/api/wink-pos-tagger?sentence=He%20is%20trying%20to%20fish%20for%20fish%20in%20the%20lake.)
* [wink-sentiment](https://showcase-serverless.now.sh/api/wink-twitter-sentiment?hashtag=gamedev)

To develop locally install [now](https://zeit.co/download) and run:
```
now dev
```

## Deploy your own

Deploy your own serverless [wink POS tagger](https://github.com/winkjs/wink-pos-tagger).

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/winkjs/showcase-serverless/tree/master)

_Live Example: https://showcase-serverless.winkjs.now.sh/api/wink-pos-tagger?sentence=This%20is%20a%20test_
