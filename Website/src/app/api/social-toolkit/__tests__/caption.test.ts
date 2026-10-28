import { POST } from "../caption/route"
import { requireGtmAuth } from "@/lib/gtm/content-types"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))

const mockedAuth = requireGtmAuth as jest.MockedFunction<typeof requireGtmAuth>
const fetchMock = jest.fn()

function req(body: unknown) {
  return new Request("http://localhost/api/social-toolkit/caption", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockedAuth.mockResolvedValue(true)
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ content: [{ text: '{"caption":"Hello","hashtags":["#a","#b"]}' }] }),
  })
  global.fetch = fetchMock as unknown as typeof fetch
})

describe("POST /api/social-toolkit/caption", () => {
  it("rejects unauthenticated callers without calling Anthropic", async () => {
    mockedAuth.mockResolvedValue(false)
    const res = await POST(req({ headline: "Hi" }))
    expect(res.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects over-length fields without calling Anthropic", async () => {
    const res = await POST(req({ headline: "x".repeat(201) }))
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects non-string fields", async () => {
    const res = await POST(req({ headline: { nested: true } }))
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects an empty request", async () => {
    const res = await POST(req({ brand: "Momentify" }))
    expect(res.status).toBe(400)
  })

  it("returns a caption for an authenticated, in-bounds request", async () => {
    const res = await POST(req({ headline: "Hi", brand: "Momentify" }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ caption: "Hello", hashtags: ["#a", "#b"] })
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.max_tokens).toBeLessThanOrEqual(700)
    expect(sent.messages[0].content).toContain("Headline: Hi")
  })

  it("tolerates a fenced JSON reply", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: '```json\n{"caption":"Fenced","hashtags":[]}\n```' }] }),
    })
    const res = await POST(req({ headline: "Hi" }))
    expect(res.status).toBe(200)
    expect((await res.json()).caption).toBe("Fenced")
  })
})
