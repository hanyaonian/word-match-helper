import { isDef } from "./utils";

export class Node {
  char: string | null;
  isMatch: boolean = false;
  parent: Node | null = null;
  backNode: Node | null = null;
  children: Record<string, Node> = {};

  constructor(params: {
    char: string | null;
    parent?: Node;
    back_node?: Node;
    is_match?: boolean;
  }) {
    this.char = params.char;
    this.isMatch = params.is_match ?? false;
    this.parent = params.parent ?? null;
    this.backNode = params.back_node ?? null;
  }

  public getChildNodeList(): Node[] {
    const result: Node[] = [];
    Object.keys(this.children).forEach(key => {
      result.push(this.children[key]);
    });
    return result;
  }

  public setChildren(params: {
    char: string,
    root: Node,
    is_match: boolean,
  }) {
    const { char, root, is_match } = params;
    if (!isDef(this.children[char])) {
      this.children[char] = new Node({
        char,
        is_match,
        parent: this,
        back_node: root,
      });
    }
    return this.children[char];
  }
}
