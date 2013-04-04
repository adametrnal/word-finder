WordFinder = (function () {

    //Private Vars
    var wordListURL = "./resources/en-us.txt";
    var compareString = "alsup";
    var outputArray = [];
    var _lang = "en-us";
    
    var outputNode = jQuery('#output');

    //Private Methods
    var init = function() {
	  	// jQuery.when(getData(wordListURL))
	  	//   	  .then(processDict);

	  	findWords(_lang, compareString);
	  		  
    };

	var getData = function(url) {
		return jQuery.ajax(url, {
		    dataType: 'text',
		    type: 'GET'
		});
	};

	//Processing Dictionary will take 
	var processDict = function(dictText) {
		var dictionaryMap = {};

		var dictionaryArr = dictText.split('\n');
		for (var i = dictionaryArr.length - 2; i >= 0; i--) {
			var currWord = dictionaryArr[i];
			var wordArr = currWord.toLowerCase().split('').sort();
			var sortedWord = wordArr.join('');
			
			if(dictionaryMap[sortedWord] !== undefined) {
				dictionaryMap[sortedWord].words.push(currWord);
			}
			else {	
				dictionaryMap[sortedWord] = { words : [currWord] };
			}
		}

		jQuery.post("/api/1.0/add_dictionary", { "lang" : _lang, dict : dictionaryMap })
		.done(function(data) {
			console.log("Data Loaded");
		});

	};

	var findWords = function(lang, compareString) {
		console.log("finding words in string: " + compareString + ", with " + lang);
		jQuery.get("/api/1.0/find_words", { "lang" : _lang, "letterString" : compareString})
		.done(function(data) {
			if(data !== undefined) {
				console.log("Words retrieved!");
				var count = 0;
				var outputString = "";
				for(var word in data){
					outputString += ", " + data[word];
					count++;	
				}
				outputNode.text(outputString);
			}
			else {
				console.log("error finding words");
			}
		})
	}
	

	//Return Pubic API
	return {
		init : init
	};

}());

jQuery(document).ready(function() {
	WordFinder.init();
});
