import { POST } from "../fill-template/route"
import { NextRequest } from "next/server"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))
jest.mock("@/lib/gtm/kv-store", () => ({ kv: { set: jest.fn(async () => undefined), get: jest.fn(async () => undefined) } }))
jest.mock("@vercel/blob", () => ({ put: jest.fn(async (p: string) => ({ url: `https://blob.test/${p}` })) }))
jest.mock("@/lib/gtm/templates/render", () => {
  const actual = jest.requireActual("@/lib/gtm/templates/render")
  return {
    ...actual,
    findTemplate: jest.fn(() => ({
      id: "bold-stat-1x1", label: "Bold Stat", assetType: "social-post", aspectRatio: "1:1", description: "",
      slots: [
        { key: "STAT", label: "", kind: "stat_number", maxChars: 4, example: "" },
        { key: "LABEL", label: "", kind: "eyebrow", maxChars: 40, example: "" },
      ],
      sampleData: { STAT: "1%" },
    })),
    loadTemplateHtml: jest.fn(async () => `<style>:root{--bg-image:{{BG_IMAGE}};--bg-opacity:{{BG_OPACITY}}}</style><b>{{STAT}}</b><i>{{LABEL}}</i>`),
  }
})

import { put } from "@vercel/blob"
import { kv } from "@/lib/gtm/kv-store"

const png = "data:image/png;base64," + Buffer.from("x").toString("base64")
const base = { templateId: "bold-stat-1x1", assetType: "social-post", pillar: "trade-shows", briefText: "A brief long enough to pass validation.", itemId: "draft-1" }

function req(body: unknown) {
  return new NextRequest("http://localhost/api/gtm/fill-template", { method: "POST", body: JSON.stringify(body) })
}

describe("POST /api/gtm/fill-template", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = "test"
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ content: [{ type: "text", text: JSON.stringify({ STAT: "94%" }) }] }),
    })) as unknown as typeof fetch
  })

  it("skips Claude when slots are supplied and renders them with media", async () => {
    const res = await POST(req({ ...base, slots: { STAT: "12345", EVIL: "x" }, bgImage: png, bgOpacity: 62 }))
    expect(res.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("<b>1234</b>")
    expect(stored).not.toContain("EVIL")
    expect(stored).toContain(`--bg-image:url("${png}")`)
    expect(stored).toContain("--bg-opacity:0.62")
    const data = await res.json()
    expect(data.slots).toEqual({ STAT: "1234" })
  })

  it("calls Claude when slots are absent and still applies media", async () => {
    const res = await POST(req({ ...base, bgImage: png, bgOpacity: 30 }))
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("<b>94%</b>")
    expect(stored).toContain("--bg-opacity:0.3")
  })

  it("renders the designed state (none / 1) when no media is sent", async () => {
    await POST(req(base))
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("--bg-image:none")
    expect(stored).toContain("--bg-opacity:1")
  })

  it("rejects a bad bgImage with 400", async () => {
    const res = await POST(req({ ...base, bgImage: "https://x/y.png" }))
    expect(res.status).toBe(400)
    expect(put).not.toHaveBeenCalled()
  })

  it("escapes override slot values in the stored HTML but returns them raw", async () => {
    const res = await POST(req({ ...base, slots: { STAT: "1%", LABEL: '<img src=x onerror=1>' } }))
    expect(res.status).toBe(200)
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).not.toContain("<img")
    expect(stored).toContain("&lt;img")
    const data = await res.json()
    expect(data.slots.LABEL).toBe('<img src=x onerror=1>')
  })

  it("escapes Claude-path values too (entities render as the same glyphs)", async () => {
    global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ content: [{ type: "text", text: JSON.stringify({ STAT: "9%", LABEL: "Tom & Jerry" }) }] }) })) as unknown as typeof fetch
    await POST(req(base))
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("<i>Tom &amp; Jerry</i>")
    expect(stored).not.toContain("<i>Tom & Jerry</i>")
  })

  it("renders bgOpacity 0 as 0, not the default", async () => {
    await POST(req({ ...base, bgImage: png, bgOpacity: 0 }))
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("--bg-opacity:0}")
  })

  it("caches the raw filtered slots in KV alongside the template id", async () => {
    await POST(req({ ...base, slots: { STAT: "12345" } }))
    const calls = (kv.set as jest.Mock).mock.calls.map((c) => c[0] as string)
    const slotsKey = calls.find((k) => k.endsWith(":slots"))
    expect(slotsKey).toBeDefined()
    const stored = (kv.set as jest.Mock).mock.calls.find((c) => c[0] === slotsKey)![1]
    expect(JSON.parse(stored)).toEqual({ STAT: "1234" })   // raw + truncated, not escaped
  })
})
