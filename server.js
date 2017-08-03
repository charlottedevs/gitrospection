const express = require('express'),
 config = require('./config'),
 path = require('path'),
 app = express();
 request = require('request');
 Cache = require('streaming-cache');

localCache = new Cache({
 maxAge: 5000 // max age in ms of items stored in memcache
});

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/users/:userId/repos', (req, res) => {
  let cached = localCache.get('test');
  if (cached) {
    cached.pipe(res);
  } else {
    request({
      url: 'https://api.github.com/users/' + req.params.userId + '/repos?type=owner',
      headers: {
        'User-Agent': req.params.userId
      }
    })
    .on('error', function(err){
      console.log(err);
    })
    .pipe(localCache.set('test'))
    .pipe(res);
  }
});

app.listen(config.port, config.host, () => console.log(`App running on localhost:${config.port}`));
