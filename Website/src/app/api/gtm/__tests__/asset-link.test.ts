import { POST } from "../asset-link/route"
import { NextRequest } from "next/server"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))

const FROM = "gtm:asset:trade-shows:carousel:draft-1"
const TO = "gtm:asset:trade-shows:carousel:lib-1"
const kvData: Record<string, string> = {}
jest.mock("@/lib/gtm/kv-store", () => ({
  kv: {
    get: jest.fn(async (key: string) => kvData[key]),
    set: jest.fn(async (key: string, v: string) => { kvData[key] = v }),
  },
}))

function req(body: unknown) {
  return new NextRequest("http://localhost/api/gtm/asset-link", { method: "POST", body: JSON.stringify(body) })
}

describe("POST /api/gtm/asset-link", () => {
  beforeEach(() => {
    for (const k of Object.keys(kvData)) delete kvData[k]
  })

  it("carries a carousel's aspect, template, cards, slots, and hidden to the library id", async () => {
    Object.assign(kvData, {
      [FROM]: "https://blob.test/shell.html",
      [`${FROM}:template`]: "bold-stat-34",
      [`${FROM}:aspect`]: "4:5",
      [`${FROM}:cards`]: JSON.stringify(["https://blob.test/draft-1_c1.html"]),
      [`${FROM}:slots`]: "[]",
      [`${FROM}:hidden`]: "[]",
    })
    const res = await POST(req({ pillar: "trade-shows", assetType: "carousel", fromItemId: "draft-1", toItemId: "lib-1" }))
    expect(res.status).toBe(200)
    expect(kvData[TO]).toBe("https://blob.test/shell.html")
    expect(kvData[`${TO}:template`]).toBe("bold-stat-34")
    expect(kvData[`${TO}:aspect`]).toBe("4:5")
    expect(kvData[`${TO}:cards`]).toBe(kvData[`${FROM}:cards`])
    expect(kvData[`${TO}:slots`]).toBe("[]")
    expect(kvData[`${TO}:hidden`]).toBe("[]")
  })

  it("skips side records the source never had (legacy item)", async () => {
    kvData[FROM] = "https://blob.test/shell.html"
    const res = await POST(req({ pillar: "trade-shows", assetType: "carousel", fromItemId: "draft-1", toItemId: "lib-1" }))
    expect(res.status).toBe(200)
    expect(Object.keys(kvData).filter((k) => k.startsWith(TO))).toEqual([TO])
  })
})
