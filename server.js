const express = require('express'),
 config = require('./config'),
 path = require('path'),
 app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(config.port, config.host, () => console.log(`App running on localhost:${config.port}`));
