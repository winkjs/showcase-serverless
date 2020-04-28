// Server
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/', function (req, res, next) {
  res.json({msg: 'Hello! See https://github.com/winkjs/showcase-serverless#serverless-demo for details.'})
})

const tagger = require('./pos-tagger');
app.get('/pos-tagger', tagger);

const sentiment = require('./twitter-sentiment');
app.get('/twitter-sentiment', sentiment);

app.listen(80);
