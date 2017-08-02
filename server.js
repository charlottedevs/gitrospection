const express = require('express'),
 config = require('./config'),
 path = require('path'),
 app = express();
 request = require('request');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/users/:userId/repos', (req, res) => {
  request({
    url: 'https://api.github.com/users/' + req.params.userId + '/repos?type=owner',
    headers: {
      'User-Agent': req.params.userId
    }
  })
  .on('error', function(err){
    console.log(err);
  })
  .pipe(res);
});

app.listen(config.port, config.host, () => console.log(`App running on localhost:${config.port}`));
