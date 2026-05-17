import { describe, it, expect, vi, beforeEach } from "vitest"
import * as taxonService from "#modules/taxon/taxon.service.js"
import { updateLineage } from "./api.taxon.service.js"
import { EditMode } from "./api.taxon.types.js"
import { type Taxon, TaxonRank } from "#modules/taxon/taxon.domain.js"

// Helper pro validní Taxon
const makeTaxon = (partial: Partial<Taxon>): Taxon => ({
  id: "x",
  lineageIds: [],
  hasChildren: false,
  parentId: null,
  rank: TaxonRank.SPECIES,
  latin: "Test",
  cs: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...partial,
})

// Mock transakce
vi.mock("#infra/mongoose_orm/mongoose.withTransaction.js", () => ({
  withTransaction: async (fn: any) => fn(undefined),
}))

// Mock Zod schémat (aby nevalidovaly UUID)
vi.mock("#modules/taxon/taxon.schema.js", () => ({
  taxonUpdateSchema: {
    parse: (x: any) => x,
  },
  taxonCreateSchema: {
    parse: (x: any) => x,
  }
}))

// Mock taxon service
vi.mock("#modules/taxon/taxon.service.js", () => ({
  get: vi.fn(),
  update: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
  getChildCount: vi.fn().mockResolvedValue(0),
  listByParentId: vi.fn().mockResolvedValue([]),
  propagateLineageDown: vi.fn().mockResolvedValue(undefined),
}))

describe("updateLineage – REPLACE in the middle of lineage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("correctly replaces a taxon in the middle of lineage", async () => {
    const mockedGet = vi.mocked(taxonService.get)
    const mockedUpdate = vi.mocked(taxonService.update)
    const mockedRemove = vi.mocked(taxonService.remove)

    const kingdomId = "k1"
    const phylumId = "p1"
    const classId = "c1"
    const orderId = "o1"
    const familyId = "f1"
    const genusId = "g1"
    const speciesId = "s1"
    const newOrderId = "o2"

    // 1) species lineage
    mockedGet.mockResolvedValueOnce(
      makeTaxon({
        id: speciesId,
        lineageIds: [
          kingdomId,
          phylumId,
          classId,
          orderId,
          familyId,
          genusId,
          speciesId,
        ],
        rank: TaxonRank.SPECIES,
      })
    )

    // 2) new order lineage
    mockedGet.mockResolvedValue(
      makeTaxon({
        id: newOrderId,
        lineageIds: [kingdomId, phylumId, classId, newOrderId],
        rank: TaxonRank.ORDER,
      })
    )

    const inputs = [
      {
        lineageId: orderId,
        mode: EditMode.REPLACE,
        replaceId: newOrderId,
        data: { latin: "Nový název" },
      },
    ]

    const result = await updateLineage(speciesId, inputs)

    // výsledek je LineageRecord
    expect(result).toEqual({
      kingdomId,
      phylumId,
      classId,
      orderId: newOrderId,
    })

    // ověříme, že se update volal na správný taxon s parentId + latin
    expect(mockedUpdate).toHaveBeenCalledWith(
      newOrderId,
      expect.objectContaining({
        parentId: classId,
        latin: "Nový název",
      }),
      undefined
    )

    // ověříme, že se původní order odstranil
    expect(mockedRemove.mock.calls[0][0]).toBe(orderId)
  })
})
