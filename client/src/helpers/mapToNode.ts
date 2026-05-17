import type { Taxon } from '../types/Taxon'
import type { Node } from '#components/tree/types.ts'

export const mapToNode = <T extends Taxon>(t: T): Node<T> => ({
  id: t.id,
  hasChildren: t.hasChildren,
  original: t
})
