Word Finder
==============
The purpose of this app is to quickly find all words that can be constructed from a particular set of letters.
For example: Given a list of English words and a set of letters (say “yxmijcmknbshdwifzrsmueist”), it will display all the words that can possibly be constructed from any subset (or all) those letters.

The goal is to minimize the time between receiving the letters and displaying the possible words.

Assumptions & considerations
----------------------------
1. The dictionary file contains some duplicate entries with different cases.  For example: 'Z' and 'z' are listed.  This app treats them as separate entries for completeness.
2. The letter order in the search string is not important.  All possible combinations of letters will be searched.
2. For this exercise, clarity of variable names was emphasized over brevity.  In a production situation, the files would minified anyway.

Algorithm Explanation
---------------------
The algorithm is heavy on pre-processing so that the time time to search subsequent strings will be faster.

__Build Dictionary__

1. Read a text file dictionary
2. Sort the letters of each word in the dictionary.  For example: 'cat' becomes 'act';
3. Use the sorted values as a key in a hash table.  This key maps to an array containing all words that can be made from these sorted letters.  Example: 'act' : [ "cat", "Cat", "act" ]
4. Count the letters in each key and insert these letter counts into hash map.

__Search a String__
1. Count each letters in the string.
2. Iterate through the hash map, for each word check to see if its letters are in string's hash map. If so, check the letter counts, if not move on the next word.
3. If there is a match, add all of the words that mapped to the sorted words key into a new output array.
4. Return the output array.


Architecture
------------
The frontend is written with JavaScript and jQuery.  The backend is written and node.js and MongoDB is used to store the dictionary files.   There are two ways to use this app.  Pre-processed dictionaries for English, Italian, Spanish, and French have been inserted into a MongoDB database.  The dictionaries however are on the order of ~10MB so transfer times to the client can be an issue.  If using the app via the front end, you will have to wait a bit for the app to pull down the requested dictionary.  During this time, the app will use the API to fetch the results, instead of finding them directly on the client. Subsequent string searches will be fast enough to happen as you type though.

Alternatively, there are a few API calls that can be used for interacting with the service directly.  The API does not know ahead of time which dictionary will be requested so it doesn't benefit from caching the dictionary, but because it doesn't have to transfer the large dictionary files, the initial time will be faster.  So the API will be faster if you only need to check one string, but for checking many strings, the front end will be faster.           

API Docs
--------
__GET__

/api/1.0/find_words

request to search for a string in a given language

__Required parameters are:__ 

lang: language code to search.  Possible values are 'en_us', 'es', 'fr', 'it'. Defaults to 'en_us'.

letterString: the string to seatch for words.

__Example__

http://boiling-lowlands-4650.herokuapp.com/api/1.0/find_words?lang=en_us&letterString=cat

/api/1.0/get_dictionary

Returns the Dictionary JSON object representing a hash map of a pre-processed dictionary

__Required parameters are:__ 

lang: language code to search.  Possible values are 'en_us', 'es', 'fr', 'it'. Defaults to 'en_us'.

__Example__

http://boiling-lowlands-4650.herokuapp.com/api/1.0/get_dictionary?lang=es

__POST__

/api/1.0/add_dictionary

Add a new dictionary to the DB

__Required parameters are:__ 

lang  This will be the name of the collection for the dictionary. 
dict dictionary HashMap.  

Example entry in the hash is { 'act' : { 'w' : [ 'cat', 'Cat', 'act' ] } }


Demo
-----
See the app in action at: [http://boiling-lowlands-4650.herokuapp.com/](http://boiling-lowlands-4650.herokuapp.com/)

It has been tested in Chrome, Firefox, and Safari.  It is not yet optimized for mobile devices.  Please let me know if you find any bugs!

Features for future versions
----------------------------
1. Improve support on mobile devices
2. Auto-detect language of user's machine before loading first dictionary.
3. Take advantage of Local Storage on modern browsers to store dictionaries.
