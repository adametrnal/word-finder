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

	//Return Pubic API
	return {
		init : init
	};

}());

jQuery(document).ready(function() {
	LoadDictionary.init();
});