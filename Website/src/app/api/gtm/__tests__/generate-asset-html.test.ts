import { POST } from "../generate-asset-html/route"
import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"

// Mock fs module
jest.mock("fs")
jest.mock("path")

// The route is login-gated; cookies() has no request scope under jest.
jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: async () => true }))

// Mock fetch globally
global.fetch = jest.fn()

describe("POST /api/gtm/generate-asset-html", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // mockReset, not mockClear: a test that returns before calling Claude leaves its
    // queued reply behind, and mockClear would hand it to the next test.
    ;(fetch as jest.Mock).mockReset()
    // Mock path.join to return a predictable path
    ;(path.join as jest.Mock).mockImplementation((...args) => args.join("/"))
    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/app')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("Parameter Validation", () => {
    it("should return 400 when brief is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Missing brief")
    })

    it("should return 400 when assetType is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Missing brief, assetType, or solution")
    })

    it("should return 400 when solution is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Missing brief, assetType, or solution")
    })
  })

  describe("Path Traversal Protection", () => {
    it("should return 400 for invalid solution parameter", async () => {
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "../../../etc/passwd",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Invalid solution or assetType format")
    })

    it("should return 400 for invalid assetType parameter", async () => {
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "../../config",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Invalid solution or assetType format")
    })

    it("should accept valid parameter formats (alphanumeric, hyphen, underscore)", async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><body></body></html>",
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "one-pager",
          solution: "field-sales_v2-test",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe("Asset Type Validation", () => {
    it("should return 400 for unsupported asset type", async () => {
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "unsupported-type",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Unsupported asset type")
    })

    it("should accept all valid asset types", async () => {
      const validAssetTypes = ["infographic", "microsite", "carousel", "pitch-deck", "one-pager"]

      for (const assetType of validAssetTypes) {
        jest.clearAllMocks()

        ;(fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            content: [
              {
                type: "text",
                text: "<!DOCTYPE html><html><body></body></html>",
              },
            ],
          }),
        })

        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

        const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
          method: "POST",
          body: JSON.stringify({
            brief: "Test brief",
            assetType,
            solution: "trade-shows",
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
      }
    })
  })

  describe("API Key Handling", () => {
    it("should return 500 when API key is missing", async () => {
      // Clear any API key env vars
      const originalKey = process.env.GTM_ANTHROPIC_KEY
      const originalDefaultKey = process.env.ANTHROPIC_API_KEY
      delete process.env.GTM_ANTHROPIC_KEY
      delete process.env.ANTHROPIC_API_KEY

      try {
        const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
          method: "POST",
          body: JSON.stringify({
            brief: "Test brief",
            assetType: "infographic",
            solution: "trade-shows",
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(500)
        const data = await response.json()
        expect(data.error).toContain("not configured")
      } finally {
        if (originalKey) process.env.GTM_ANTHROPIC_KEY = originalKey
        if (originalDefaultKey) process.env.ANTHROPIC_API_KEY = originalDefaultKey
      }
    })

    it("should use GTM_ANTHROPIC_KEY if available", async () => {
      const originalKey = process.env.ANTHROPIC_API_KEY
      process.env.GTM_ANTHROPIC_KEY = "test-gtm-key"
      delete process.env.ANTHROPIC_API_KEY

      try {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            content: [
              {
                type: "text",
                text: "<!DOCTYPE html><html><body></body></html>",
              },
            ],
          }),
        })

        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

        const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
          method: "POST",
          body: JSON.stringify({
            brief: "Test brief",
            assetType: "infographic",
            solution: "trade-shows",
          }),
        })

        await POST(request)

        // Verify fetch was called with GTM key
        expect(fetch).toHaveBeenCalledWith(
          "https://api.anthropic.com/v1/messages",
          expect.objectContaining({
            headers: expect.objectContaining({
              "x-api-key": "test-gtm-key",
            }),
          })
        )
      } finally {
        delete process.env.GTM_ANTHROPIC_KEY
        if (originalKey) process.env.ANTHROPIC_API_KEY = originalKey
      }
    })
  })

  describe("Claude API Integration", () => {
    it("should return 500 when Claude API returns error", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => "API Error: Rate limit exceeded",
      })

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toContain("Generation failed")
    })

    it("should return 500 when Claude response has no content", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [],
        }),
      })

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toContain("Empty response")
    })

    it("should return 500 when Claude response is not text type", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "image",
              source: { type: "base64", data: "..." },
            },
          ],
        }),
      })

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toContain("Expected text response")
    })
  })

  describe("HTML Validation", () => {
    it("should return 400 when HTML is missing DOCTYPE and html tag", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<body></body></html>",
            },
          ],
        }),
      })

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("Invalid HTML")
    })

    it("reports a cut-off page plainly when the reply hit the output cap", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stop_reason: "max_tokens",
          content: [{ type: "text", text: "<!DOCTYPE html><html><body><section>" }],
        }),
      })
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({ brief: "Test brief", assetType: "infographic", solution: "trade-shows" }),
      })
      const response = await POST(request)
      expect(response.status).toBe(502)
      expect((await response.json()).error).toContain("cut off")
    })

    it("stores only the document when the reply is wrapped in a code fence", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ type: "text", text: "Here is the page:\n```html\n<!DOCTYPE html><html><body></body></html>\n```\nDone." }],
        }),
      })
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({ brief: "Test brief", assetType: "infographic", solution: "trade-shows" }),
      })
      const response = await POST(request)
      expect(response.status).toBe(200)
      expect((fs.writeFileSync as jest.Mock).mock.calls[0][1]).toBe("<!DOCTYPE html><html><body></body></html>")
    })

    it("asks for enough output tokens to hold a full page", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [{ type: "text", text: "<!DOCTYPE html><html></html>" }] }),
      })
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})
      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({ brief: "Test brief", assetType: "infographic", solution: "trade-shows" }),
      })
      await POST(request)
      const sent = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body)
      expect(sent.max_tokens).toBeGreaterThanOrEqual(16000)
    })

    it("should return 400 when HTML is missing closing html tag", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><body></body>",
            },
          ],
        }),
      })

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain("missing closing html tag")
    })

    it("should accept valid HTML with DOCTYPE", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>",
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe("File Operations", () => {
    it("should create /public/gtm directory if it doesn't exist", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><body></body></html>",
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      ;(fs.mkdirSync as jest.Mock).mockImplementation(() => {})
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      await POST(request)

      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("public/gtm"), {
        recursive: true,
      })
    })

    it("should write HTML to /public/gtm/{solution}-{assetType}.html", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      const htmlContent = "<!DOCTYPE html><html><body></body></html>"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: htmlContent,
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "carousel",
          solution: "recruiting",
        }),
      })

      await POST(request)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("recruiting-carousel.html"),
        htmlContent,
        "utf-8"
      )
    })

    it("should return 500 when file write fails", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><body></body></html>",
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("Permission denied")
      })

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toContain("Failed to generate asset")
    })
  })

  describe("Successful Generation", () => {
    it("should return success with preview URL for infographic", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><body></body></html>",
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.url).toBe("/trade-shows-infographic.html")
      expect(data.filename).toBe("trade-shows-infographic.html")
    })

    it("should return correct preview URL for each asset type", async () => {
      const assetTypes = ["infographic", "microsite", "carousel", "pitch-deck", "one-pager"]

      for (const assetType of assetTypes) {
        jest.clearAllMocks()
        process.env.ANTHROPIC_API_KEY = "test-key"

        ;(fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            content: [
              {
                type: "text",
                text: "<!DOCTYPE html><html><body></body></html>",
              },
            ],
          }),
        })

        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

        const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
          method: "POST",
          body: JSON.stringify({
            brief: "Test brief",
            assetType,
            solution: "field-sales",
          }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(data.url).toBe(`/field-sales-${assetType}.html`)
        expect(data.filename).toBe(`field-sales-${assetType}.html`)
      }
    })
  })

  describe("Edge Cases", () => {
    it("should handle very long brief content", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      const longBrief = "A".repeat(10000)

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: "<!DOCTYPE html><html><body></body></html>",
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: longBrief,
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it("should handle HTML with special characters and unicode", async () => {
      process.env.ANTHROPIC_API_KEY = "test-key"

      const htmlWithUnicode =
        '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>Café ☕ 你好 مرحبا</h1></body></html>'

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: htmlWithUnicode,
            },
          ],
        }),
      })

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

      const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
        method: "POST",
        body: JSON.stringify({
          brief: "Test brief with unicode",
          assetType: "infographic",
          solution: "trade-shows",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("trade-shows-infographic.html"),
        htmlWithUnicode,
        "utf-8"
      )
    })
  })
})
