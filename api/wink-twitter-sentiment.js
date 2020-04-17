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

module.exports = (req, res) => {
  var hashtag = '#' + req.query.hashtag;

  client.get('search/tweets', {q: hashtag}, function(error, tweets, response) {
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
     console.log(s);
  });
}
