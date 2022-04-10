// node structure
export type ACTreeNode = {
  char?: string | null,
  status: number,
  backNode: ACTreeNode | null,
  parent: ACTreeNode | null,
  isMatch: boolean,
  children: ACTreeContainer,
}

// child container
export type ACTreeContainer = {
  [key: string]: ACTreeNode
}

export type SearchResult = {
  pos: number,
  word: string
}

export type Options = {
  targets: string[],
  ignorePatt?: RegExp | null,
  baseStrict?: boolean
} 