# Content Builder — Post-Output Flow Matrix

Snapshot as of commit `a53c8f3` on `main`. Use this as a planning input for follow-up work on the Growth Engine GTM Content Builder.

## What this document covers

After a user picks a content type in `/gtm/<pillar>` → Content Builder tab → Generate, what UI renders, what actions are available, and how those actions chain to Library and Calendar.

Source files:
- `src/components/gtm/tabs/ContentBuilder.tsx` — output rendering branches, ONE_CLICK_HTML_ASSETS / MANUAL_HTML_ASSETS sets, schedule wiring
- `src/components/gtm/AssetPanel.tsx` — template picker + slot-filled iframe preview
- `src/components/gtm/calendar/TaskDetailModal.tsx` — calendar task preview iframe

---

## Output flow matrix

| # | Content type | Output rendering | Save to Library | Schedule on Calendar | Calendar task preview | Other actions |
|---|---|---|---|---|---|---|
| 1 | `cold-emails` | text-only block | ✓ | ✗ | n/a | Copy |
| 2 | `linkedin-dm` | text-only block | ✓ | ✗ | n/a | Copy |
| 3 | `social-post` | template selector + AssetPanel | ✓ | ✓ | ✓ iframe | Copy, Download HTML |
| 4 | `carousel` | template selector + AssetPanel | ✓ | ✓ | ✓ iframe (carousel uses social-post namespace) | Copy, Download HTML |
| 5 | `lead-magnet` | text-only block | ✓ | ✗ | n/a | Copy |
| 6 | `discovery-script` | text-only block | ✓ | ✗ | n/a | Copy |
| 7 | `partner-pitch` | text-only block | ✓ | ✗ | n/a | Copy |
| 8 | `battle-card` | text-only block | ✓ | ✗ | n/a | Copy |
| 9 | `microsite` | iframe (after Generate-Asset click) | ✓ | ✗ | n/a | Open, Publish to Blob |
| 10 | `pitch-deck` | iframe (after Generate-Asset click) | ✓ | ✗ | n/a | Open, Regenerate |
| 11 | `infographic` | iframe (after Generate-Asset click) | ✓ | ✗ | n/a | Open, Regenerate |
| 12 | `one-pager` | iframe (after Generate-Asset click) | ✓ | ✗ | n/a | Open, Regenerate |

### Three rendering modes today

- **text-only** (6 types: 1, 2, 5, 6, 7, 8) — preformatted string in a code-block style panel
- **template-selector + AssetPanel** (2 types: 3, 4) — inline thumbnail picker, slot-filled HTML preview, all 15 social-post templates available
- **html-asset-iframe** (4 types: 9, 10, 11, 12) — `/api/gtm/generate-asset-html` produces a full HTML document, rendered in an iframe

The unused `MANUAL_HTML_ASSETS` set in `ContentBuilder.tsx` exists but contains no entries; no content type currently routes through it.

---

## Routing logic in `tabs/ContentBuilder.tsx`

```ts
const ONE_CLICK_HTML_ASSETS = new Set([
  "infographic", "microsite", "one-pager", "pitch-deck"
])
const MANUAL_HTML_ASSETS = new Set<string>([])

const isSocialPost = contentType === "social-post" || contentType === "carousel"
const isOneClickHtmlAsset = ONE_CLICK_HTML_ASSETS.has(contentType)
const isManualHtmlAsset = MANUAL_HTML_ASSETS.has(contentType)
```

Render branches (line ranges from `ContentBuilder.tsx`):

| Branch condition | Lines | Behavior |
|---|---|---|
| `isSocialPost` | ~846–914 | LinkedIn/Instagram/X platform tab strip (text only renders if `socialSections` matched), then AssetPanel with template picker |
| `isOneClickHtmlAsset && !isSocialPost` | ~917–1068 | "HTML Asset" panel with Generate / Regenerate, iframe preview, Publish-to-Blob (microsite only) |
| `isManualHtmlAsset` | ~1071–1121 | Build-with-Claude-Code prompt panel (currently unreachable) |
| Fallback (none of the above) | ~881–902 | Pre-formatted text block with Copy + Save |

### Schedule path (only social-post + carousel today)

Lines ~391–431 of `tabs/ContentBuilder.tsx`. Sequence:

