import type { Node } from '#components/tree/types.ts'

export const sortNodesByPath = <T,>(nodes: Node<T>[], path: string[]) => {
  return [...nodes].sort((a, b) => {
    const aInPath = path.includes(a.id)
    const bInPath = path.includes(b.id)
    if (aInPath !== bInPath) return aInPath ? -1 : 1
    return a.id.localeCompare(b.id, 'cs', { sensitivity: 'base' })
  })
}

export const getNodesforPath = <T,>(nodeMap: Map<string, Node<T>[]>, path: string[]) => {
  const pathNodes: Node<T>[] = []

  path.forEach((parentId, index) => {
    const nextId = path[index + 1]
    const children = nodeMap.get(parentId) ?? []
    if (children.length > 0) {
      const node = children.find(n => n.id === nextId)
      if (node) pathNodes.push(node)
    }
  })

  return pathNodes
}
