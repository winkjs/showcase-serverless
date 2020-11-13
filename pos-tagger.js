const winkNLP = require('wink-nlp');
const its = require( 'wink-nlp/src/its.js' );
const as = require( 'wink-nlp/src/as.js' );
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);

module.exports = (req, res) => {
  var doc = nlp.readDoc(req.body.sentence);

  // Entities
  var entities = doc.entities().out(its.detail);

  // Counts
  var sentences = doc.sentences().length();
  var tokens = doc.tokens().length();
  var words = doc.tokens().filter( (token) => {
    return token.out(its.type) === 'word'
  } ).length();

  // Tagged text
  var seenEntities = new Set();
  doc.tokens().each( (token) => {
    var entity = token.parentEntity();
    if (entity === undefined) {
      if (token.out(its.type) === 'word') {
        token.markup('<span class=\"tag '+ token.out(its.pos) +'\">','</span>');
      }
    } else {
      if (!seenEntities.has(entity.index())) {
        entity.markup('<span class=\"tag '+ entity.out(its.type) +'\">', "</span>");
      }
      seenEntities.add(entity.index());
    }
  } )

  // Word frequency
  var wordFreq = doc.tokens().filter((token) => {
    return token.out(its.type) === 'word' && !token.out(its.stopWordFlag);
  }).out(its.normal, as.freqTable);
  wordFreq = wordFreq.sort(function (a, b) {
    return b[1] - a[1];
  })
  wordFreq = wordFreq.slice(0, 5)

  // Sentiment
  var sentiments = [];
  doc.sentences().each((s) => {
    sentiments.push({
      sentence: s.out(),
      sentiment: s.out(its.sentiment)
    })
  })

  res.json({
    sentence: req.query.sentence,
    entities,
    sentiments,
    documentInfo: {
      sentences,
      tokens,
      words
    },
    wordFreq,
    taggedText: doc.out(its.markedUpText).replace(/\n/g, '<br>').replace( ' ', '&nbsp;' )
  })
}
