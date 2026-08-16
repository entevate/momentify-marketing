import { assetTypeForContentType } from "@/lib/gtm/asset-type-map"

describe("assetTypeForContentType", () => {
  it("maps social content types to social-post", () => {
    expect(assetTypeForContentType("linkedin-post")).toBe("social-post")
    expect(assetTypeForContentType("social-post")).toBe("social-post")
  })
  it("maps carousel to carousel", () => {
    expect(assetTypeForContentType("carousel")).toBe("carousel")
    expect(assetTypeForContentType("linkedin-carousel")).toBe("carousel")
  })
  it("maps long-form types to their asset type", () => {
    expect(assetTypeForContentType("infographic")).toBe("infographic")
    expect(assetTypeForContentType("one-pager")).toBe("one-pager")
    expect(assetTypeForContentType("microsite")).toBe("microsite")
    expect(assetTypeForContentType("pitch-deck")).toBe("pitch-deck")
  })
  it("maps long-form types via substring match", () => {
    expect(assetTypeForContentType("sales-onepager")).toBe("one-pager")
    expect(assetTypeForContentType("acme-microsite")).toBe("microsite")
    expect(assetTypeForContentType("q3-infographic")).toBe("infographic")
    expect(assetTypeForContentType("sales-pitch")).toBe("pitch-deck")
    expect(assetTypeForContentType("slide-deck")).toBe("pitch-deck")
  })
  it("falls back to social-post for unknown types", () => {
    expect(assetTypeForContentType("tweet")).toBe("social-post")
    expect(assetTypeForContentType("")).toBe("social-post")
  })
  it("does not resolve prototype-chain keys", () => {
    expect(assetTypeForContentType("constructor")).toBe("social-post")
  })
})

import { PUT } from "../content/[id]/route"
import { NextRequest } from "next/server"

// Mock the KV store and auth
jest.mock("@/lib/gtm/kv-store", () => {
  const store = new Map<string, unknown>()
  return {
    __store: store,
    kv: {
      get: jest.fn(async (k: string) => store.get(k) ?? null),
      set: jest.fn(async (k: string, v: unknown) => { store.set(k, v) }),
    },
  }
})
jest.mock("@/lib/gtm/content-types", () => {
  const actual = jest.requireActual("@/lib/gtm/content-types")
  return { ...actual, requireGtmAuth: jest.fn(async () => true) }
})

describe("PUT /api/gtm/content/[id]", () => {
  const { kv } = jest.requireMock("@/lib/gtm/kv-store")
  beforeEach(async () => {
    await kv.set("gtm:content:c1", {
      id: "c1", contentType: "linkedin-post", motion: "direct",
      solution: "trade-shows", content: "old brief", tags: [], createdAt: "2026-01-01T00:00:00Z",
    })
  })

  it("shallow-merges the patch and preserves id/createdAt", async () => {
    const req = new NextRequest("http://localhost/api/gtm/content/c1", {
      method: "PUT",
      body: JSON.stringify({ content: "new brief", kept: true, blobUrl: "https://blob/x.html", assetType: "social-post" }),
    })
    const res = await PUT(req, { params: Promise.resolve({ id: "c1" }) })
    expect(res.status).toBe(200)
    const saved = await kv.get("gtm:content:c1")
    expect(saved.content).toBe("new brief")
    expect(saved.kept).toBe(true)
    expect(saved.blobUrl).toBe("https://blob/x.html")
    expect(saved.assetType).toBe("social-post")
    expect(saved.id).toBe("c1")
    expect(saved.createdAt).toBe("2026-01-01T00:00:00Z")
  })

  it("404s an unknown id", async () => {
    const req = new NextRequest("http://localhost/api/gtm/content/nope", {
      method: "PUT", body: JSON.stringify({ content: "x" }),
    })
    const res = await PUT(req, { params: Promise.resolve({ id: "nope" }) })
    expect(res.status).toBe(404)
  })
})

import { GET as listContent } from "../content/route"

describe("GET /api/gtm/content kept filter", () => {
  const mocked = jest.requireMock("@/lib/gtm/kv-store")
  const kv = mocked.kv
  beforeEach(async () => {
    // Isolate from other suites that share this module-scoped store.
    mocked.__store.clear()
    kv.smembers = jest.fn(async () => ["a", "b"])
    await kv.set("gtm:content:a", { id: "a", solution: "trade-shows", kept: true, content: "kept", tags: [], createdAt: "2026-01-02T00:00:00Z", contentType: "linkedin-post", motion: "direct" })
    await kv.set("gtm:content:b", { id: "b", solution: "trade-shows", content: "unkept", tags: [], createdAt: "2026-01-01T00:00:00Z", contentType: "linkedin-post", motion: "direct" })
  })
  it("returns all items when kept is not requested (History)", async () => {
    const res = await listContent(new NextRequest("http://localhost/api/gtm/content?solution=trade-shows"))
    const { items } = await res.json()
    expect(items.map((i: { id: string }) => i.id).sort()).toEqual(["a", "b"])
  })
  it("returns only kept items when kept=true (Library)", async () => {
    const res = await listContent(new NextRequest("http://localhost/api/gtm/content?solution=trade-shows&kept=true"))
    const { items } = await res.json()
    expect(items.map((i: { id: string }) => i.id)).toEqual(["a"])
  })
})
