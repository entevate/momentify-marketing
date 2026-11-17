/**
 * The `thinking` shape that turns thinking off differs per model, and the API
 * answers the wrong one with a 400 on every request:
 *
 *   claude-sonnet-5-5  { type: "disabled" }  -> 400, wants { type: "between_tools" }
 *   claude-opus-5-5    { type: "disabled" }  -> 400, and between_tools 400s too
 *
 * `thinkingOff()` is the one place that knows. This test pins its answer per
 * model, so bumping CLAUDE_MODEL (or a route's fallback default) fails here
 * instead of as a production 400 across every generation route.
 */

import fs from "node:fs"
import path from "node:path"

import { thinkingOff } from "@/lib/gtm/content-types"

const DISABLED = { type: "disabled" }
const BETWEEN_TOOLS = { type: "between_tools" }

/**
 * model -> the `thinking` value to send (undefined = omit the field).
 * Each row was confirmed against the live Messages API on 2026-10-01 with a
 * 50-token request. To add a model: probe it for real, then add the row.
 */
const VERIFIED: Array<[string, unknown]> = [
  ["claude-sonnet-5", DISABLED],
  ["claude-sonnet-5-5", BETWEEN_TOOLS],
  ["claude-sonnet-4-6", DISABLED],
  ["claude-sonnet-4-5", DISABLED],
  ["claude-sonnet-4-5-20250929", DISABLED],
  ["claude-haiku-4-5", DISABLED],
  ["claude-haiku-4-5-20251001", DISABLED],
  ["claude-opus-5", DISABLED],
  ["claude-opus-4-8", DISABLED],
  ["claude-opus-4-7", DISABLED],
  ["claude-opus-4-6", DISABLED],
  // No off switch: "disabled" and "between_tools" both 400, so omit the field.
  ["claude-opus-5-5", undefined],
  ["claude-fable-5", undefined],
  ["claude-fable-5-1", undefined],
]

describe("thinkingOff", () => {
  it.each(VERIFIED)("%s -> %j", (model, expected) => {
    expect(thinkingOff(model)).toEqual(expected)
  })

  it("never sends the shape Sonnet 5.5 rejects (the reported production 400)", () => {
    expect(thinkingOff("claude-sonnet-5-5")).not.toEqual(DISABLED)
  })

  it("omits the field for a model it has not verified", () => {
    expect(thinkingOff("claude-not-released-yet")).toBeUndefined()
    expect(thinkingOff("")).toBeUndefined()
  })

  it("does not let a Sonnet 5.5 id fall into the Sonnet 5 pattern", () => {
    // claude-sonnet-5-5 starts with claude-sonnet-5; the match must be exact.
    expect(thinkingOff("claude-sonnet-5-5")).toEqual(BETWEEN_TOOLS)
    expect(thinkingOff("claude-sonnet-5-5-20261001")).toBeUndefined()
  })

  it("drops `thinking` from the request body when there is no off switch", () => {
    // Call sites pass `thinking: thinkingOff(model)` straight into JSON.stringify.
    const body = JSON.parse(JSON.stringify({ model: "claude-opus-5-5", thinking: thinkingOff("claude-opus-5-5") }))
    expect("thinking" in body).toBe(false)
  })

  it("has a verified row for the model every route uses by default", () => {
    const verified = VERIFIED.map(([model]) => model)
    const dir = path.join(process.cwd(), "src", "app", "api", "gtm")
    const routes = fs.readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((rel) => rel.endsWith("route.ts"))
      .map((rel) => fs.readFileSync(path.join(dir, rel), "utf8"))
    const defaults = routes.flatMap((text) => [...text.matchAll(/CLAUDE_MODEL \|\| "([^"]+)"/g)].map((m) => m[1]))
    // Changing a route's fallback model without probing the new model's
    // thinking shape against the real API lands here.
    expect(defaults.length).toBeGreaterThanOrEqual(4)
    for (const model of defaults) expect(verified).toContain(model)
  })
})

describe("call sites go through thinkingOff", () => {
  const SRC = path.join(process.cwd(), "src")

  function sourceFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) return e.name === "__tests__" ? [] : sourceFiles(full)
      return /\.(ts|tsx)$/.test(e.name) ? [full] : []
    })
  }

  const files = sourceFiles(SRC).map((f) => ({ rel: path.relative(process.cwd(), f), text: fs.readFileSync(f, "utf8") }))

  it("no file hardcodes thinking: disabled except the helper", () => {
    const offenders = files
      .filter((f) => /type:\s*["']disabled["']/.test(f.text))
      .map((f) => f.rel)
      .filter((rel) => rel !== path.join("src", "lib", "gtm", "content-types.ts"))
    expect(offenders).toEqual([])
  })

  it("every GTM route that calls the Messages API sets thinking via thinkingOff()", () => {
    // social-toolkit/caption sends no `thinking` field, so only the GTM routes are held to this.
    const callers = files.filter(
      (f) => f.rel.startsWith(path.join("src", "app", "api", "gtm")) && f.text.includes("api.anthropic.com/v1/messages"),
    )
    // Guard the guard: the four known call sites must still be found.
    expect(callers.length).toBeGreaterThanOrEqual(4)
    const missing = callers.filter((f) => !/thinking:\s*thinkingOff\(/.test(f.text)).map((f) => f.rel)
    expect(missing).toEqual([])
  })
})
