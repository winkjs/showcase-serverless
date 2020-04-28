const tagger = require('wink-pos-tagger')();

module.exports = (req, res) => {
  res.json({
    sentence: req.query.sentence,
    tags: tagger.tagSentence(req.query.sentence)
  })
}
