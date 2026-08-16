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
