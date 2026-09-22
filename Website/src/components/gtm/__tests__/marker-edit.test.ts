/**
 * Pins the wrap/unwrap semantics of the SlotEditor B/I/U toolbar.
 *
 * `computeMarkerEdit` is the whole of that toolbar's logic: the component only
 * reads the textarea's selection, calls this, and writes the result back. The
 * subtle parts are the toggle (four outcomes, order-dependent) and the fact
 * that `*` and `**` share a character - so those get a case each.
 *
 * Node environment, no DOM: this file must stay a pure-function test. The repo
 * has no jsdom/testing-library, so nothing here may render the component.
 */

import { computeMarkerEdit } from "@/components/gtm/SlotEditor"
import { plainLength, truncateVisible } from "@/lib/gtm/rich-text"

/** `value|selectionStart,selectionEnd` - the full result in one readable string. */
function edit(value: string, start: number, end: number, marker: "**" | "*" | "__"): string {
  const r = computeMarkerEdit(value, start, end, marker)
  return `${r.value}|${r.start},${r.end}`
}

describe("computeMarkerEdit", () => {
  it("wraps the selection and keeps it selected", () => {
    expect(edit("hello world", 0, 5, "**")).toBe("**hello** world|2,7")
  })

  it("unwraps when the selection includes the markers", () => {
    expect(edit("**hello** world", 0, 9, "**")).toBe("hello world|0,5")
  })

  it("unwraps when the markers sit just outside the selection", () => {
    expect(edit("**hello** world", 2, 7, "**")).toBe("hello world|0,5")
  })

  it("inserts an empty pair at a collapsed caret, caret between the markers", () => {
    expect(edit("ab", 1, 1, "__")).toBe("a____b|3,3")
  })

  it("toggles an empty pair back off from between it", () => {
    expect(edit("a****b", 3, 3, "**")).toBe("ab|1,1")
  })

  it("pushes trailing whitespace out of the selection so markers hug the word", () => {
    // A double-clicked word often carries a trailing space; `**word **` is not bold.
    expect(edit("hello world", 0, 6, "**")).toBe("**hello** world|2,7")
  })

  it("italic does not claim a bold marker it only overlaps (markers inside)", () => {
    expect(edit("**hello**", 0, 9, "*")).toBe("***hello***|1,10")
  })

  it("italic does not claim a bold marker it only overlaps (markers outside)", () => {
    expect(edit("**hello**", 2, 7, "*")).toBe("***hello***|3,8")
  })

  it("italic still toggles its own markers off", () => {
    expect(edit("*hi*", 1, 3, "*")).toBe("hi|0,2")
  })

  it("wraps a selection that spans a newline", () => {
    expect(edit("a\nb", 0, 3, "__")).toBe("__a\nb__|2,5")
  })

  it("falls back to an insert when the selection is all whitespace", () => {
    expect(edit("a  b", 1, 3, "**")).toBe("a****  b|3,3")
  })

  it("clamps a selection that runs past the end of the value", () => {
    expect(edit("ab", 0, 99, "**")).toBe("**ab**|2,4")
  })
})

describe("the editor's counter agrees with the server's truncation", () => {
  it("counts markers and newlines as invisible", () => {
    expect(plainLength("**Bold** and *it* and __u__")).toBe("Bold and it and u".length)
    expect(plainLength("a\nb")).toBe(2)
    expect(plainLength("")).toBe(0)
  })

  it("keeps everything when the cap equals the visible length", () => {
    const raw = "**Ship** faster\nwith less"
    expect(plainLength(truncateVisible(raw, plainLength(raw)))).toBe(plainLength(raw))
  })

  it("never leaves more visible characters than the cap", () => {
    expect(plainLength(truncateVisible("**Ship** faster\nwith less", 6))).toBeLessThanOrEqual(6)
  })

  it("wrapping a selection does not change the visible count", () => {
    const before = "hello world"
    expect(plainLength(computeMarkerEdit(before, 0, 5, "**").value)).toBe(plainLength(before))
  })
})
