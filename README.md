# word-match-helper

Aho–Corasick based word checking. Match words fast.

## Installation

````sh
npm install word-match-helper
````

## development & test

```sh
npm run build
npm run dev
npm run test # basic cases 
```

## Basic Usage

````javascript
import { WordMatcher } from 'word-match-helper';

const wordChecker = new WordMatcher({
  targets: ['her', 'he', 'hers'],
});

// excepted matched result: ['her', 'he', 'hers']
wordChecker.search('ushers');

// add additional word list 
wordChecker.addWord(['she'])

// excepted matched result: ['her', 'he', 'hers', she]
wordChecker.search('ushers');
````
