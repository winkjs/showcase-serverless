const https = require('https');
const fetch = require('node-fetch');

const date = new RegExp(/[12][0-9]{3}/g);

module.exports = (req, res) => {
  var title = req.query.title;

  fetch('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles='+ title +'&explaintext=1&formatversion=2&format=json')
      .then(res => res.json())
      .then(json => json.query.pages[0].extract)
      .then(text => {
        var sentences = text.replace( /\n/g, "." ).split('.');
        sentences = sentences.map((s) => s.trim());
        sentences = sentences.filter((s) => s.match(date) !== null );

        var timeline = {};
        sentences.forEach((s) => {
          var dates = s.match(date);
          dates.forEach((d) => {
            timeline[d] = s
          });
        });

        res.json({
          title: req.query.title,
          timeline: timeline
        })
      })
}
