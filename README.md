# word-match-helper
Aho–Corasick. Word checking.

### Usage
````javascript
import checker from PATH

const wordChecker = new checker(['her', 'he', 'hers']);
wordChecker.search('ushers');
/* excepted:
*    [{ pos: [2, 5], word: 'hers' },
*    { pos: [2, 3], word: 'he' },
*    { pos: [2, 4], word: 'her' }]
*/

// add additional word list 
wordChecker.addWord(['she'])
wordChecker.search('ushers');

/* excepted:
*   [{ pos: [1, 3], word: 'she' },
*    { pos: [2, 5], word: 'hers' },
*    { pos: [2, 3], word: 'he' },
*    { pos: [2, 4], word: 'her' }]
*/
````