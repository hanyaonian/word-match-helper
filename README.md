# word-match-helper
Aho–Corasick. Word checking.

### Usage
````javascript
import checker from PATH

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
###### skip special character
````js
// default skip white spaces
// pass customize reg expression to skip confusion charater
const wordChecker = new checker(['shit'], /\s+|\*/g);
wordChecker.search('s h ** i t');
/* excepted:
*   [{ pos: 9, word: 'shit' }]
*/
````