// Main Word Processing object
WordProcessing = function() {};

/**
* Scans through a dictionary and adds an object to each word containing 
* the quanity of each letter within that word
*
* @param dict {object}  HashMap containing a dictionary of words
* @return {object} HashMap containing a dictionary of words with letter counts appended
**/
WordProcessing.prototype.addWordLetterCounts = function(dict) {
  var completeDict = {};

  for (var word in dict) {
    if(word !== "_id"){
      dict[word].letterCounts =  this.countLetters(word);   
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
WordProcessing.prototype.countLetters = function(str) {
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
*           letters in wordLetterCountArr
**/
WordProcessing.prototype.containsStringLetters = function(compareArray, wordLetterCountArr){
  for(var letter in wordLetterCountArr) {
    if(compareArray[letter] === undefined || ( compareArray[letter] < wordLetterCountArr[letter])) {
      return false;
    }
  }
  return true;
};

// Export the Word Processing functions for use in other modules.
exports.WordProcessing = WordProcessing;