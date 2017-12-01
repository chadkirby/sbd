Sentence Boundary Detection (SBD)
==================

Split text into sentences with a `vanilla` rule based approach (i.e working ~95% of the time).

* Split a text based on period, question- and exclamation marks.
    * Skips (most) abbreviations (Mr., Mrs., PhD.)
    * Skips numbers/currency
    * Skips urls, websites, email addresses, phone nr.
    * Counts ellipsis and ?! as single punctuation

## Installation

Use [npm](http://npmjs.org):

    $ npm install sbd


## How to

```javascript
var tokenizer = require('sbd');

var text = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.";
var sentences = tokenizer.sentences(text, optional_options);

// [
//  'On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S.',
//  'Millions attended the Inauguration.',
// ]
```


#### Optional options

```
var options = {
    "preserve_whitespace" : false,
    "abbreviations"      : null
};
```

* `preserve_whitespace`: Preserve the literal whitespace between words and sentences (otherwise, internal spaces are normalized to a single space char, and inter-sentence whitespace is omitted).
* `abbreviations`: list of abbreviations to override the original ones for use with other languages. Don't put dots in abbreviations.



## Contributing

You can run unit tests with `npm test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give me a @mention. Pull requests are welcome.


## Building the (minified) scripts

```
npm install -g browserify

npm run-script build
```