//include Express
const app = require('express')();
//include Mongodb
const url = 'mongodb://localhost:27017/twitter';
const db = require('monk')(url);
const collection = db.get('tweets');
//include Twitter API
const Twitter = require('twitter');
//create Twitter client object
var secret = require('./secret.json');
const client = new Twitter(secret);

app.get('/stream', function (req, res) {
  var stream = client.stream('statuses/filter', {track: 'ASM'});
  stream.on('data', function(event) {
    collection.insert(event);
    console.log('tweet added!');
    //console.log(event.text);
  });
});

app.get('/tweets', function (req, res) {
  collection.find({}).then((docs) => {
    res.json(docs);
  });
});

app.get('/get', function (req, res) {
  var params = {q: '#Macron', count: 100};
  client.get('search/tweets', params, function(error, tweets, response) {
  if (!error) {
    tweets.statuses.forEach(function(tweet) {
      collection.insert(tweet);
    })
   }
  });
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
