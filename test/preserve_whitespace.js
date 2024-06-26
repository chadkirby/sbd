/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');
var options = { preserve_whitespace: true };

describe('Preserve whitespace', function () {

    describe('Basic', function () {
        var entry = " This is\ta  sentence   with  funny whitespace.  And this  is \tanother.\tHere  is   a third. ";
        var sentences = tokenizer.sentences(entry, options);

        it("should get 3 sentences", function () {
            assert.equal(sentences.length, 3);
        });
        it('funny whitespace is preserved in the sentences', function () {
            assert.equal(sentences.join(''), entry);
            assert.equal(sentences[0], " This is\ta  sentence   with  funny whitespace.  ");
            assert.equal(sentences[1], "And this  is \tanother.\t");
            assert.equal(sentences[2], "Here  is   a third. ");
        });
    });

    describe('It should properly join single-word list sentences', function () {
        var entry = "iv. determining that the advertisement in the lift study is a candidate ad for the user, computing whether to include the user in a test group or a control group for the lift study ([0032]), v. based on the computation indicating that the user is in the control group, holding out the advertisement from completing the ad selection process for the user ([0032]), and vi. based on the computation indicating that the user is in the test group, allowing the advertisement to continue through the ad selection process such that the user receives either the advertisement in the lift study or another advertisement ([0032]); and ";
        var sentences = tokenizer.sentences(entry, options);

        it("should get the correct sentences", function () {
            assert.deepEqual(sentences, [
              "iv. determining that the advertisement in the lift study is a candidate ad for the user, computing whether to include the user in a test group or a control group for the lift study ([0032]), v. based on the computation indicating that the user is in the control group, holding out the advertisement from completing the ad selection process for the user ([0032]), and vi. ",
              "based on the computation indicating that the user is in the test group, allowing the advertisement to continue through the ad selection process such that the user receives either the advertisement in the lift study or another advertisement ([0032]); and "
            ]);
        });
    });
    describe('i.e.', function () {
        var entry = "This can be particularly descriptive of the physical nature of the microheater, which can comprise an electrically conductive material that specifically can be provided in the form of a film—i.e., an electrically conductive layer. In certain embodiments, the electrically conductive material can be patterned. In other words, the electrically conductive material can be present in the microheater in a specific pattern.";
        var sentences = tokenizer.sentences(entry, {preserve_whitespace: true, abbreviations: ['i[.]e']});

        it("should get 3 sentences", function () {
            assert.equal(sentences.length, 3);
        });
        it('sentences are correct', function () {
            assert.equal(sentences.join(''), entry);
            assert.equal(sentences[0], "This can be particularly descriptive of the physical nature of the microheater, which can comprise an electrically conductive material that specifically can be provided in the form of a film—i.e., an electrically conductive layer. ");
            assert.equal(sentences[1], "In certain embodiments, the electrically conductive material can be patterned. ");
            assert.equal(sentences[2], "In other words, the electrically conductive material can be present in the microheater in a specific pattern.");
        });
    });
    describe('i.e.', function () {
        var entry = "Claims 1-9 and 16-19 are rejected under 35 U.S.C. 112(b) or 35 U.S.C. 112 (pre-AIA ), second paragraph, as being indefinite for failing to particularly point out and distinctly claim the subject matter which the inventor or a joint inventor, or for pre-AIA  the applicant regards as the invention.";
        var sentences = tokenizer.sentences(entry, {preserve_whitespace: false, abbreviations: ['usc']});

        it("should get 1 sentences", function () {
            assert.equal(sentences.length, 1);
        });
        it('sentences are correct', function () {
            assert.equal(sentences[0], entry.replace(/ {2}/g, ' '));
        });
    });
    describe('Patent/Pub.', function () {
        var entry = "Claim(s) 1-5 is/are rejected under 35 U.S.C. 103(a) as being unpatentable over Kottomtharayil, U.S. Patent/Pub. No. 2006/0224852 A1 in view of Nachimuthu, U.S. Patent/Pub. No. 2008/0115138 A1, and Ahmed, U.S. Pub. No. 2010/0338709 A1, and further ni view of Lee, U.S. Pub. No. 2010/0302884 A1.";
        var sentences = tokenizer.sentences(entry, { preserve_whitespace: false, abbreviations: ['Pub', 'No', 'US', 'USC'] });

        it("should get 1 sentences", function () {
            assert.equal(sentences.length, 1);
        });
        it('sentences are correct', function () {
            assert.equal(sentences[0], entry.replace(/ {2}/g, ' '));
        });
    });

});
