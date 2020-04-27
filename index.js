// Server
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/', function (req, res, next) {
  res.json({msg: 'Hello! See https://github.com/winkjs/showcase-serverless#serverless-demo for details.'})
})

// Tagger
const tagger = require('wink-pos-tagger')();

app.get('/pos-tagger', function (req, res) {
  res.json({
    sentence: req.query.sentence,
    tags: tagger.tagSentence(req.query.sentence)
  })
})

// Twitter sentiment
const Twitter = require('twitter');
const sentiment = require( 'wink-sentiment' );
require('dotenv').config()

// Config (from .env file)
// For consumer_key and consumer_secret see https://developer.twitter.com/en/apps
// For bearer_token see https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/bearer-tokens
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});

app.get('/twitter-sentiment', function (req, res) {
  var hashtag = '#' + req.query.hashtag;

  client.get(
    'search/tweets',
    {q: hashtag, include_entities: false, lang: 'en'},
    function(error, tweets, response) {
      var s = tweets.statuses.map((tweet) => {
        var tweetSentiment = sentiment(tweet.text);
        return {
          tweet: tweet.text,
          user: tweet.user.name,
          sentimentScore: tweetSentiment.score,
          normalizedSentimentScore: tweetSentiment.normalizedScore,
        }
      });
      res.json({
        hashtag: hashtag,
        tweets: s
      })
  });
});

app.listen(80);
