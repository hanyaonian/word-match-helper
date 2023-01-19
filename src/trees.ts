import { arrayDeduplication } from "./utils";
import { Node } from "./node";

export default class AhoCorasick {
  private root: Node;
  public wordset: Set<string>;

  constructor(config: { targets: string[] }) {
    const { targets } = config;

    // initiate root node
    this.root = new Node({
      char: null,
    });
    this.wordset = new Set(targets);
    this.addACStateTreeNode(targets);
  }

  public addWord(wordlist: string[]): void {
    const newWords: string[] = [];
    wordlist.forEach(word => {
      if (!this.wordset.has(word)) {
        newWords.push(word);
        this.wordset.add(word);
      }
    });
    this.addACStateTreeNode(newWords);
  }

  private addACStateTreeNode(wordlist: string[]): void {
    const words = arrayDeduplication(wordlist);
    words.forEach((word) => {
      let currentNode = this.root;
      let len = word.length;
      for (let i = 0; i < len; i++) {
        currentNode.setChild({
          char: word[i],
          root: this.root,
          is_match: i === len - 1, // state match words end
        });
        // get next level
        currentNode = currentNode.getChild(word[i]);
      }
      // todo: fix this
      currentNode.isMatch = true;
    });
    // set backNode
    this.setBackNode();
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
  private setBackNode(): void {
    let currentNodeArr = this.root.getChildNodeList();
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
          let child = backNode.children[currentNode.char || ""];
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
  public search(text: string) {
    let words = [];
    let currentNode = this.root;
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
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
              word: backNode.getWord(),
            });
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
}
