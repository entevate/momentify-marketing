import { parseRenderMedia, filterSlots, MAX_BG_BYTES, escapeSlotValues } from "../render-media"
import type { SlotSpec } from "@/lib/gtm/templates/types"

const png = "data:image/png;base64," + Buffer.from("hello").toString("base64")

describe("parseRenderMedia", () => {
  it("returns undefined media when nothing is supplied", () => {
    expect(parseRenderMedia({})).toEqual({ ok: true, media: undefined })
  })
  it("accepts png/jpeg/webp data URIs and 0-100 opacity", () => {
    expect(parseRenderMedia({ bgImage: png, bgOpacity: 62 })).toEqual({ ok: true, media: { bgImage: png, bgOpacity: 62 } })
  })
  it("rejects a non-image data URI", () => {
    const r = parseRenderMedia({ bgImage: "data:text/html;base64,AAAA" })
    expect(r.ok).toBe(false)
  })
  it("rejects an https URL (must be inline)", () => {
    expect(parseRenderMedia({ bgImage: "https://x/y.png" }).ok).toBe(false)
  })
  it("rejects an image over the byte cap", () => {
    const big = "data:image/png;base64," + Buffer.alloc(MAX_BG_BYTES + 1).toString("base64")
    expect(parseRenderMedia({ bgImage: big }).ok).toBe(false)
  })
  it("rejects a non-numeric or out-of-range opacity", () => {
    expect(parseRenderMedia({ bgOpacity: "abc" }).ok).toBe(false)
    expect(parseRenderMedia({ bgOpacity: 101 }).ok).toBe(false)
  })
  it("keeps bgOpacity 0 (falsy) as 0", () => {
    expect(parseRenderMedia({ bgOpacity: 0 })).toEqual({ ok: true, media: { bgOpacity: 0 } })
  })
  it("rejects empty-string and array opacities", () => {
    expect(parseRenderMedia({ bgOpacity: "" }).ok).toBe(false)
    expect(parseRenderMedia({ bgOpacity: [] as unknown }).ok).toBe(false)
    expect(parseRenderMedia({ bgOpacity: [50] as unknown }).ok).toBe(false)
  })
  it("escapeSlotValues HTML-escapes every value", () => {
    expect(escapeSlotValues({ A: '<img src=x onerror=1>', B: "Tom & Jerry" })).toEqual({ A: "&lt;img src=x onerror=1&gt;", B: "Tom &amp; Jerry" })
  })
})

describe("filterSlots", () => {
  const spec: SlotSpec[] = [
    { key: "STAT", label: "", kind: "stat_number", maxChars: 3, example: "" },
    { key: "LABEL", label: "", kind: "eyebrow", maxChars: 10, example: "" },
  ]
  it("keeps only manifest keys, truncates to maxChars, strips em-dashes", () => {
    expect(filterSlots({ STAT: "12345", LABEL: "a — b", EVIL: "x" }, spec)).toEqual({ STAT: "123", LABEL: "a - b" })
  })
  it("returns null when the input is not an object of strings", () => {
    expect(filterSlots("nope", spec)).toBeNull()
    expect(filterSlots({ STAT: 5 }, spec)).toEqual({ STAT: "5" })
  })
})
