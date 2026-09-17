import { GET } from "../asset-check/route"
import { NextRequest } from "next/server"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))

const kvData: Record<string, string> = {
  "gtm:asset:trade-shows:social-post:draft-1": "https://blob.test/x.html",
  "gtm:asset:trade-shows:social-post:draft-1:template": "bold-stat-1x1",
  "gtm:asset:trade-shows:social-post:draft-1:slots": JSON.stringify({ STAT: "9%" }),
}

jest.mock("@/lib/gtm/kv-store", () => ({
  kv: { get: jest.fn(async (key: string) => (kvData as Record<string, string | undefined>)[key]) },
}))

function req(qs: string) {
  return new NextRequest(`http://localhost/api/gtm/asset-check?${qs}`)
}

describe("GET /api/gtm/asset-check", () => {
  it("returns exists, templateId, and parsed slots from KV", async () => {
    const res = await GET(req("solution=trade-shows&assetType=social-post&itemId=draft-1"))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.exists).toBe(true)
    expect(data.templateId).toBe("bold-stat-1x1")
    expect(data.slots).toEqual({ STAT: "9%" })
  })

  it("omits slots (but stays 200) when the cached value is not valid JSON", async () => {
    kvData["gtm:asset:trade-shows:social-post:draft-1:slots"] = "not json"
    const res = await GET(req("solution=trade-shows&assetType=social-post&itemId=draft-1"))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.exists).toBe(true)
    expect(data.slots).toBeUndefined()
  })
})
