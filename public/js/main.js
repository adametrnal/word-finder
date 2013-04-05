WordFinder = (function () {

    //Private Vars
    var _compareString = '',
    	_outputArray = [],
    	_lang = '',
		_dictMap = {},
		_$textInput,    
    	_$outputNode,
    	_sortedAtoZ = true; 

    //Private Methods
    var init = function() {
    	//cache pointers to DOM controls
    	var $languageSelector = jQuery('#language_select'),
    		$resultFilter = jQuery('#resultFilter'),
    		$sortLink = jQuery('.sortLink');

    	_$outputNode = jQuery('#output');
    	_$textInput = jQuery('#letterString');

    	//get initial language
    	_lang = { 'text': jQuery('#language_select option:selected').text(), 
    		val: $languageSelector.val()};

		//clear out any text that may have been cached by browser
	  	_$textInput.val('');

	  	//search the string when there has been no input for 200ms
	  	_$textInput.keyup( function() {
		  		 delay( function(){
			  		_compareString = _$textInput.val();
			  		findWordsInString(_compareString, _dictMap);
					displayWords(_outputArray);
	  			}, 200);
	  	});

	  	//Update the Dictionary file
	  	$languageSelector.on('change', function(){
	  		getDict( {'text' : jQuery(this).find(':selected').text(), val: this.value} );
	  	});

	  	//Filter the output range
	  	$resultFilter.val($resultFilter.prop('max'));
	  	$resultFilter.on('change', function(){
	  		jQuery('.rangeCount').text($resultFilter.val() + ' letters');
	  		displayWords(_outputArray, parseInt(this.value, 10));
	  	});

	  	//Alphabetize the data
	  	$sortLink.on('click', function(){
	  		toggleAlphabetization();
	  		if(_sortedAtoZ) {
	  			$sortLink.text('Sort from Z to A');
	  		}
	  		else {
	  			$sortLink.text('Sort from A to Z');
	  		}
	  		return false;
	  	});
	  	getDict(_lang);
	  		  		  
    };

    //Word Processing Functions

    /**
    * Scans through a dictionary and adds an object to each word containing 
    * the quanity of each letter within that word
    *
    * @param dict {object}  HashMap containing a dictionary of words
    * @return {object} HashMap containing a dictionary of words with letter counts appended
    **/
    var addWordLetterCounts = function(dict) {
  		var completeDict = {};

	    for (var word in dict) {
	    	if(word !== '_id'){
	    		dict[word].letterCounts =  countLetters(word);   
	    		completeDict[word] = dict[word];
	    	}
	  	}

	    return completeDict;
	}

	/**
    * Counts the letters in a string
    *
    * @param str {string}  String to count the letters of
    * @return {object} containg count of letters in the string in format: { a:4, b:2, c:3}
    **/
	var countLetters = function(str) {
	  var letterCounts = {};
	  for (var i = str.length - 1; i >= 0; i--) {
	    var currLetter = str[i];
	    letterCounts[currLetter] = letterCounts[currLetter] !== undefined ? letterCounts[currLetter] +  1 : 1;
	  }

	  return letterCounts;
	};

	/**
    * Checks to see if a word can be made from the letters in another word by comparing the counts 
    * of letters in the words
    *
    * @param compareArray {object}  object containing letter counts of a string to compare against
    * @param wordLetterCountArr {object}  object containing letter counts of a string to check
    * @return {boolean} true if the word represented by wordLetterCountArr can be made with the 
    * 					letters in wordLetterCountArr
    **/
	var containsStringLetters = function(compareArray, wordLetterCountArr){
	  for(var letter in wordLetterCountArr) {
	    if(compareArray[letter] === undefined || ( compareArray[letter] < wordLetterCountArr[letter])) {
	      return false;
	    }
	  }
	  return true;
	};

	/**
    * Finds all of the words in a dictionary that can be made from a given string.  Currently
    * the results are stored in a closure variable called _outputArray to prevent making a local
    * copy of this potentially large object
    *
    * @param str {string}  String to search for words
    * @param dict {object} dictionary object
    **/
	var findWordsInString = function(str, dict) {
		displayProgress('Finding words...');
	    _outputArray = [];

	    for(var sortedWord in dict){
	    	if(containsStringLetters(countLetters(_compareString), dict[sortedWord].letterCounts)){
	           var unscrambledWordArray = dict[sortedWord].w;

	           for (var i = unscrambledWordArray.length - 1; i >= 0; i--) {
	               _outputArray.push(unscrambledWordArray[i]);
	           };
			}
		}

		_outputArray.sort();
		
		doneLoading();
	}

	/**
    * Retrieves a dictionary file from a web service.  Currently configured to store the results
    * in an closure variable called _dictMap so a local copy of the large object does not have to
    * be created
    *
    * @param lang {string}  Code of lanugage to retrieve.  'en_us' for example
    **/
	var getDict = function(lang) {
		console.log('Retrieving Dictionary: ' + lang.val);
		displayProgress('Loading ' + lang.text + ' dictionary...');

		jQuery.get('/api/1.0/get_dictionary', {'lang' : lang.val})
		.done(function(data) {
			if(data !== undefined) {
				console.log('Dictionary retrieved!');
				_$textInput.prop('disabled', false);
				_dictMap = addWordLetterCounts(data);
				if(_$textInput.val().length > 0){
					findWordsInString(_compareString, _dictMap);
					displayWords(_outputArray);
				}
				doneLoading();
			}
			else {
				console.log('error finding words');
				jQuery('#loadingMessage').text(
					'Sorry there was a problem loading the dictionary. Try refreshing the browser');
			}
		}
	)}

	// UI Helpers

	/**
    * Configures the range UI control based on the maximum length of found words
    *
    * @param maximum {number}  maximum range of control
    **/	
	var configureRangeFinder = function(maximum) {
		var $resultFilter = jQuery('#resultFilter');
		jQuery('.filterLayer').removeClass('disabled').prop('title', '');

		if(maximum > 0) {
			if($resultFilter.val() > maximum) {
				$resultFilter.val('maximum');
			}
			jQuery('.rangeMax').text(maximum);
			jQuery('#resultFilter').prop('max', maximum);
			jQuery('.rangeCount').text($resultFilter.val() + ' letters');
		}
		else {
			jQuery('.rangeMax').text('MAX');
			jQuery('#resultFilter').prop('max', 100);
			jQuery('.rangeCount').text('No Limit');
		}
	}

	/**
    * Outputs the list of found words
    *
    * @param wordArray {array}  contains list of words to display
    * @param max {number} the maximum length of letters in words to be displayed
    **/	
	var displayWords = function(wordArray, max) {
		var outputString = '',
			maxLength = 0,
		    currWord,
		    i;

		jQuery('.sortLink').removeClass('disabled');

		if(max !== undefined) { //limit the output to words with length under the max
			for (i = 0; i < wordArray.length; i++) {
				currWord = wordArray[i];
				
				if(currWord.length <= max) {
					outputString += (currWord + ', ');
				}	
			}
		}
		else {	//no max was supplied so find it
			for (i = 0; i < wordArray.length; i++) {
				currWord = wordArray[i];
				
				if(currWord.length > maxLength) {
		    		maxLength = currWord.length;
		    	}
				outputString += (currWord + ', ');	
			}
			configureRangeFinder(maxLength);
		}
		outputString = outputString.slice(0, outputString.length - 2);
		_$outputNode.text(outputString);

		_sortedAtoZ = true;
		jQuery('.sortLink').text('Sort from Z to A');
		
	}

	/**
	* Change the alphabetization order
	**/
	var toggleAlphabetization = function() {
		if (_outputArray.length !== 0) {
			var outputString = '';
			
			_outputArray.reverse();
			for(var i = 0; i < _outputArray.length; i++) {
				outputString += (_outputArray[i] + ', ');
			}

			outputString = outputString.slice(0, outputString.length - 2);
			_$outputNode.text(outputString);

			_sortedAtoZ = !_sortedAtoZ;
		}
	}

	/**
	* Display a progress bar
	*
	* @param message {string} message to be displayed under the progress bar
	**/
	var displayProgress = function(message) {
		jQuery('#loadingMessage').text(message);
		jQuery('.progressContainer').removeClass('hidden');
		jQuery('.mainContainer').addClass('disabled');

	}
	
	/**
	* Remove progress bar
	*
	* @param message {string} message to be displayed under the progress bar
	**/
	var doneLoading = function() {
		jQuery('.progressContainer').addClass('hidden')
		jQuery('.mainContainer').removeClass('disabled');
	}

	/**
    * Utility method to wait a delay before calling a function
    */
    var delay = (function(){
	  var timer = 0;
	  return function(callback, ms){
	    clearTimeout (timer);
	    timer = setTimeout(callback, ms);
	  };
	})();

	//Return Pubic API
	return {
		init : init
	};

}());

jQuery(document).ready(function() {
	WordFinder.init();
});
