const Twitter = require('twitter');
const winkNLP = require('wink-nlp');
const its = require( 'wink-nlp/src/its.js' );
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);
require('dotenv').config()

// Config (from .env file)
// For consumer_key and consumer_secret see https://developer.twitter.com/en/apps
// For bearer_token see https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/bearer-tokens
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});

module.exports = (req, res) => {
  var hashtag = '#' + req.query.hashtag;

  client.get(
    'search/tweets',
    {q: hashtag, include_entities: false, lang: 'en'},
    function(error, tweets, response) {
      var s = tweets.statuses.map((tweet) => {
        var tweetSentiment = nlp.readDoc(tweet.text).out(its.sentiment);

        return {
          tweet: tweet.text,
          user: tweet.user.name,
          avatar: tweet.user.profile_image_url,
          sentiment: tweetSentiment,
        }
      });

      res.json({
        hashtag: hashtag,
        tweets: s
      })
    }
  );
}