1. `handleSave()` → `POST /api/gtm/content` (persists the brief; returns library item id)
2. `POST /api/gtm/asset-link` (links the draft-rendered graphic to the new library item — social-post namespace only)
3. `POST /api/gtm/calendar` with `{ id, title, category, solution, date, libraryItemId, assetType, ... }`
4. `dispatchLibraryChanged(solution)` → fires the `gtm:library-changed` event so the Library tab badge refreshes

### Calendar task preview iframe (`TaskDetailModal.tsx`)

```tsx
{task.libraryItemId && (task.assetType === "social-post" || task.assetType === "carousel") && (
  <iframe
    src={`/api/gtm/asset-preview?solution=${task.solution}&assetType=social-post&itemId=${task.libraryItemId}`}
  />
)}
```

The URL hardcodes `assetType=social-post` because both social-post and carousel render through the social-post template family / namespace. Other content types (HTML asset family, text-only) don't have a rendered preview path here.

---

## Gaps and inconsistencies

### 1. Schedule for HTML asset types (microsite, infographic, one-pager, pitch-deck)
These produce iframe-able HTML but there's no Schedule button on the output panel. Requires:
- New Schedule button rendered when `isOneClickHtmlAsset && hasRenderedAsset`
- `handleSchedule` already asset-type-agnostic; just pass `assetType: contentType`
- `TaskDetailModal` iframe URL needs to use `task.assetType` instead of hardcoded `social-post` so the preview can fetch the right namespace
- Generate-asset-html route already persists the rendered HTML by `pillar/assetType/itemId` — same key shape as fill-template, so asset-preview proxy works for any namespace already

### 2. Schedule for text-only types (6 types)
No rendered preview, but they could still be scheduled as title + body reminders. Options:
- Add a Schedule button to the text-only output panel; calendar task gets no `libraryItemId` / `assetType`, so TaskDetailModal falls through to its title + description rendering (already works for tasks without a preview)
- Could also be `libraryItemId` linked but no preview, so the modal shows the brief excerpt instead

### 3. Library card preview for text-only types
`tabs/ContentLibrary.tsx` shows a list of cards. Today text-only items show title + metadata only. Adding a 3-line excerpt of the saved content body would let users scan saved cold-emails / scripts / battle-cards without opening each.

### 4. Pitch-deck path decision (now in `ONE_CLICK_HTML_ASSETS`)
Pitch-deck currently renders as a one-click HTML asset (same as infographic/microsite/one-pager). ENTEVATE's reference treats pitch-deck as a manual Claude-Code workflow (it would live in `MANUAL_HTML_ASSETS`). Decide whether Momentify should:
- Keep the current one-click iframe path (fast, less control)
- Move pitch-deck to `MANUAL_HTML_ASSETS` and populate the manual prompt panel (matches ENTEVATE; user generates via Claude Code, then attaches the file)

### 5. Carousel template family (longer-term)
Carousel currently uses the same 15 social-post templates as a fallback (one template per carousel save). A native carousel format would be 6 cards with their own layouts. If pursued, requires:
- New template family registered under `carousel` asset type
- AssetPanel updated to support multi-card render flow
- fill-template route can already accept any `assetType` namespace; just needs templates to exist

---

## Recommended phasing (in priority order)

1. **Schedule + preview for HTML asset types** — highest user value (microsite/infographic/one-pager/pitch-deck are common GTM artifacts)
2. **Pitch-deck path decision** — single-line config change, just need a yes/no on the direction
3. **Schedule + library preview for text-only types** — broad UX win across 6 types
4. **Carousel template family** — long-term; current stop-gap (using social-post templates) is acceptable

---

## Verification (how to test any new fix)

1. Run `npm run dev` from the worktree
2. Visit `/gtm/login` → enter `momentify2026` to set the auth cookie
3. Navigate to a pillar page (e.g. `/gtm/trade-shows`) → Content Builder tab
4. Pick the relevant content type → fill the form → Generate
5. Verify the output rendering matches the matrix
6. If applicable: Save to Library → confirm library count badge increments on the Library tab
7. If applicable: Schedule → pick a date → Save + Schedule → verify task appears in `/gtm/calendar`
8. Click the calendar task → verify TaskDetailModal opens, preview iframe renders for templated assets
9. Refresh the page → verify all state persists (KV fallback writes to `.gtm-kv-fallback.json` locally)
