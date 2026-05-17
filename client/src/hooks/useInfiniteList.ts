import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { mushroomInfiniteConfig, useMushroomsInfiniteQuery } from './useMushroom'
import { mapToCard } from '../helpers/mapToCard'

export function useInfiniteList(filters: Record<string, string[]>) {
  const qc = useQueryClient()
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError } = useMushroomsInfiniteQuery(filters)
  const mushrooms = data?.pages.flatMap(p => p.items) ?? []
  const isVisibleSentinel = hasNextPage && !isFetchingNextPage
  const total = data?.pages[0].total ?? 0
  const nextOffset = data?.pages[data?.pages.length - 1].nextOffset

  useEffect(() => {
    if (!hasNextPage || nextOffset === null) return
    qc.prefetchInfiniteQuery({
      ...mushroomInfiniteConfig(filters),
      initialPageParam: nextOffset,
    })
  }, [hasNextPage, nextOffset, filters, qc])

  const onIntersect = useCallback(() => {
    if (!hasNextPage) return
    if (isFetchingNextPage) return

    fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    items: mushrooms.map(mapToCard),
    isError,
    onIntersect,
    isFetchingNextPage,
    isVisibleSentinel,
    total,
  }
}
