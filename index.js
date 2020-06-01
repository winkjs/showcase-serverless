// Server
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());
app.use(express.json());

app.get('/', function (req, res, next) {
  res.json({msg: 'Hello! See https://github.com/winkjs/showcase-serverless#serverless-demo for details.'})
})

const tagger = require('./pos-tagger');
app.post('/pos-tagger', tagger);

const sentiment = require('./twitter-sentiment');
app.get('/twitter-sentiment', sentiment);

const timeline = require('./wp-timeline');
app.get('/wp-timeline', timeline);
console.log(timeline);

app.listen(process.env.PORT);
