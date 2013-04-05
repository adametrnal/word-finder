var express = require('express'),
    WordProcessing = require('./word-processing.js').WordProcessing;
    DictionaryProvider = require('./Dictionary-mongodb.js').DictionaryProvider;

app = express();

//Serve static files
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

//Handle generic errors
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'There was a problem with the server please try again later.');
});

dictionaryProvider = new DictionaryProvider();
wordProcessing = new WordProcessing();

//API Calls

//Retrieve the collection named lang from the DB
var getDict = function(lang, callback) {
  dictionaryProvider.get_dictionary(lang, function(error, dict) {
        if (error) {
            console.log(error);
        }
        else {
            callback(null, dict);
        }
    });
}

/**
* GET request to search for a string in a given language
* @param lang language code to search.  Possible values are 'en_us', 'es', 'fr', 'it'. Defaults to 'en_us'.
* @param letterString the string to seatch for words.  Required.
**/
app.get('/api/1.0/find_words', function(req, res) {
  var lang = req.query.lang || 'en_us';
  var letterString = req.query.letterString;
  var dict = {};
  var outputArray = [];
  var compareLettersArr = wordProcessing.countLetters(letterString);

  getDict(lang, function(error, resp) {
      dict = wordProcessing.addWordLetterCounts(resp[0]);

      for(var sortedWord in dict){
        if(wordProcessing.containsStringLetters(compareLettersArr, dict[sortedWord].letterCounts)){
           var unscrambledWordArray = dict[sortedWord].w;
           for (var i = unscrambledWordArray.length - 1; i >= 0; i--) {
            outputArray.push(unscrambledWordArray[i]);
           };
        }
      }

      outputArray.sort();

      res.send(outputArray);
  });

});

/**
* GET request to retrieve a dictionary object
* @param lang language code to search.  Possible values are 'en_us', 'es', 'fr', 'it'. Defaults to 'en_us'.
**/
app.get('/api/1.0/get_dictionary', function(req, res){
  var lang = req.query.lang;
  if(lang !== undefined) {
    getDict(lang, function(error, resp) {
        res.send(resp[0]);
    });
  }
  else
  {
    res.send('error: get_dictionary requires language as in: api/1.0/get_dictionary?lang=en_us');
  }
});

/**
* POST to add a new dictionary to the DB
* @param lang language code.  This will be the name of the collection for the dictionary.
*   Possible values are 'en_us', 'es', 'fr', 'it'. Defaults to 'en_us'.
* @param dict dictionary HashMap.  
*   Example entry in the Hash is { 'act' : { 'w' : [ 'cat', 'Cat', 'act' ] } }
**/
app.post('/api/1.0/add_dictionary', function(req, res) {
	var resp = req.body;
  var lang = resp.lang;
  var dictObj = resp.dict;

  dictionaryProvider.add_dictionary(lang, dictObj, function(error, resp) {
      if (error) {
          console.log(error);
      }
      else {
          res.send(resp);
      }
  });

});

//Handle all erroneous requests with a minimal response for security reasons
app.get('*', function(req, res){
  res.send('Sorry this is not a valid API call.', 404);
});


//Set up port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

