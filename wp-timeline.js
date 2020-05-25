const https = require('https');
const fetch = require('node-fetch');

const winkNLP = require('wink-nlp');
const its = require( 'wink-nlp/src/its.js' );
const as = require( 'wink-nlp/src/as.js' );
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);

module.exports = (req, res) => {
  var title = req.query.title;
  fetch('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles='+ title +'&explaintext=1&formatversion=2&format=json')
      .then(res => res.json())
      .then(json => json.query.pages[0].extract)
      .then(text => {
        var doc = nlp.readDoc(text);
        var timeline = {};
        doc.entities().each((e) => {
          if (e.out(its.type) === 'DATE' ) {
            timeline[e.out()] = e.parentSentence().out();
          }
        })

        res.json({
          title: req.query.title,
          timeline: timeline
        })
      })
}
