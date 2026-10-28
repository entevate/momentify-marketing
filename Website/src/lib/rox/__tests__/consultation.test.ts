import { buildRoxMessage, submitRoxConsultation, type RoxConsultationRequest } from "../consultation"

const base: RoxConsultationRequest = {
  solution: "trade-shows",
  calculatorName: "Trade Show ROX",
  contact: {
    firstName: " Ada ",
    lastName: "Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines",
    jobTitle: "",
    phone: "555-0100",
  },
  volume: { question: "Trade shows per year:", answer: "4-8" },
  totalScore: 72.4,
  tierName: "High ROX",
  categories: [
    { name: "Lead Capture Efficiency", score: 64.6 },
    { name: "Follow-Up Speed", score: null },
  ],
  extras: { "Cost Per Lead": "$120", "Potential Value Generated": null },
}

const fetchMock = jest.fn()

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock as unknown as typeof fetch
})

describe("buildRoxMessage", () => {
  it("includes score, tier, categories, extras, volume and phone", () => {
    expect(buildRoxMessage(base)).toBe(
      [
        "Trade Show ROX calculator consultation request",
        "ROX Score: 72 / 100 (High ROX)",
        "Lead Capture Efficiency: 65",
        "Follow-Up Speed: --",
        "Cost Per Lead: $120",
        "Trade shows per year: 4-8",
        "Phone: 555-0100",
      ].join("\n")
    )
  })
})

describe("submitRoxConsultation", () => {
  it("posts to /api/demo with only fields the demo form already sends", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 })
    await submitRoxConsultation(base)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("/api/demo")
    const body = JSON.parse(init.body)
    expect(Object.keys(body).sort()).toEqual(
      ["company", "companySize", "email", "eventsPerYear", "firstName", "jobTitle", "lastName", "message", "referral", "solution", "sourcePage"].sort()
    )
    expect(body.firstName).toBe("Ada")
    expect(body.solution).toBe("trade-shows")
    expect(body.sourcePage).toBe("rox-calculator-trade-shows")
    expect(body.message).toContain("ROX Score: 72 / 100")
  })

  it("throws when the demo route fails so the UI does not show success", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 })
    await expect(submitRoxConsultation(base)).rejects.toThrow("500")
  })
})
