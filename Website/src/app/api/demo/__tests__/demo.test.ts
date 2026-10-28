import { POST } from "../route"

const fetchMock = jest.fn()
const ENV = { ...process.env }

const lead = {
  firstName: "Test",
  lastName: "Lead",
  email: "lead@example.com",
  company: "Acme",
  jobTitle: "Ops",
  solution: "trade-shows",
  companySize: "",
  eventsPerYear: "",
  referral: "",
  sourcePage: "rox-calculator-trade-shows",
  message: "Trade Show ROX calculator consultation request",
}

function req(body: unknown) {
  return new Request("http://localhost/api/demo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function hubspotCall() {
  return fetchMock.mock.calls.find(([url]) => String(url).startsWith("https://api.hsforms.com"))
}

beforeEach(() => {
  process.env = { ...ENV, HUBSPOT_PORTAL_ID: "123", HUBSPOT_FORM_GUID: "form-guid" }
  delete process.env.HUBSPOT_ACCESS_TOKEN
  delete process.env.INTERCOM_ACCESS_TOKEN
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ ok: true, text: async () => "" })
  global.fetch = fetchMock as unknown as typeof fetch
  jest.spyOn(console, "warn").mockImplementation(() => {})
  jest.spyOn(console, "error").mockImplementation(() => {})
})

afterAll(() => {
  process.env = ENV
})

describe("POST /api/demo HubSpot submission", () => {
  it("uses the authenticated endpoint with a Bearer token when HUBSPOT_ACCESS_TOKEN is set", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "pat-test"
    const res = await POST(req(lead))
    expect(res.status).toBe(200)

    const [url, init] = hubspotCall()!
    expect(url).toBe("https://api.hsforms.com/submissions/v3/integration/secure/submit/123/form-guid")
    expect(init.headers.Authorization).toBe("Bearer pat-test")
    const body = JSON.parse(init.body)
    expect(body.fields).toContainEqual({ objectTypeId: "0-1", name: "email", value: "lead@example.com" })
    expect(body.fields).toContainEqual({ objectTypeId: "0-1", name: "source_page", value: "rox-calculator-trade-shows" })
    expect(body.fields).toHaveLength(11)
  })

  it("sends no page address, so HubSpot's site-domain spam check has nothing to reject", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "pat-test"
    await POST(req(lead))
    const body = JSON.parse(hubspotCall()![1].body)
    expect(body.context?.pageUri).toBeUndefined()
  })

  it("falls back to the public endpoint without a token", async () => {
    const res = await POST(req(lead))
    expect(res.status).toBe(200)

    const [url, init] = hubspotCall()!
    expect(url).toBe("https://api.hsforms.com/submissions/v3/integration/submit/123/form-guid")
    expect(init.headers.Authorization).toBeUndefined()
  })

  it("returns 500 when HubSpot rejects and Intercom is not configured", async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = "pat-bad"
    fetchMock.mockResolvedValue({ ok: false, status: 401, text: async () => "unauthorized" })
    const res = await POST(req(lead))
    expect(res.status).toBe(500)
  })
})
