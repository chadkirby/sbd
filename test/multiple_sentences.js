/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Multiple sentences', function () {
    describe('Include ellipsis as ending if starts with capital', function () {
        var entry = "First sentence... Another sentence";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentences', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Two sentences', function () {
        var entry = "Lorem ipsum, dolor sed amat frequentor minimus. Second sentence.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences (A)', function () {
        var entry = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentences', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences (B)', function () {
        var entry = "Sen. Barack Obama became the 44th President of the US. Millions attended.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentence', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences (C)', function () {
        var entry = "Barack Obama, previously Sen. of lorem ipsum, became the 44th President of the U.S. Millions attended.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentence', function () {
            assert.equal(sentences.length, 2);
        });
    });


    describe('Difficult two sentences (D)', function () {
        var entry = "Baril, a Richmond lawyer once nominated for a federal prosecutors job, endorsed a faith-based drug initiative in local jails patterned after the Henrico County jails therapeutic program called Project R.I.S.E. Just as important, he had a great foil across the net.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentence', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences (E)', function () {
        var entry = "Newsletter AIDs CARE, EDUCATION AND TRAINING Issue No. 7. Acet Home Care, which moves into the building in July, will share the offices with two other AIDS charities, P.A.L.S. (Portsmouth AIDS Link Support) and the Link Project.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentence', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences (F)', function () {
        var entry = "Another is expanded hours of operation -- from fewer than five hours a day to 9:30 a.m. to 4 p.m. Monday through Saturday. Sunday remains closed.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentence', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences (G)', function () {
        var entry = "Gold Wing Road Rider's Association - Coffee break, Guzzardo's Italian Villa, eat, 6 p.m.; ride, 7 p.m. Then at 9 p.m. go home.";
        var sentences = tokenizer.sentences(entry);

        it('should get two sentence', function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Dot in middle of word is not skipped if followed by capital letter', function () {
        var entry = "Hello Barney.The bird in the word.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Question- and exlamation mark', function () {
        var entry = "Hello this is my first sentence? There is also a second! A third";
        var sentences = tokenizer.sentences(entry);

        it("should get 3 sentences", function () {
            assert.equal(sentences.length, 3);
        });
    });

    describe('It should skip keywords/code with a dot in it', function () {
        var entry = "HELLO A.TOP IS NICE";
        var sentences = tokenizer.sentences(entry);

       it("should get 2 sentences", function () {
            assert.equal(sentences.length, 1);
        });
    });
});
