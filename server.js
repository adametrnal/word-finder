var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/api/1.0/find_words', function(req, res){
  res.send('hello world');
});

//Handle all erroneous requests with a minimal response for security reasons
app.get('*', function(req, res){
  res.send('Sorry this is not a valid API call.', 404);
});

app.listen(3000);

