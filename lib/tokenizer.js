/*jshint node:true, laxcomma:true */
"use strict";

var Match  = require('./Match');

// Split the entry into sentences.
exports.sentences = function(text, user_options) {
    if (!text || typeof text !== "string" || !text.length) {
        return [];
    }
    
    if (!/\S/.test(text)) {
      // whitespace-only string has no sentences
      return [];
    }

    var options = {
        "preserve_whitespace" : false,
        "abbreviations"       : null
    };

      // Extend options
      for (var k in user_options) {
          options[k] = user_options[k];
      }

    Match.setAbbreviations(options.abbreviations);

    // Split the text into words
    var words;
    var tokens;
    tokens = text.split(/(\S+|\n+)/);
    // every other token is a word
    words = tokens.filter(function (token, ii) {
      return ii % 2;
    });

    var wordCount = 0;
    var index = 0;
    var temp  = [];
    var sentences = [];
    var current   = [];

    // If given text is only whitespace (or nothing of \S+)
    if (!words || !words.length) {
        return [];
    }

    for (var ii=0, L=words.length; ii < L; ii++) {
        wordCount++;

        // Add the word to current sentence
        current.push(words[ii]);

        // Sub-sentences, reset counter
        if (words[ii].includes(',')) {
            wordCount = 0;
        }

        if (Match.isBoundaryChar(words[ii]) || /[?!]$/.test(words[ii])) {
            sentences.push(current);

            wordCount = 0;
            current   = [];

            continue;
        }


        if (/["”"]$/.test(words[ii])) {
            words[ii] = words[ii].slice(0, -1);
        }

        // A dot might indicate the end sentences
        // Exception: The next sentence starts with a word (non abbreviation)
        //            that has a capital letter.
        if (/[.]$/.test(words[ii])) {
            // Check if there is a next word
            // This probably needs to be improved with machine learning
            if (ii+1 < L) {
                // Single character abbr.
                if (words[ii].length === 2 && isNaN(words[ii].charAt(0))) {
                    continue;
                }

                // Common abbr. that often do not end sentences
                if (Match.isCommonAbbreviation(words[ii])) {
                    continue;
                }

                // Next word starts with capital word, but current sentence is
                // quite short
                if (Match.isSentenceStarter(words[ii+1])) {
                    if (Match.isTimeAbbreviation(words[ii], words[ii+1])) {
                        continue;
                    }

                    // Dealing with names at the start of sentences
                    if (Match.isNameAbbreviation(wordCount, words.slice(ii, 6))) {
                        continue;
                    }

                    if (Match.isNumber(words[ii+1])) {
                        if (Match.isCustomAbbreviation(words[ii])) {
                            continue;
                        }
                    }
                }
                else {
                    // Skip ellipsis
                    if (/[.]{2}$/.test(words[ii])) {
                        continue;
                    }

                    //// Skip abbreviations
                    // Short words + dot or a dot after each letter
                    if (Match.isDottedAbbreviation(words[ii])) {
                        continue;
                    }

                    if (Match.isNameAbbreviation(wordCount, words.slice(ii, 5))) {
                        continue;
                    }
                }
            }

            sentences.push(current);
            current   = [];
            wordCount = 0;

            continue;
        }

        // Check if the word has a dot in it
        if ((index = words[ii].indexOf(".")) > -1) {
            if (Match.isNumber(words[ii], index)) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (Match.isDottedAbbreviation(words[ii])) {
                continue;
            }

            // Skip urls / emails and the like
            if (Match.isURL(words[ii]) || Match.isPhoneNr(words[ii])) {
                continue;
            }
        }

        if ((temp = Match.isConcatenated(words[ii]))) {
            current.pop();
            current.push(temp[0]);
            sentences.push(current);

            current = [];
            wordCount = 0;
            current.push(temp[1]);
        }
    }

    if (current.length) {
        sentences.push(current);
    }

    // Clear "empty" sentences
    sentences = sentences.filter(function(s) {
        return s.length > 0;
    });
    
    var result = sentences.slice(1).reduce(function (out, sentence) {
      var lastSentence = out[out.length - 1];
      // Single words, could be "enumeration lists"
      if (lastSentence.length === 1 && /^.{1,2}[.]$/.test(lastSentence[0])) {
          // Check if there is a next sentence
          // It should not be another list item
          if (!/[.]/.test(sentence[0])) {
              out.pop()
              out.push(lastSentence.concat(sentence));
              return out;
          }
      }
      out.push(sentence);
      return out;
    }, [ sentences[0] ]);

    // join tokens back together
    return result.map(function (sentence, ii) {
      if (options.preserve_whitespace) {
        // tokens looks like so: [leading-space token, non-space token, space
        // token, non-space token, space token... ]. In other words, the first
        // item is the leading space (or the empty string), and the rest of
        // the tokens are [non-space, space] token pairs.
        var tokenCount = sentence.length * 2;
        if (ii === 0) {
          tokenCount += 1;
        }
        return tokens.splice(0, tokenCount).join('');
      }
      return sentence.join(" ");
    });
};
