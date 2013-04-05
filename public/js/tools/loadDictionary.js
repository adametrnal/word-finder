LoadDictionary = (function () {

	//Privates Vars
	var wordListURL = "./resources/it.txt",
		_lang = "it";

	//Private Methods
    var init = function() {
    	jQuery.when(getData(wordListURL))
	  	   	  .then(processDict);
    }

    var getData = function(url) {
		return jQuery.ajax(url, {
		    dataType: 'text',
		    type: 'GET'
		});
	};

	/**
	* Process a text file containing a list of words and add it to the DB
	* Proccesing involves sorting the letters in each word, adding to a hash, then appending all words
	* that hash to the same sorted object
	*
	* An example entry in the hash looks like:  "act" : { "w" : [ "cat", "Cat", "act" ] } 
	*
	* @param dictText {string} contents of dictionary file containing a list of words
	**/
	var processDict = function(dictText) {
		var dictionaryMap = {};

		var dictionaryArr = dictText.split('\n');
		for (var i = dictionaryArr.length - 2; i >= 0; i--) {
			var currWord = dictionaryArr[i];
			var wordArr = currWord.toLowerCase().split('').sort();
			var sortedWord = wordArr.join('');
			
			if(dictionaryMap[sortedWord] !== undefined) {
				dictionaryMap[sortedWord].w.push(currWord);
			}
			else {	
				dictionaryMap[sortedWord] = { w : [currWord] };
			}
		}

		jQuery.post("/api/1.0/add_dictionary", { "lang" : _lang, dict : dictionaryMap })
		.done(function(data) {
			console.log("Data Loaded");
		});

	};


	/**
	* Returns a list of words in a language that can be formed from the letters in a string
	* Not actually used in this app but included for reference for the API
	* 
	* @param langString {string} code representing language to search. For example: "en-us"
	* @param compareString {string} string containing letters from which to search for words
	*
	* @return {array} contains words that were found
	*/
	var findWords = function(langString, compareString) {
		console.log("finding words in string: " + _compareString + ", with " + langString);
		jQuery.get("/api/1.0/find_words", { "lang" : langString, "letterString" : _compareString})
		.done(function(data) {
			if(data !== undefined) {
				console.log("Words retrieved!");
				return data;
			}
			else {
				console.log("error finding words");
				return [];
			}
		})
	}


	//Return Pubic API
	return {
		init : init
	};

}());

jQuery(document).ready(function() {
	LoadDictionary.init();
});