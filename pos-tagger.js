const tagger = require('wink-pos-tagger')();
const winkNLP = require('wink-nlp');
const its = require( 'wink-nlp/src/its.js' );
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);



module.exports = (req, res) => {
  var doc = nlp.readDoc(req.query.sentence);
  res.json({
    sentence: req.query.sentence,
    tags: doc.tokens().out(its.type)
  })
}
