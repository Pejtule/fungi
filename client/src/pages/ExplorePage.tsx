import { Suspense, useCallback, useMemo, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useInitialTreeNodes } from '#hooks/useTaxonNodes.ts'
import { useTaxonTree } from '#hooks/useTaxonTree.tsx'
import { useInfiniteList } from '#hooks/useInfiniteList.ts'
import { buildFilters } from '../helpers/buildFilters.ts'
import { ExplorePageLoading } from '../loaders/ExplorePageLoading.tsx'
import { PanelLayout } from '../layouts/PanelLayout'
import { InfiniteListLayout } from '../layouts/InfiniteListLayout'
import { Tree } from '#components/tree/Tree.tsx'
import { Card } from '../components/Card'
import { SheetTrigger } from '../components/SheetTrigger.tsx'
import { EmptyState } from '../components/EmptyState.tsx'
import { SkeletonCard } from '../components/SkeletonCard.tsx'
import type { Taxon } from '../types/Taxon.ts'
import type { Node } from '#components/tree/types.ts'
import { t } from '../t'

export const ExplorePage = () => (
  <>
    <Suspense fallback={<ExplorePageLoading />}>
      <Explore />
    </Suspense>

    <Outlet />
  </>
)

export const Explore = () => {
  const { tree, list } = useExplore()

  return (
    <PanelLayout
      renderPanel={() => <aside><Tree {...tree} /></aside>}
      renderContent={({ trigger }) => (
        <main>
          <InfiniteListLayout
            renderItem={(card) => <Link to={card.id}><Card {...card} /></Link>}
            renderLoadingMore={() => <SkeletonCard />}
            renderEmpty={() => <EmptyState text={t.explore.empty} />}
            renderError={() => <EmptyState text={t.explore.error} />}
            {...list}
          />
          {trigger}
        </main>
      )}
      renderTrigger={(props) => <SheetTrigger label={t.explore.filters} {...props} />}
    />
  )
}

export function useExplore() {
  const [selectedTaxa, setSelectedTaxa] = useState<Taxon[]>([])

  const filters: Record<string, string[]> = useMemo(() => {
    return buildFilters(selectedTaxa)
  }, [selectedTaxa])

  const handleAction = useCallback((node: Node<Taxon>) => {
    if (node.original.rank === 'kingdom') return

    setSelectedTaxa(prev =>
      prev.some(x => x.id === node.id)
        ? prev.filter(x => x.id !== node.id)
        : [...prev, node.original]
    )
  }, [])

  const initialNodes = useInitialTreeNodes()
  if (!initialNodes) throw new Error('Missing initial nodes data.')

  const treeConfig = {
    initialExpanded: initialNodes.get('roots')?.map(t => t.id),
    multipleSelect: true
  }

  return {
    tree: { ...useTaxonTree(initialNodes, treeConfig), onAction: handleAction },
    list: useInfiniteList(filters)
  }
}
