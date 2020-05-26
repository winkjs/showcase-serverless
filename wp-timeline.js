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
        var timeline = [];
        doc
          .entities()
          .filter((e) => {
            var shapes = e.tokens().out(its.shape);
            // We only want dates that can be converted to an actual
            // time using new Date()
            return (
              e.out(its.type) === 'DATE' &&
              (
                shapes[0] === 'dddd' ||
                ( shapes[0] === 'Xxxxx' && shapes[1] === 'dddd' ) ||
                ( shapes[0] === 'Xxxx' && shapes[1] === 'dddd' ) ||
                ( shapes[0] === 'dd' && shapes[1] === 'Xxxxx' && shapes[2] === 'dddd' ) ||
                ( shapes[0] === 'dd' && shapes[1] === 'Xxxx' && shapes[2] === 'dddd' ) ||
                ( shapes[0] === 'd' && shapes[1] === 'Xxxxx' && shapes[2] === 'dddd' ) ||
                ( shapes[0] === 'd' && shapes[1] === 'Xxxx' && shapes[2] === 'dddd' )
              )
            );
          })
          .each((e) => {
            e.markup();
            timeline.push({
              date: e.out(),
              unixTime: new Date(e.out()).getTime() / 1000,
              sentence: e.parentSentence().out(its.markedUpText)
            })
          });

        timeline.sort((a, b) => {
          return a.unixTime - b.unixTime;
        })

        res.json({
          title: req.query.title,
          timeline: timeline
        })
      })
}
