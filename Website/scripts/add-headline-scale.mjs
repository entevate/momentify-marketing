// Make every headline template's font size scalable from the editor:
//   .headline { font-size: 54px }  ->  font-size: calc(54px * var(--slot-scale, 1))
// renderTemplate sets --slot-scale on [data-slot="HEADLINE"] when the user
// picks a size (see src/lib/gtm/templates/slot-style.ts). Idempotent.
import fs from "fs"
import path from "path"

const root = "src/lib/gtm/templates/social-post"
let changed = 0, total = 0
for (const dir of fs.readdirSync(root)) {
  const file = path.join(root, dir, "template.html")
  if (!fs.existsSync(file)) continue
  const html = fs.readFileSync(file, "utf8")
  if (!html.includes('data-slot="HEADLINE"')) continue
  total++
  const rule = html.match(/\.headline\s*\{[^}]*\}/)
  if (!rule) throw new Error(`${file}: no .headline rule`)
  if (rule[0].includes("--slot-scale")) continue
  const next = rule[0].replace(/font-size:\s*(\d+(?:\.\d+)?px)/, "font-size: calc($1 * var(--slot-scale, 1))")
  if (next === rule[0]) throw new Error(`${file}: .headline has no px font-size`)
  fs.writeFileSync(file, html.replace(rule[0], next))
  changed++
}
console.log(`headline templates: ${total}, updated: ${changed}`)
if (total !== 18) throw new Error(`expected 18 headline templates, found ${total}`)
