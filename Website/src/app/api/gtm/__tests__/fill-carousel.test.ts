import { POST } from "../fill-carousel/route"
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
      slots: [{ key: "TXT", label: "", kind: "headline", maxChars: 60, example: "" }],
      sampleData: { TXT: "x" },
    })),
    loadTemplateHtml: jest.fn(async () => `<b>{{TXT}}</b>`),
  }
})

import { put } from "@vercel/blob"
import { kv } from "@/lib/gtm/kv-store"

const png = "data:image/png;base64," + Buffer.from("x").toString("base64")
const base = { templateId: "bold-stat-1x1", pillar: "trade-shows", briefText: "A brief long enough to pass validation.", itemId: "draft-1" }
const CARD_COUNT = 6

function req(body: unknown) {
  return new NextRequest("http://localhost/api/gtm/fill-carousel", { method: "POST", body: JSON.stringify(body) })
}

function cardHtmls() {
  return (put as jest.Mock).mock.calls.slice(0, CARD_COUNT).map((c) => c[1] as string)
}

describe("POST /api/gtm/fill-carousel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = "test"
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: JSON.stringify({ cards: Array.from({ length: CARD_COUNT }, (_, i) => ({ TXT: `card${i}` })) }) }],
      }),
    })) as unknown as typeof fetch
  })

  it("skips Claude when a 6-card override is supplied, escapes each card's HTML, returns raw cards", async () => {
    const cards = Array.from({ length: CARD_COUNT }, (_, i) => ({ TXT: `<s>${i}</s>` }))
    const res = await POST(req({ ...base, cards }))
    expect(res.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
    for (const html of cardHtmls()) {
      expect(html).toContain("&lt;s&gt;")
      expect(html).not.toContain("<s>")
    }
    const data = await res.json()
    expect(data.cards).toEqual(cards)
  })

  it("rejects a cards override with the wrong length", async () => {
    const cards = Array.from({ length: 5 }, (_, i) => ({ TXT: `card${i}` }))
    const res = await POST(req({ ...base, cards }))
    expect(res.status).toBe(400)
    expect(put).not.toHaveBeenCalled()
  })

  it("escapes Claude-path card values", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{
          type: "text",
          text: JSON.stringify({ cards: Array.from({ length: CARD_COUNT }, (_, i) => ({ TXT: i === 0 ? "Tom & Jerry" : `card${i}` })) }),
        }],
      }),
    })) as unknown as typeof fetch
    const res = await POST(req(base))
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const htmls = cardHtmls()
    expect(htmls[0]).toContain("Tom &amp; Jerry")
    expect(htmls[0]).not.toContain("Tom & Jerry")
  })

  it("rejects a bad bgImage with 400", async () => {
    const res = await POST(req({ ...base, bgImage: "https://x/y.png" }))
    expect(res.status).toBe(400)
    expect(put).not.toHaveBeenCalled()
  })

  it("caches the raw filtered cards in KV alongside the template id", async () => {
    const cards = Array.from({ length: CARD_COUNT }, (_, i) => ({ TXT: `card${i}` }))
    await POST(req({ ...base, cards }))
    const calls = (kv.set as jest.Mock).mock.calls.map((c) => c[0] as string)
    const slotsKey = calls.find((k) => k.endsWith(":slots"))
    expect(slotsKey).toBeDefined()
    const stored = (kv.set as jest.Mock).mock.calls.find((c) => c[0] === slotsKey)![1]
    expect(JSON.parse(stored)).toEqual(cards)   // raw array of 6, not escaped
  })
})

describe("POST /api/gtm/fill-carousel hidden slots", () => {
  const cards = Array.from({ length: CARD_COUNT }, (_, i) => ({ TXT: `card${i}` }))
  const noneHidden = Array.from({ length: CARD_COUNT }, () => [] as string[])

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = "test"
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: JSON.stringify({ cards: Array.from({ length: CARD_COUNT }, (_, i) => ({ TXT: `ai${i}` })) }) }],
      }),
    })) as unknown as typeof fetch
  })

  it("hides a slot on the one card that asked for it, leaving the others intact", async () => {
    const hidden = noneHidden.map((_, i) => (i === 2 ? ["TXT"] : []))
    const res = await POST(req({ ...base, cards, hidden }))
    expect(res.status).toBe(200)
    const htmls = cardHtmls()
    expect(htmls[2]).toContain("<b></b>")
    expect(htmls[2]).not.toContain("card2")
    expect(htmls[2]).toContain('[data-slot="TXT"]{display:none !important}')
    expect(htmls[0]).toContain("<b>card0</b>")
    expect(htmls[0]).not.toContain("display:none")
  })

  it("applies per-card hidden on the Claude path too", async () => {
    const hidden = noneHidden.map((_, i) => (i === 0 ? ["TXT"] : []))
    const res = await POST(req({ ...base, hidden }))
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const htmls = cardHtmls()
    expect(htmls[0]).not.toContain("ai0")
    expect(htmls[0]).toContain('[data-slot="TXT"]{display:none !important}')
    expect(htmls[1]).toContain("<b>ai1</b>")
  })

  it("drops non-manifest keys per card", async () => {
    const hidden = noneHidden.map((_, i) => (i === 1 ? ["EVIL", "TXT"] : ["EVIL"]))
    const res = await POST(req({ ...base, cards, hidden }))
    const data = await res.json()
    expect(data.hidden).toEqual(noneHidden.map((_, i) => (i === 1 ? ["TXT"] : [])))
    for (const html of cardHtmls()) expect(html).not.toContain("EVIL")
  })

  it("echoes hidden in the response and writes it to KV", async () => {
    const hidden = noneHidden.map((_, i) => (i === 5 ? ["TXT"] : []))
    const res = await POST(req({ ...base, cards, hidden }))
    expect((await res.json()).hidden).toEqual(hidden)
    const call = (kv.set as jest.Mock).mock.calls.find((c) => (c[0] as string).endsWith(":hidden"))
    expect(call).toBeDefined()
    expect(JSON.parse(call![1])).toEqual(hidden)
  })

  it("treats a wrong-shaped hidden as nothing hidden, byte-identically", async () => {
    await POST(req({ ...base, cards }))
    const withoutHidden = cardHtmls()
    jest.clearAllMocks()
    const res = await POST(req({ ...base, cards, hidden: ["TXT"] }))   // wrong length
    expect(cardHtmls()).toEqual(withoutHidden)
    expect(withoutHidden[0]).not.toContain("display:none")
    expect((await res.json()).hidden).toEqual(noneHidden)
  })

  it("defaults to six empty arrays when hidden is absent", async () => {
    const res = await POST(req({ ...base, cards }))
    expect((await res.json()).hidden).toEqual(noneHidden)
  })
})
