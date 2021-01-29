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
*    { pos: 3, word: 'he' },
*    { pos: 4, word: 'her' }]
*/

// add additional word list 
wordChecker.addWord(['she'])
wordChecker.search('ushers');
/* excepted:
*   [{ pos: 3, word: 'she' },
*    { pos: 5, word: 'hers' },
*    { pos: 3, word: 'he' },
*    { pos: 4, word: 'her' }]
*/
````

### skip special character
````js
// default skip white spaces
// pass customize reg expression to skip confusion charater
const wordChecker = new checker(['shit'], /\s+|\*/g);
wordChecker.search('13213 s h ** i t');
/* excepted:
*   [{ pos: 15, word: 'shit' }]
*/
````

### strict match
````js
// pass null as regExp
const wordChecker = new checker([ 'her', 'he', 's h e', 'hers' ], null);
wordChecker.search('us h ers h e he r');
/* excepted:
[
  { pos: 5, word: 's h e' },
  { pos: 11, word: 's h e' },
  { pos: 14, word: 'he' }
]
*/
````

### block word
````js
const wordChecker = new checker(['shit'], /\s+|\*/g);
wordChecker.filter('13213 s h ** i t', '*');
/* excecpted
*  '13213 *********'
*/
````
