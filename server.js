var express = require('express'),
    DictionaryProvider = require('./Dictionary-mongodb.js').DictionaryProvider;

app = express();

//Serve static files
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

dictionaryProvider = new DictionaryProvider();


//Processing Functions
var addWordLetterCounts = function(dict) {
  
  for (var word in dict) {
    dict[word].letterCounts =  countLetters(word);   
  }

  return dict;
}

var countLetters = function(str) {
  var letterCounts = {};
  for (var i = str.length - 1; i >= 0; i--) {
    var currLetter = str[i];
    letterCounts[currLetter] = letterCounts[currLetter] !== undefined ? letterCounts[currLetter] +  1 : 1;
  }

  return letterCounts;
};

var containsStringLetters = function(compareArray, wordLetterCountArr){
  for(var letter in wordLetterCountArr) {
    if(compareArray[letter] === undefined || ( compareArray[letter] < wordLetterCountArr[letter])) {
      return false;
    }
  }
  return true;
};

//API Calls
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

app.get('/api/1.0/find_words', function(req, res) {
  var lang = req.query.lang;
  var letterString = req.query.letterString;
  var dict = {};
  var outputArray = [];
  var compareLettersArr = countLetters(letterString);

  getDict(lang, function(error, resp) {
      dict = addWordLetterCounts(resp[0].dict);

      //var mapCount = 0;
      for(var sortedWord in dict){
        if(containsStringLetters(compareLettersArr, dict[sortedWord].letterCounts)){
           var unscrambledWordArray = dict[sortedWord].words;
           for (var i = unscrambledWordArray.length - 1; i >= 0; i--) {
            outputArray.push(unscrambledWordArray[i]);
           };
        }
        //mapCount++;
      }

      res.send(outputArray);
  });

});

app.get('/api/1.0/get_dictionary', function(req, res){
  var lang = req.query.lang;
  if(lang !== undefined) {
    getDict(lang, function(error, resp) {
        res.send(resp[0].dict);
    });
  }
  else
  {
    res.send("error: get_dictionary requires language as in: api/1.0/get_dictionary?lang=en-us");
  }
});

app.post('/api/1.0/add_dictionary', function(req, res) {
	var dictObj = req.body;
  dictionaryProvider.add_dictionary(dictObj, function(error, resp) {
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
  console.log("Listening oan " + port);
});

