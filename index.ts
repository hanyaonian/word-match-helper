// node structure
type ACTreeNode = {
	char?: string | null,
	status: number,
	backNode: ACTreeNode | null,
	parent: ACTreeNode | null,
	isMatch: boolean,
	children: ACTreeContainer,
}

// child container
type ACTreeContainer = {
	[key: string]: ACTreeNode
}

type searchResult = {
	pos: number,
	word: string
}

type matchOptions = {
	ignorePatt?: RegExp | null,
	baseStrict?: boolean 
} 

export default class AhoCorasick {
	currentState: number;
	tireTreeRoot: ACTreeNode;
	currentWordSet: Set<string>;
	toLowerCase: boolean;
	/**
	 * default is /\s+/g, skip all space
	 */
	regPattern: RegExp;

	/**
	 * @param wordList initial word list
	 * @param ignorePatt Reg pattern
	 */
	constructor(wordList: string[], { ignorePatt = /\0/g, baseStrict = false }: matchOptions = {}) {
		this.currentState = 0;
		// \0 means match null (U+0000)
		this.regPattern = ignorePatt ? ignorePatt : /\0/g;
		this.toLowerCase = !baseStrict;
		if (typeof ignorePatt != typeof RegExp) {
			// throw Error('wrong type regexp')
		}
		this.tireTreeRoot = {
			char: null,
			status: this.currentState,
			backNode: null,
			isMatch: false,
			parent: null,
			children: {},
		}
		this.currentWordSet = new Set();
		const cleanedWordList = this.getFilterWordList(wordList);
		// this.tireTreeRoot = this.addNewNode();
		this.addWordList(cleanedWordList);
	}


	/**
	 * @param keywordList public method for additional word
	 */
	public addWord(keywordList: string[]): void {
		this.addWordList(this.getFilterWordList(keywordList));
	}


	/**
	 * @param root 
	 * @param keywordList 
	 * set the tireTree path(get match success status)
	 */
	private addWordList(keywordList: string[]): void {
		keywordList.forEach(word => {
			let currentNode = this.tireTreeRoot;
			let currentNodeSet = this.tireTreeRoot.children;
			let len = word.length;
            for (let i = 0; i < len; i++) {
				// new path
                if (!currentNodeSet.hasOwnProperty(word[i])) {
                    currentNodeSet[word[i]] = {
                        char: word[i],
						status: ++this.currentState,
						// initial state. back to root node
						backNode: this.tireTreeRoot,
						parent: currentNode,
                        isMatch: i === len - 1,
						children: {},
                    };
				}
				// get next level
                currentNode = currentNodeSet[word[i]];
                currentNodeSet = currentNodeSet[word[i]].children;
			}
			currentNode.isMatch = true;
		});
		// set backNode
		this.setBackNode(this.tireTreeRoot);
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
	private setBackNode(root: ACTreeNode): void {
		let currentNodeArr = this.getChildNodesArray(root.children);
		while (currentNodeArr.length > 0) {
			let childNodeArr = [];
			for (let i = 0; i < currentNodeArr.length; i++) {
				let currentNode = currentNodeArr[i];
				// collect all child node
				childNodeArr.push(...this.getChildNodesArray(currentNode.children))
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
	public search(text: string): searchResult[] {
		text = this.toLowerCase ? text.toLocaleLowerCase() : text;
		let words = [];
		let currentNode = this.tireTreeRoot;
		for (let i = 0; i < text.length; i++) {
			let char = text[i];
			// skip
			if (char.match(this.regPattern)) {
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
				let backNode: ACTreeNode = child;
				while (backNode && backNode !== this.tireTreeRoot) {
					if (backNode.isMatch) {
						words.push({
							pos: i + 1,
							word: this.getWord(backNode)
						})
					}
					backNode = backNode.backNode as ACTreeNode;
				}
				currentNode = child;
			} else {
				currentNode = this.tireTreeRoot; // initial state
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
					(wordArr[pos - moved] === replacement && !wordArr[pos - moved].match(this.regPattern))
				) {
					i -= 1;
				}
				moved += 1;
			}
			wordArr.splice(pos - moved + 1, moved, ...new Array(moved).fill(replacement));
		})
		return wordArr.join('');
	}

	/**
	 * @param wordList keyword list
	 * @param ignorePatt default clean all space
	 */
	private getFilterWordList(wordList: string[]): string[] {
		let ignorePatt = this.regPattern;
		// clean duplicated word
		const len = wordList.length;
		for (let i = 0; i < len; i++) {
			const nword = wordList[i].replace(ignorePatt as RegExp, '')
			if (nword.length > 0) {
				this.currentWordSet.add(this.toLowerCase ? nword.toLocaleLowerCase() : nword);
			}
		}
		return Array.from(this.currentWordSet);
	}

	private getWord(node: ACTreeNode): string {
		let word = '';
		while (node.parent && node.char) {
			word = node.char + word;
			node = node.parent
		}
		return word;
	}

	private getChildNodesArray(child: ACTreeContainer): ACTreeNode[] {
		return Object.keys(child).map(key => child[key]);
	}
}
