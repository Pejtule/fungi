import { useSuspenseQuery, useInfiniteQuery, type QueryFunctionContext } from '@tanstack/react-query'
import { getMushroom, getMushrooms } from '../api/mushroom.api'
import { mapToDetail } from '../helpers/mapToDetail'
import type { MushroomDetail, MushroomList } from '../types/Mushroom'

export function mushroomQueryConfig(id: string, suspense = false) {
  return {
    queryKey: ['mushroom', id] as const,
    queryFn: ({ signal }: QueryFunctionContext) => getMushroom(id, { signal }),
    select: (data: MushroomDetail) => mapToDetail(data),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    suspense: suspense,
    throwOnError: true,
  }
}

export function useMushroomDetail(id: string) {
  const query = useSuspenseQuery({
    ...mushroomQueryConfig(id, true)
  })
  return query.data
}

export function mushroomInfiniteConfig(filters: Record<string, string[] | undefined>) {
  return {
    queryKey: ['mushrooms', filters],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0, signal }: QueryFunctionContext) =>
      getMushrooms(12, pageParam as number, filters, { signal }),
    getNextPageParam: (lastPage: MushroomList) => lastPage.nextOffset ?? undefined,
    retry: false,
    gcTime: Infinity,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    throwOnError: true,
  }
}

export function useMushroomsInfiniteQuery(filters: Record<string, string[] | undefined>) {
  return useInfiniteQuery(mushroomInfiniteConfig(filters))
}
