import { GET } from "../template-preview/route"
import { NextRequest } from "next/server"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))
jest.mock("@/lib/gtm/templates/render", () => {
  const actual = jest.requireActual("@/lib/gtm/templates/render")
  return {
    ...actual,
    findTemplate: jest.fn(() => ({
      id: "bold-stat-1x1", label: "Bold Stat", assetType: "social-post", aspectRatio: "1:1", description: "",
      slots: [{ key: "STAT", label: "", kind: "stat_number", maxChars: 4, example: "" }],
      sampleData: { STAT: "1%" },
    })),
    loadTemplateHtml: jest.fn(async () => `<b>{{STAT}}</b>`),
  }
})

import { requireGtmAuth } from "@/lib/gtm/content-types"

function req(qs: string) {
  return new NextRequest(`http://localhost/api/gtm/template-preview?${qs}`)
}

describe("GET /api/gtm/template-preview", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(requireGtmAuth as jest.Mock).mockResolvedValue(true)
  })

  it("returns 401 when requireGtmAuth rejects the request", async () => {
    ;(requireGtmAuth as jest.Mock).mockResolvedValueOnce(false)
    const res = await GET(req("assetType=social-post&templateId=bold-stat-1x1&pillar=general"))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe("Unauthorized")
  })

  it("returns 200 with rendered HTML when authenticated", async () => {
    const res = await GET(req("assetType=social-post&templateId=bold-stat-1x1&pillar=general"))
    expect(res.status).toBe(200)
    expect(res.headers.get("Content-Type")).toContain("text/html")
    const html = await res.text()
    expect(html).toContain("<b>1%</b>")
  })
})
