export type Node<T> = {
  id: string
  hasChildren: boolean
  original: T
}

export type TreeConfig = {
  initialExpanded?: string[]
  initialSelected?: string[]
  multipleSelect?: boolean
}

export type TreeState<T> = {
  expanded: string[]
  selected: string[]
  toggle: (id: string) => void
  select: (node: Node<T>) => void
}

export type ChildrenResult<T> = {
  children: Node<T>[]
  loading: boolean
  error: Error | null
}

export type TreeNodeBase<T> = {
  state: TreeState<T>
  renderNode: (node: Node<T>) => React.ReactNode
  getChildren: (id: string) => ChildrenResult<T>
  onAction?: (node: Node<T>) => void
}
