import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { taxonChildrenQueryConfig } from './useTaxonNodes.ts'
import { useTreeState } from '../components/tree/useTreeState.ts'
import { mapToNode } from '../helpers/mapToNode.ts'
import { NodeLabel } from '#components/tree/NodeLabel.tsx'
import type { Node, ChildrenResult, TreeConfig } from '../components/tree/types.ts'
import type { Taxon } from '../types/Taxon.ts'

export function useTaxonTree(initialPathNodes: Map<string, Node<Taxon>[]>, config: TreeConfig = {}) {
  const state = useTreeState(config)
  const qc = useQueryClient()

  const toggle = useCallback(async (id: string) => {
    await qc.ensureQueryData(taxonChildrenQueryConfig(id))
    state.toggle(id)
  }, [qc, state])

  const getChildren = useCallback((id: string): ChildrenResult<Taxon> => {
    if (initialPathNodes?.has(id)) {
      return {
        children: initialPathNodes.get(id) ?? [],
        loading: false,
        error: null
      }
    }

    const { queryKey } = taxonChildrenQueryConfig(id)
    const raw = qc.getQueryData<Taxon[]>(queryKey) ?? []
    const qState = qc.getQueryState(queryKey)

    return {
      children: raw.map(mapToNode),
      loading: qState?.fetchStatus === 'fetching',
      error: qState?.status === 'error' ? (qState.error as Error) : null
    }
  }, [qc, initialPathNodes])

  const renderNode = useCallback((node: Node<Taxon>) => {
    return <NodeLabel label={node.original.latin} isHeader={!node.original.parentId} />
  }, [])


  return { state: { ...state, toggle }, getChildren, renderNode }
}
