import { useSuspenseQuery, useSuspenseQueries, type QueryFunctionContext } from '@tanstack/react-query'
import { getTaxonChildren } from '../api/taxon.api'
import { mapToNode } from '../helpers/mapToNode'
import { sortNodesByPath } from '../helpers/nodes'
import type { Taxon } from '../types/Taxon'
import type { Node } from '#components/tree/types.ts'

export function taxonChildrenQueryConfig(id: string | null, suspense = false) {
  return {
    queryKey: ['children', id] as const,
    queryFn: ({ signal }: QueryFunctionContext) => getTaxonChildren(id, { signal }),
    select: (data: Taxon[]): Node<Taxon>[] => data.map(mapToNode),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    suspense: suspense,
    throwOnError: true,
  }
}

export function useInitialTreeNodes(lineageIds: string[] = [], leafId: string = '') {
  const rootsQuery = useSuspenseQuery(taxonChildrenQueryConfig(null, true))

  const parentIds =
    lineageIds.length > 0
      ? lineageIds
      : rootsQuery.data.map(n => n.id)

  const childrenQueries = useSuspenseQueries({
    queries: parentIds.map(id => ({
      ...taxonChildrenQueryConfig(id, true),
      enabled: parentIds.length > 0
    }))
  })

  const map = new Map<string, Node<Taxon>[]>()
  map.set('roots', rootsQuery.data)

  parentIds.forEach((parentId, index) => {
    const q = childrenQueries[index]
    const children =
      lineageIds.length > 0
        ? sortNodesByPath(q.data, [...lineageIds, leafId])
        : q.data

    map.set(parentId, children)
  })

  return map
}
