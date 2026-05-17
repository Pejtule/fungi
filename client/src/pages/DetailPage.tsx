import { Suspense, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useMushroomDetail, mushroomQueryConfig } from '#hooks/useMushroom.ts'
import { useInitialTreeNodes } from '#hooks/useTaxonNodes.ts'
import { useTaxonTree } from '#hooks/useTaxonTree.tsx'
import { getNodesforPath } from '../helpers/nodes'
import { DetailPageLoading } from '../loaders/DetailPageLoading'
import { PanelLayout } from '../layouts/PanelLayout'
import { SectionsLayout } from '../layouts/SectionsLayout'
import { Tree } from '#components/tree/Tree.tsx'
import { SheetTrigger } from '#components/SheetTrigger.tsx'
import type { Taxon } from '../types/Taxon'
import type { Node } from '#components/tree/types.ts'
import { t } from '../t'

export const DetailPage = () => (
  <Suspense fallback={<DetailPageLoading />}>
    <Detail />
  </Suspense>
)

export const Detail = () => {
  const { id } = useParams()
  if (!id) throw new Error('Missing detail ID.')

  const { tree, sections } = useDetail(id)

  return (
    <PanelLayout
      renderPanel={() => <Tree {...tree} />}
      renderContent={({ trigger }) => (
        <>
          <SectionsLayout {...sections} />
          {trigger}
        </>
      )}
      renderTrigger={(props) => (
        <SheetTrigger label={t.detail.taxonomy} {...props} />
      )}
    />
  )
}

export function useDetail(id: string) {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const handleAction = useCallback(async (node: Node<Taxon>) => {
    if (node.original.rank !== 'species') return

    const mushroom = await qc.ensureQueryData(mushroomQueryConfig(`${node.id}?speciesId=true`))
    navigate(`/mushrooms/${mushroom.id}`, { state: mushroom })
  }, [qc, navigate])

  const detail = useMushroomDetail(id)
  if (!detail) throw new Error('Missing mushroom detail data.')
  const { sections, lineageIds, speciesId } = detail

  const initialNodes = useInitialTreeNodes(lineageIds, speciesId)
  if (!initialNodes) throw new Error('Missing initial nodes data.')

  const treeConfig = {
    initialExpanded: lineageIds,
    initialSelected: [speciesId]
  }

  return {
    tree: { ...useTaxonTree(initialNodes, treeConfig), onAction: handleAction },
    sections: {
      lineage: getNodesforPath(initialNodes, ['roots', ...lineageIds, speciesId]),
      ...sections,
    }
  }
}
