import { ACTreeContainer, ACTreeNode, SearchResult, Options } from './types';
import { Node } from './node';
import { arrayDeduplication } from './utils';

export default class AhoCorasick {
  private root: Node;
  public currentState: number = 0;
  public wordset: Set<string> = new Set();

  // \0 means match null (U+0000)
  private ignorePatt: RegExp = /\0/g;
  private toLowerCase: boolean = true;

  constructor(config: Options) {
    const { targets } = config;

    // initiate root node
    this.root = new Node({
      char: null,
    });

    this.initACStateTree(targets);
  }

  public addWord(wordlist: string[]): void {
    this.initACStateTree(wordlist);
  }

  private initACStateTree(wordlist: string[]): void {
    const words = arrayDeduplication(wordlist);
    words.forEach(word => {
      let currentNode = this.root;
      let len = word.length;
      for (let i = 0; i < len; i++) {
        const next = currentNode.setChildren({
          char: word[i],
          root: this.root,
          is_match: i === len - 1, // state match words end
        });
        // get next level
        currentNode = next;
      }
      // todo: fix this
      currentNode.isMatch = true;
    });
    // set backNode
    this.setBackNode(this.root);
  }

  /**
   * @param root tireTree root
   * 
   * how to get each node's backNode: 
   * 1. if node is root, backnode points to itself
   * 2. if parents are root, backnode points to root
   * 3. find childNode of parentNode's backNode, if the character value are same,
   *    then that childNode is this node's backNode
   * 4. (loop) childNode of parentNode's backNode doesn't fit current node, 
   *    continue to find parentNode's parentNode
   */
  private setBackNode(node: Node): void {
    let currentNodeArr = node.getChildNodeList();
    while (currentNodeArr.length > 0) {
      let childNodeArr = [];
      for (let i = 0; i < currentNodeArr.length; i++) {
        let currentNode = currentNodeArr[i];
        // collect all child node
        childNodeArr.push(...currentNode.getChildNodeList());
        let parentNode = currentNode.parent;
        if (!parentNode) {
          continue;
        }
        let backNode = parentNode.backNode;
        while (backNode) {
          let child = backNode.children[currentNode.char || ''];
          if (child) {
            currentNode.backNode = child;
            break;
          }
          // all backnode are root in initial state
          backNode = backNode.backNode;
        }
      }
      currentNodeArr = childNodeArr;
    }
  }

  /**
   * @param text search text
   * 
   */
  public search(text: string): SearchResult[] {
    text = this.toLowerCase ? text.toLocaleLowerCase() : text;
    let words = [];
    let currentNode = this.root;
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      // skip
      if (char.match(this.ignorePatt)) {
        continue;
      }
      let child = currentNode.children[char];
      if (!child) {
        // if doesn't match, find backNode until get root.
        let backNode = currentNode.backNode;
        while (backNode) {
          child = backNode.children[char];
          if (child) {
            // find match path
            break;
          }
          backNode = backNode.backNode;
        }
      }
      if (child) {
        let backNode: Node = child;
        while (backNode && backNode !== this.root) {
          if (backNode.isMatch) {
            words.push({
              pos: i + 1,
              word: this.getWord(backNode)
            })
          }
          backNode = backNode.backNode as Node;
        }
        currentNode = child;
      } else {
        currentNode = this.root; // initial state
      }
    }
    return words;
  }

  /**
   * @param text target text
   * @param replacement default '*'
   * @return text replace matching word to replacement
   * ['he'], 'she' -> 's**'
   */
  public filter(text: string, replacement: string = '*'): string {
    let wordArr = text.split('');
    let skipWordMap = new Map<number, string>();
    let matchedWord = this.search(text);
    matchedWord.sort((pre, next) => pre.pos - next.pos);
    for (let i = 0; i < matchedWord.length; i++) {
      let currentWord = matchedWord[i].word;
      let currentPos = matchedWord[i].pos;
      let lword = skipWordMap.get(currentPos);
      if (lword && lword.length < currentWord.length) {
        // get same position's longest word
        skipWordMap.set(currentPos, currentWord)
      }
      if (!lword) {
        skipWordMap.set(currentPos, currentWord)
      }
    }
    skipWordMap.forEach((word, pos) => {
      let i = word.length - 1;
      let moved = 0;
      while (i >= 0) {
        if (word[i] === wordArr[pos - moved] ||
          (wordArr[pos - moved] === replacement && !wordArr[pos - moved].match(this.ignorePatt))
        ) {
          i -= 1;
        }
        moved += 1;
      }
      wordArr.splice(pos - moved + 1, moved, ...new Array(moved).fill(replacement));
    })
    return wordArr.join('');
  }

  private getWord(node: Node): string {
    let word = '';
    while (node.parent && node.char) {
      word = node.char + word;
      node = node.parent
    }
    return word;
  }
}
