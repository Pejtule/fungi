import { useState, useCallback } from 'react'
import type { Node, TreeConfig, TreeState } from './types'

export function useTreeState<T>(config: TreeConfig): TreeState<T> {
  const { initialExpanded = [], initialSelected = [], multipleSelect = false } = config
  
  const [expanded, setExpanded] = useState<string[]>(initialExpanded)
  const [selected, setSelected] = useState<string[]>(initialSelected)

  const toggle = useCallback((id: string) => {
    setExpanded(prev => 
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
    if (!multipleSelect) setSelected([id])
  }, [])

  const select = useCallback((node: Node<T>) => {
    if (multipleSelect) {
      setSelected(prev => 
        prev.includes(node.id)
          ? prev.filter(x => x !== node.id)
          : [...prev, node.id]
      ) 
    } else {
      setSelected([node.id])
    }
  }, [])

  return { expanded, selected, toggle, select }
}
