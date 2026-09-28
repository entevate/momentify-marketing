import { GET } from "../carousel-download/route"
import { NextRequest } from "next/server"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))

const kvData: Record<string, string> = {}
jest.mock("@/lib/gtm/kv-store", () => ({
  kv: {
    get: jest.fn(async (key: string) => kvData[key]),
    set: jest.fn(async () => undefined),
  },
}))
jest.mock("@/lib/gtm/blob-url", () => ({
  resolveAssetUrl: jest.fn(async () => "https://blob.test/shell.html"),
  deterministicAssetUrl: jest.fn((_s: string, _t: string, id: string) => `https://blob.test/${id}.html`),
}))
// Keep dimensionsForAspect real (it is the mapping under test); stub only the
// headless-Chromium renderer.
jest.mock("@/lib/gtm/render-png", () => ({
  ...jest.requireActual("@/lib/gtm/render-png"),
  renderManyHtmlToPng: jest.fn(async (htmls: string[]) => htmls.map(() => Buffer.from("png"))),
}))

import { renderManyHtmlToPng } from "@/lib/gtm/render-png"

const KEY = "gtm:asset:trade-shows:carousel:item-1"
const cardUrls = Array.from({ length: 6 }, (_, i) => `https://blob.test/item-1_c${i + 1}.html`)

function req(qs = "solution=trade-shows&itemId=item-1&format=png") {
  return new NextRequest(`http://localhost/api/gtm/carousel-download?${qs}`)
}

describe("GET /api/gtm/carousel-download", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    for (const k of Object.keys(kvData)) delete kvData[k]
    kvData[`${KEY}:cards`] = JSON.stringify(cardUrls)
    global.fetch = jest.fn(async (u: string) => ({
      ok: true,
      url: u,
      text: async () => `<html>${u}</html>`,
    })) as unknown as typeof fetch
  })

  it("renders a 4:5 carousel's cards at 1080x1350", async () => {
    kvData[`${KEY}:aspect`] = "4:5"
    kvData[`${KEY}:template`] = "bold-stat-34"
    const res = await GET(req())
    expect(res.status).toBe(200)
    expect(res.headers.get("Content-Type")).toBe("application/zip")
    expect(renderManyHtmlToPng).toHaveBeenCalledTimes(1)
    const [htmls, size] = (renderManyHtmlToPng as jest.Mock).mock.calls[0]
    expect(htmls).toHaveLength(6)
    expect(size).toEqual({ width: 1080, height: 1350 })
  })

  it("derives 4:5 from the template when the aspect record is missing", async () => {
    kvData[`${KEY}:template`] = "headline-quote-34"
    await GET(req())
    expect((renderManyHtmlToPng as jest.Mock).mock.calls[0][1]).toEqual({ width: 1080, height: 1350 })
  })

  it("renders a legacy item with no aspect or template at 1080x1080", async () => {
    const res = await GET(req())
    expect(res.status).toBe(200)
    expect((renderManyHtmlToPng as jest.Mock).mock.calls[0][1]).toEqual({ width: 1080, height: 1080 })
  })

  it("renders a 1:1 template item at 1080x1080", async () => {
    kvData[`${KEY}:template`] = "bold-stat-1x1"
    kvData[`${KEY}:aspect`] = "1:1"
    await GET(req())
    expect((renderManyHtmlToPng as jest.Mock).mock.calls[0][1]).toEqual({ width: 1080, height: 1080 })
  })

  it("skips the renderer for format=html", async () => {
    kvData[`${KEY}:aspect`] = "4:5"
    const res = await GET(req("solution=trade-shows&itemId=item-1&format=html"))
    expect(res.status).toBe(200)
    expect(renderManyHtmlToPng).not.toHaveBeenCalled()
  })
})
