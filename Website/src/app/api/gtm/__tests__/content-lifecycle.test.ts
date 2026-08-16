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
