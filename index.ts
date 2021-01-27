// node structure
export type ACTreeNode = {
	char?: string | null,
	status: number,
	backNode: ACTreeNode | null,
	parent: ACTreeNode | null,
	isMatch: boolean,
	children: ACTreeContainer,
	depth: number
}

// child container
export type ACTreeContainer = {
	[key: string]: ACTreeNode
}

export default class AhoCorasick {
	currentState: number;
	tireTreeRoot: ACTreeNode;
	currentWordSet: Set<string>;

	constructor(wordList: string[], ignorePatt?: RegExp) {
		this.currentState = 0;
		this.tireTreeRoot = {
			char: null,
			status: this.currentState,
			backNode: null,
			isMatch: false,
			parent: null,
			children: {},
			depth: 0
		}
		this.currentWordSet = new Set();
		const cleanedWordList = this.getFilterWordList(wordList, ignorePatt);
		// this.tireTreeRoot = this.addNewNode();
		this.addWordList(this.tireTreeRoot, cleanedWordList);
		this.setBackNode(this.tireTreeRoot);
		console.log(this.tireTreeRoot);
	}

	/**
	 * @param root 
	 * @param keywordList 
	 * set the tireTree path(get match success status)
	 */
	public addWordList(root: ACTreeNode, keywordList: string[]): void {
		keywordList.forEach(word => {
			let currentNode = root;
			let currentNodeSet = root.children;
			let len = word.length;
            for (let i = 0; i < len; i++) {
				// new path
                if (!currentNodeSet.hasOwnProperty(word[i])) {
                    currentNodeSet[word[i]] = {
                        char: word[i],
						status: ++this.currentState,
						// initial state. back to root node
						backNode: root,
						parent: currentNode,
                        isMatch: i === len - 1,
						children: {},
						depth: i
                    };
				}
				// get next level
                currentNode = currentNodeSet[word[i]];
                currentNodeSet = currentNodeSet[word[i]].children;
            }
		});
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
	public searchWord(text: string) {
		let words = [];
		let currentNode = this.tireTreeRoot;
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
				let backNode: ACTreeNode | null = child;
				while (backNode !== this.tireTreeRoot && backNode) {
					if (backNode.isMatch) {
						words.push({
							pos: [i],
							word: this.getWord(backNode)
						})
					}
					backNode = backNode.backNode
				}
				currentNode = child;
			}
		}
		return words;
	}

	/**
	 * @param wordList keyword list
	 * @param ignorePatt default clean all space
	 */
	private getFilterWordList(wordList: string[], ignorePatt?: RegExp): string[] {
		if (ignorePatt === undefined) {
			ignorePatt = /\s+/g;
		}
		// clean duplicated word
		const len = wordList.length;
		for (let i = 0; i < len; i++) {
			const nword = wordList[i].replace(ignorePatt as RegExp, '')
			if (nword.length > 0) {
				this.currentWordSet.add(nword)
			}
		}
		return Array.from(this.currentWordSet);
	}

	private getWord(node: ACTreeNode): string {
		let word = '';
		while (node?.parent && node.char) {
			word = node.char + word;
			node = node.parent
		}
		return word;
	}

	private getChildNodesArray(child: ACTreeContainer): ACTreeNode[] {
		return Object.keys(child).map(key => child[key]);
	}
}
