import { useElementWidth } from '../hooks/shared/useElementWidth'
import { useIntersectionObserver } from '../hooks/shared/useIntersectionObserver'

export type InfiniteListItem = { id: string | number }

export type InfiniteListLayoutProps<T extends InfiniteListItem> = {
  items: T[]
  isError: boolean
  isFetchingNextPage: boolean
  isVisibleSentinel: boolean
  onIntersect: () => void
  renderItem: (item: T) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderError?: () => React.ReactNode
  renderLoadingMore?: () => React.ReactNode
}

const ui = {
  list: 'w-full grid gap-2 p-2',
  item: 'aspect-square w-full h-full',
  empty: '[grid-column:1/-1]'
}

export function InfiniteListLayout<T extends InfiniteListItem>({
  items,
  isError,
  renderItem,
  isFetchingNextPage,
  isVisibleSentinel,
  onIntersect,
  renderError,
  renderEmpty,
  renderLoadingMore
}: InfiniteListLayoutProps<T>) {
  const loaderRef = useIntersectionObserver(onIntersect)
  const { ref, width } = useElementWidth<HTMLUListElement>()
  const cardWidth = 255
  const columns = Math.max(1, Math.floor(width / cardWidth))

  if (isError && renderError) return renderError()

  if (items.length === 0 && renderEmpty) {
    return (
      <ul ref={ref} className={ui.list} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        <li className={ui.empty}>{renderEmpty()}</li>
      </ul>
    )
  }

  return (
    <ul ref={ref} className={ui.list} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map((item) => (
        <li key={item.id} className={ui.item}>{renderItem(item)}</li>
      ))}
      {isFetchingNextPage && renderLoadingMore && <li>{renderLoadingMore()}</li>}
      {isVisibleSentinel && <li style={{ height: 1 }} ref={loaderRef}></li>}
    </ul>
  )
}
