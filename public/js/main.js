WordFinder = (function () {

    //Private Vars
    var wordListURL = "resources/englishWords.txt";
    var compareString = "alsup";
    var dictionaryMap = {};
    var outputArray = [];

    var outputNode = jQuery('#output');

    //Private Methods
    var init = function() {
	  	jQuery.when(getData(wordListURL))
	  	  	  .then(processDict)
	  		  .then(makeoutput);
    };

	var getData = function(url) {
		return jQuery.ajax(url, {
		    dataType: 'text',
		    type: 'GET'
		});
	};

	//Processing Dictionary will take 
	var processDict = function(dictText){
		outputNode.text("Processing...");
		var startTime = new Date().getTime();

		var dictionaryArr = dictText.split('\n');
		console.log("dictionaryCount:" + dictionaryArr.length);
		for (var i = dictionaryArr.length - 2; i >= 0; i--) {
			var currWord = dictionaryArr[i];
			var wordArr = currWord.toLowerCase().split('').sort();
			var sortedWord = wordArr.join('');
			
			if(dictionaryMap[sortedWord] !== undefined) {
				dictionaryMap[sortedWord].words.push(currWord);
			}
			else {	
				dictionaryMap[sortedWord] = {letterCounts: countLetters(currWord), words : [currWord]};
			}
		}
		var endTime = new Date().getTime();
		console.log("Time to Process Dictionary: " + (endTime - startTime));
		outputNode.text("Done Processing!");
	};

	var countLetters = function(str) {
		var letterCounts = [];
		for (var i = str.length - 1; i >= 0; i--) {
			var currLetter = str[i];
			letterCounts[currLetter] = letterCounts[currLetter] !== undefined ? letterCounts[currLetter] +  1 : 1;
		}

		return letterCounts;
	};

	var makeoutput = function(){
		var startTime2 = new Date().getTime();
		outputNode.text("makeoutput");
		var compareLettersArr = countLetters(compareString);
		
		var mapCount = 0;
		for(var sortedWord in dictionaryMap){
			if(containsStringLetters(compareLettersArr, dictionaryMap[sortedWord].letterCounts)){
				 var unscrambledWordArray = dictionaryMap[sortedWord].words;
				 for (var i = unscrambledWordArray.length - 1; i >= 0; i--) {
				 	outputArray.push(unscrambledWordArray[i]);
				 };
			}
			mapCount++;
		}
		console.log("mapCount:" + mapCount);
		console.log("Time to Find Outputs " + (new Date().getTime() - startTime2));
		var count = 0;
		var outputString = "";
		for(var i = 0; i < outputArray.length; i++){
			outputString += ", " + outputArray[i];
			count++;	
		}
		outputNode.text(outputString);
	};

	var containsStringLetters = function(compareArray, wordLetterCountArr){

		for( var letter in wordLetterCountArr) {
			if(compareArray[letter] === undefined || ( compareArray[letter] < wordLetterCountArr[letter])) {
				return false;
			}
		}
		return true;
	};

	//Return Pubic API
	return {
		init : init
	};

}());

jQuery(document).ready(function() {
	WordFinder.init();
});
