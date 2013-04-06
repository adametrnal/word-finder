module('countLetters');
test('count cat', function(){
    deepEqual(WordFinder.countLetters('cat'), { "a": 1, "c": 1, "t": 1 }, 'wrong letter counts');
});

test('count empty', function(){
    deepEqual(WordFinder.countLetters(''), { }, 'wrong letter counts');
});

test('count repeated letters', function(){
    deepEqual(WordFinder.countLetters('aaaaabbbbbaaaaazzzz'), { "a": 10, "b" : 5, "z" : 4  }, 'wrong letter counts');
});


var dummyDictionary = { "act" : { "w" : [ "cat", "Cat", "act" ] }, 
                        "aceilsz" : { "w" : [ "Casziel" ] }, 
                        "aceeillstw" : { "w" : [ "caswellite" ] }};

var dummyDictWithLetters = { "aceeillstw": { "letterCounts": {"a": 1,"c": 1,"e": 2,"i": 1,"l": 2,"s": 1,"t": 1,"w": 1},
                                             "w": [ "caswellite" ]},
                             "aceilsz": { "letterCounts": {"a": 1, "c": 1,"e": 1,"i": 1,"l": 1,"s": 1,"z": 1 },
                                             "w": ["Casziel"]},
                             "act": { "letterCounts": {"a": 1,"c": 1,"t": 1},
                                             "w": ["cat","Cat","act"]}};

module('addWordLetterCounts');
test('add letters', function() {
    deepEqual(WordFinder.addWordLetterCounts(dummyDictionary),
                dummyDictWithLetters,
                'did not add letter counts correctly');
});


var stringCompareObj = {"a": 1,"c": 1,"e": 2,"i": 1,"l": 2,"s": 1,"t": 1,"w": 1};
module('containsStringLetters');
test('check simple word', function() {
    equal(WordFinder.containsStringLetters(stringCompareObj, 
                                           { "a": 1, "c": 1, "t": 1 }),
           true, 'cat is in the string');
});

test('check word not in the string', function() {
    equal(WordFinder.containsStringLetters(stringCompareObj, 
                                           { "a": 1, "c": 1, "z": 1 }),
           false, 'caz is not the string');
});

module('API tests');
var wordsInCat = ["A", "C", "Cat", "T", "a", "act", "at", "c", "ca", "cat", "t", "ta"];
asyncTest("Check Find Words API", 1, function(){
    jQuery.get("/api/1.0/find_words", { "lang" : 'en_us', "letterString" : 'cat'})
            .done(function(data) {
                deepEqual(data, wordsInCat, "cool");
                start();
            })
});








