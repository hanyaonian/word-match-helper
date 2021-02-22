# word-match-helper
Aho–Corasick based word checking. Match & filter words.

### install
````
npm install word-match-helper
````

### Basic Usage
````javascript
import checker from 'word-match-helper' // es6 module
var wordMatchHelper = require("word-match-helper").default // commonjs

const wordChecker = new checker(['her', 'he', 'hers']);
wordChecker.search('ushers');
/* excepted:
*    [{ pos: 5, word: 'hers' },
*    { pos: 4, word: 'he' },
*    { pos: 5, word: 'her' }]
*/

// add additional word list 
wordChecker.addWord(['she'])
wordChecker.search('ushers');
/* excepted:
*   [{ pos: 4, word: 'she' },
*    { pos: 6, word: 'hers' },
*    { pos: 4, word: 'he' },
*    { pos: 5, word: 'her' }]
*/
````

### skip special character
````js
// pass customize reg expression to skip confusion charater
// e.g skip spaces and '*'
const wordChecker = new checker(['shit'], {
  ignorePatt: /\s+|\*/g
});
wordChecker.search('13213 s h ** i t');
/* excepted:
*   [{ pos: 16, word: 'shit' }]
*/
````

### options
- ignorePatt: Regexpression. default is /\0/g, match null.
- baseStrict: Boolean. default is false. If false, 'App' match 'app', if true, 'App' won't mathc 'app'

### block word
````js
const wordChecker = new checker(['shit'], {
  ignorePatt: /\s+|\*/g,
  baseStrict: true
});
wordChecker.filter('13213 s h ** i t', '*');
/* excecpted
*  '13213 *********'
*/
````
