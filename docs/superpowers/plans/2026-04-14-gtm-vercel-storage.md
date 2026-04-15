# GTM Content Storage + Publish Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist GTM content library and calendar tasks to Vercel KV, store microsites in Vercel Blob, and serve published microsites at `/m/{slug}`.

**Architecture:** Six API route files (content CRUD, calendar CRUD, microsites publish pipeline) using Vercel KV for metadata and Vercel Blob for HTML/assets. Frontend components swap localStorage calls for fetch. A new content dashboard page at `/gtm/content` shows all content grouped by solution. Published microsites are served at `/m/[slug]` via iframe pointing to Blob CDN URLs.

**Tech Stack:** Next.js App Router, Vercel KV (`@vercel/kv`), Vercel Blob (`@vercel/blob`), React, TypeScript

---

## File Structure

| File | Purpose |
|------|---------|
| `Website/src/lib/gtm/content-types.ts` | **Create.** Shared TypeScript interfaces: `ContentItem`, `MicrositeRecord`. Re-exports `CalendarTask` from existing `calendar-types.ts`. KV key constants. Auth helper. |
| `Website/src/app/api/gtm/content/route.ts` | **Create.** GET (list content, optional `?solution=` filter) and POST (save new content item). |
| `Website/src/app/api/gtm/content/[id]/route.ts` | **Create.** GET (single item), DELETE (remove from KV + clean up Blob if `blobUrl` exists). |
| `Website/src/app/api/gtm/calendar/route.ts` | **Create.** GET (list all tasks), POST (create task), PUT (bulk update for drag-drop reorder). |
| `Website/src/app/api/gtm/calendar/[id]/route.ts` | **Create.** PUT (update single task), DELETE (remove task). |
| `Website/src/app/api/gtm/microsites/route.ts` | **Create.** GET (list published microsites), POST (strip brand-nav from HTML, upload to Blob, create KV record). |
| `Website/src/app/api/gtm/microsites/[slug]/route.ts` | **Create.** GET (single record), PUT (re-publish), DELETE (unpublish: delete Blob + KV). |
| `Website/src/app/m/[slug]/page.tsx` | **Create.** Server component that serves published microsites via iframe. |
| `Website/src/app/gtm/content/page.tsx` | **Create.** Content dashboard showing all content grouped by solution with publish/unpublish actions. |
| `Website/src/components/gtm/ContentBuilder.tsx` | **Modify.** Replace localStorage save with `POST /api/gtm/content`. Replace localStorage schedule with `POST /api/gtm/calendar`. Add "Publish" button for microsite content type. |
| `Website/src/components/gtm/ContentLibrary.tsx` | **Modify.** Replace localStorage load/save/delete with API calls. Add loading state. |
| `Website/src/app/gtm/calendar/page.tsx` | **Modify.** Replace localStorage load/save with API calls. Add loading state. |

---

### Task 1: Shared Types and Constants

**Files:**
- Create: `Website/src/lib/gtm/content-types.ts`

- [ ] **Step 1: Create the shared types file**

```typescript
// Website/src/lib/gtm/content-types.ts
import { cookies } from "next/headers"

export { type CalendarTask, type SolutionId, type TaskCategory } from "./calendar-types"

export interface ContentItem {
  id: string
  contentType: string
  platform?: "linkedin" | "twitter" | "instagram"
  motion: "direct" | "partner"
  solution: string
  content: string
  graphic?: string            // base64 data URL for inline graphics
  blobUrl?: string            // Vercel Blob URL for attached files
  createdAt: string
  tags: string[]
}

export interface MicrositeRecord {
  slug: string
  title: string
  description?: string
  solution: string
  blobUrl: string
  contentId?: string
  publishedAt: string
}

// KV key helpers
export const KV = {
  content: (id: string) => `gtm:content:${id}`,
  contentIndex: "gtm:content:index",
  calendar: (id: string) => `gtm:calendar:${id}`,
  calendarIndex: "gtm:calendar:index",
  microsite: (slug: string) => `gtm:microsite:${slug}`,
  micrositeIndex: "gtm:microsite:index",
} as const

// Auth check for API routes (reads gtm_auth cookie)
export async function requireGtmAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get("gtm_auth")?.value === "true"
}
```

- [ ] **Step 2: Commit**

```bash
git add Website/src/lib/gtm/content-types.ts
git commit -m "feat(gtm): add shared types and KV constants for content storage"
```

---

### Task 2: Content Library API Routes

**Files:**
- Create: `Website/src/app/api/gtm/content/route.ts`
- Create: `Website/src/app/api/gtm/content/[id]/route.ts`

- [ ] **Step 1: Create the content list/create route**

```typescript
// Website/src/app/api/gtm/content/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type ContentItem } from "@/lib/gtm/content-types"

export async function GET(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const solution = searchParams.get("solution")

    const ids = await kv.smembers(KV.contentIndex) as string[]
    const items: ContentItem[] = []

    for (const id of ids) {
      const item = await kv.get<ContentItem>(KV.content(id))
      if (item) {
        if (!solution || solution === "all" || item.solution === solution) {
          items.push(item)
        }
      }
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const item = await request.json() as ContentItem

    if (!item.id) {
      item.id = `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    }
    if (!item.createdAt) {
      item.createdAt = new Date().toISOString()
    }

    await kv.set(KV.content(item.id), item)
    await kv.sadd(KV.contentIndex, item.id)

    return NextResponse.json({ id: item.id, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save content", details: String(error) },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Create the single content item route**

```typescript
// Website/src/app/api/gtm/content/[id]/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { del } from "@vercel/blob"
import { KV, requireGtmAuth, type ContentItem } from "@/lib/gtm/content-types"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    const item = await kv.get<ContentItem>(KV.content(id))
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "KV not available" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    // Check for attached blob file
    const item = await kv.get<ContentItem>(KV.content(id))
    if (item?.blobUrl) {
      try {
        await del(item.blobUrl)
      } catch {
        // Blob may already be gone
      }
    }

    await kv.del(KV.content(id))
    await kv.srem(KV.contentIndex, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete content", details: String(error) },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add Website/src/app/api/gtm/content/route.ts Website/src/app/api/gtm/content/\[id\]/route.ts
git commit -m "feat(gtm): add content library API routes (GET/POST/DELETE)"
```

---

### Task 3: Calendar API Routes

**Files:**
- Create: `Website/src/app/api/gtm/calendar/route.ts`
- Create: `Website/src/app/api/gtm/calendar/[id]/route.ts`

- [ ] **Step 1: Create the calendar list/create/bulk-update route**

```typescript
// Website/src/app/api/gtm/calendar/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type CalendarTask } from "@/lib/gtm/content-types"

export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const ids = await kv.smembers(KV.calendarIndex) as string[]
    const tasks: CalendarTask[] = []

    for (const id of ids) {
      const task = await kv.get<CalendarTask>(KV.calendar(id))
      if (task) tasks.push(task)
    }

    tasks.sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date)
      if (dateCmp !== 0) return dateCmp
      return a.sortOrder - b.sortOrder
    })

    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ tasks: [] })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const task = await request.json() as CalendarTask

    if (!task.id) {
      task.id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    }

    await kv.set(KV.calendar(task.id), task)
    await kv.sadd(KV.calendarIndex, task.id)

    return NextResponse.json({ id: task.id, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task", details: String(error) },
      { status: 500 }
    )
  }
}

// PUT: Bulk update (drag-drop reorder)
export async function PUT(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tasks = await request.json() as CalendarTask[]

    for (const task of tasks) {
      await kv.set(KV.calendar(task.id), task)
      await kv.sadd(KV.calendarIndex, task.id)
    }

    return NextResponse.json({ success: true, count: tasks.length })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to bulk update tasks", details: String(error) },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Create the single calendar task route**

```typescript
// Website/src/app/api/gtm/calendar/[id]/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { KV, requireGtmAuth, type CalendarTask } from "@/lib/gtm/content-types"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    const updates = await request.json() as Partial<CalendarTask>
    const existing = await kv.get<CalendarTask>(KV.calendar(id))

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updated = { ...existing, ...updates, id }
    await kv.set(KV.calendar(id), updated)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task", details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    await kv.del(KV.calendar(id))
    await kv.srem(KV.calendarIndex, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task", details: String(error) },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add Website/src/app/api/gtm/calendar/route.ts Website/src/app/api/gtm/calendar/\[id\]/route.ts
git commit -m "feat(gtm): add calendar API routes (GET/POST/PUT/DELETE + bulk)"
```

---

### Task 4: Microsites Publish Pipeline API

**Files:**
- Create: `Website/src/app/api/gtm/microsites/route.ts`
- Create: `Website/src/app/api/gtm/microsites/[slug]/route.ts`

- [ ] **Step 1: Create the microsites list/publish route**

The POST handler strips brand-nav artifacts from HTML before uploading to Blob.

```typescript
// Website/src/app/api/gtm/microsites/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { put } from "@vercel/blob"
import { KV, requireGtmAuth, type MicrositeRecord } from "@/lib/gtm/content-types"

const token = process.env.BLOB_READ_WRITE_TOKEN || ""

// Strip brand-nav and internal tooling scripts from HTML
function stripBrandNav(html: string): string {
  return html
    // Remove brand-nav CSS link
    .replace(/<link[^>]*brand-nav\.css[^>]*\/?>/gi, "")
    // Remove brand-nav JS script
    .replace(/<script[^>]*brand-nav\.js[^>]*><\/script>/gi, "")
    // Remove BRAND_SKIP_AUTH script block
    .replace(/<script>\s*window\.BRAND_SKIP_AUTH\s*=\s*true;\s*<\/script>/gi, "")
    // Remove theme persistence IIFE
    .replace(/<script>\s*\(function\(\)\{var t=localStorage\.getItem\('mk-theme'\);if\(t\)document\.documentElement\.dataset\.theme=t;\}\)\(\);\s*<\/script>/gi, "")
    // Remove asset path-fix script (the one that rewrites /gtm/assets/ to /assets/)
    .replace(/<script>\s*document\.querySelectorAll\('img'\)\.forEach[\s\S]*?<\/script>/gi, "")
}

export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const slugs = await kv.smembers(KV.micrositeIndex) as string[]
    const sites: MicrositeRecord[] = []

    for (const slug of slugs) {
      const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
      if (record) sites.push(record)
    }

    sites.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json({ sites })
  } catch {
    return NextResponse.json({ sites: [] })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      slug: string
      title: string
      description?: string
      solution: string
      html: string
      contentId?: string
    }

    if (!body.slug || !body.html) {
      return NextResponse.json({ error: "Missing slug or html" }, { status: 400 })
    }

    // Sanitize slug: lowercase, alphanumeric + hyphens only
    const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")

    // Strip brand-nav from HTML
    const cleanHtml = stripBrandNav(body.html)

    // Upload to Blob
    const blob = await put(`gtm/microsites/${slug}.html`, cleanHtml, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/html",
      token,
    })

    // Create KV record
    const record: MicrositeRecord = {
      slug,
      title: body.title,
      description: body.description,
      solution: body.solution,
      blobUrl: blob.url,
      contentId: body.contentId,
      publishedAt: new Date().toISOString(),
    }

    await kv.set(KV.microsite(slug), record)
    await kv.sadd(KV.micrositeIndex, slug)

    return NextResponse.json({ success: true, slug, blobUrl: blob.url })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to publish microsite", details: String(error) },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Create the single microsite route**

```typescript
// Website/src/app/api/gtm/microsites/[slug]/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { put, del } from "@vercel/blob"
import { KV, requireGtmAuth, type MicrositeRecord } from "@/lib/gtm/content-types"

const token = process.env.BLOB_READ_WRITE_TOKEN || ""

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  try {
    const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(record)
  } catch {
    return NextResponse.json({ error: "KV not available" }, { status: 500 })
  }
}

// Re-publish with new HTML
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  try {
    const existing = await kv.get<MicrositeRecord>(KV.microsite(slug))
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await request.json() as { html: string; title?: string; description?: string }

    // Upload new HTML to Blob (overwrites existing)
    const blob = await put(`gtm/microsites/${slug}.html`, body.html, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/html",
      token,
    })

    const updated: MicrositeRecord = {
      ...existing,
      blobUrl: blob.url,
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      publishedAt: new Date().toISOString(),
    }

    await kv.set(KV.microsite(slug), updated)

    return NextResponse.json({ success: true, blobUrl: blob.url })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to re-publish", details: String(error) },
      { status: 500 }
    )
  }
}

// Unpublish: delete Blob file + KV record
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  try {
    const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
    if (record?.blobUrl) {
      try {
        await del(record.blobUrl)
      } catch {
        // Blob may already be gone
      }
    }

    await kv.del(KV.microsite(slug))
    await kv.srem(KV.micrositeIndex, slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unpublish", details: String(error) },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add Website/src/app/api/gtm/microsites/route.ts Website/src/app/api/gtm/microsites/\[slug\]/route.ts
git commit -m "feat(gtm): add microsites publish pipeline API with brand-nav stripping"
```

---

### Task 5: Microsite Serving Page

**Files:**
- Create: `Website/src/app/m/[slug]/page.tsx`

- [ ] **Step 1: Create the microsite serving page**

This is a server component. No auth required (public-facing). Looks up the microsite record from KV and renders an iframe to the Blob CDN URL.

```tsx
// Website/src/app/m/[slug]/page.tsx
import { kv } from "@vercel/kv"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface MicrositeRecord {
  slug: string
  title: string
  description?: string
  solution: string
  blobUrl: string
  contentId?: string
  publishedAt: string
}

const KV_KEY = (slug: string) => `gtm:microsite:${slug}`

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const record = await kv.get<MicrositeRecord>(KV_KEY(slug))
    if (!record) return {}
    return {
      title: record.title,
      description: record.description,
    }
  } catch {
    return {}
  }
}

export default async function MicrositePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let record: MicrositeRecord | null = null
  try {
    record = await kv.get<MicrositeRecord>(KV_KEY(slug))
  } catch {
    // KV unavailable
  }

  if (!record) notFound()

  return (
    <iframe
      src={record.blobUrl}
      title={record.title}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add Website/src/app/m/\[slug\]/page.tsx
git commit -m "feat(gtm): add microsite serving page at /m/[slug]"
```

---

### Task 6: Migrate Calendar Page from localStorage to API

**Files:**
- Modify: `Website/src/app/gtm/calendar/page.tsx`

This is the largest frontend migration. The page currently uses `loadTasks()` / `saveTasks()` functions that read/write localStorage. We replace these with API calls and add a loading state.

- [ ] **Step 1: Replace loadTasks/saveTasks with API fetch and add loading state**

In `Website/src/app/gtm/calendar/page.tsx`, replace the localStorage functions and update the component:

Remove these lines (approximately lines 31-54):
```typescript
// DELETE THIS BLOCK
const STORAGE_KEY = "gtm_calendar_tasks"

function loadTasks(): CalendarTask[] {
  if (typeof window === "undefined") return defaultCalendarTasks
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const tasks: CalendarTask[] = JSON.parse(stored)
      const existingIds = new Set(tasks.map((t) => t.id))
      for (const dt of defaultCalendarTasks) {
        if (!existingIds.has(dt.id)) tasks.push(dt)
      }
      return tasks
    }
  } catch { /* ignore */ }
  return defaultCalendarTasks
}

function saveTasks(tasks: CalendarTask[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch { /* ignore */ }
}
```

Replace with:
```typescript
async function fetchTasks(): Promise<CalendarTask[]> {
  try {
    const res = await fetch("/api/gtm/calendar")
    if (!res.ok) return defaultCalendarTasks
    const data = await res.json()
    if (!data.tasks || data.tasks.length === 0) return defaultCalendarTasks
    // Merge any default tasks that might be missing
    const existingIds = new Set(data.tasks.map((t: CalendarTask) => t.id))
    for (const dt of defaultCalendarTasks) {
      if (!existingIds.has(dt.id)) data.tasks.push(dt)
    }
    return data.tasks
  } catch {
    return defaultCalendarTasks
  }
}
```

- [ ] **Step 2: Update the component's state initialization and effects**

In the `CalendarPage` component, add a `loading` state and replace the localStorage effects:

```typescript
// Add loading state alongside the existing useState declarations
const [loading, setLoading] = useState(true)
```

Replace the two `useEffect` blocks (the `loadTasks` one and the `saveTasks` one) with a single fetch-on-mount effect:

```typescript
useEffect(() => {
  fetchTasks().then((loaded) => {
    setTasks(loaded)
    setMounted(true)
    setLoading(false)
  })
}, [])
```

Remove the `saveTasks` useEffect entirely (the one with `[tasks, mounted]` dependency). Individual operations will now call the API directly.

- [ ] **Step 3: Update handleToggleComplete to call the API**

Replace the existing `handleToggleComplete`:

```typescript
const handleToggleComplete = useCallback((taskId: string) => {
  setTasks((prev) => {
    const updated = prev.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    )
    const task = updated.find((t) => t.id === taskId)
    if (task) {
      fetch(`/api/gtm/calendar/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).catch(() => {})
    }
    return updated
  })
  setSelectedTask((prev) =>
    prev && prev.id === taskId ? { ...prev, completed: !prev.completed } : prev
  )
}, [])
```

- [ ] **Step 4: Update handleUpdateTask to call the API**

```typescript
const handleUpdateTask = useCallback((taskId: string, updates: Partial<CalendarTask>) => {
  setTasks((prev) => {
    const updated = prev.map((t) =>
      t.id === taskId ? { ...t, ...updates } : t
    )
    const task = updated.find((t) => t.id === taskId)
    if (task) {
      fetch(`/api/gtm/calendar/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).catch(() => {})
    }
    return updated
  })
  setSelectedTask((prev) =>
    prev && prev.id === taskId ? { ...prev, ...updates } : prev
  )
}, [])
```

- [ ] **Step 5: Update handleDeleteTask to call the API**

```typescript
const handleDeleteTask = useCallback((taskId: string) => {
  setTasks((prev) => prev.filter((t) => t.id !== taskId))
  setSelectedTask(null)
  fetch(`/api/gtm/calendar/${taskId}`, { method: "DELETE" }).catch(() => {})
}, [])
```

- [ ] **Step 6: Update handleResetTasks to call the API**

```typescript
const handleResetTasks = useCallback(async () => {
  // Delete all tasks from KV
  for (const task of tasks) {
    fetch(`/api/gtm/calendar/${task.id}`, { method: "DELETE" }).catch(() => {})
  }
  // Re-seed with defaults
  setTasks(defaultCalendarTasks)
  for (const task of defaultCalendarTasks) {
    fetch("/api/gtm/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }).catch(() => {})
  }
}, [tasks])
```

- [ ] **Step 7: Update handleDragEnd to call the API for date changes and reorder**

In the existing `handleDragEnd`, after each `setTasks` call, add an API call. For the day-column drop case:

```typescript
if (overId.startsWith("day-")) {
  const newDate = overId.replace("day-", "")
  setTasks((prev) =>
    prev.map((t) =>
      t.id === activeTaskId ? { ...t, date: newDate } : t
    )
  )
  // Persist date change
  const task = tasks.find((t) => t.id === activeTaskId)
  if (task) {
    fetch(`/api/gtm/calendar/${activeTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, date: newDate }),
    }).catch(() => {})
  }
  return
}
```

For the reorder case (within same day), after the `setTasks` call, add a bulk update:

```typescript
// After the reorder setTasks call, add:
const reorderedTasks = reordered.map((t, i) => ({ ...t, sortOrder: i }))
fetch("/api/gtm/calendar", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(reorderedTasks),
}).catch(() => {})
```

For the date-move-to-another-task case:

```typescript
// Move to new date
setTasks((prev) =>
  prev.map((t) =>
    t.id === activeTaskId ? { ...t, date: overTask.date } : t
  )
)
fetch(`/api/gtm/calendar/${activeTaskId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...activeTask, date: overTask.date }),
}).catch(() => {})
```

- [ ] **Step 8: Add loading UI**

Before the page header `<div>`, add a loading state check:

```tsx
if (loading) {
  return (
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "120px 48px",
      textAlign: "center",
    }}>
      <p style={{
        fontSize: 14,
        color: "var(--gtm-text-muted)",
        fontFamily: font,
      }}>
        Loading calendar...
      </p>
    </div>
  )
}
```

- [ ] **Step 9: Remove the localStorage.removeItem call in handleResetTasks**

The old `handleResetTasks` had `localStorage.removeItem(STORAGE_KEY)`. This line was replaced in Step 6, but verify it is no longer present.

- [ ] **Step 10: Commit**

```bash
git add Website/src/app/gtm/calendar/page.tsx
git commit -m "feat(gtm): migrate calendar page from localStorage to API"
```

---

### Task 7: Migrate ContentBuilder.tsx from localStorage to API

**Files:**
- Modify: `Website/src/components/gtm/ContentBuilder.tsx`

Two localStorage operations to replace: `handleSave` (saves to content library) and `handleSchedule` (creates calendar task).

- [ ] **Step 1: Update handleSave to use the content API**

Replace the existing `handleSave` callback (approximately lines 275-307) with:

```typescript
const handleSave = useCallback(async () => {
  if (!output || !motion || !selectedContent) return

  const tags = [motion, ...(vertical ? [vertical] : []), selectedContent]
  if (selectedContent === "social-post") tags.push(platform)

  const newItem = {
    id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    contentType: selectedContent,
    platform: selectedContent === "social-post" ? activePlatformView : undefined,
    motion,
    solution,
    content: output,
    graphic: capturedGraphic || uploadedGraphic || undefined, // base64 inline graphic
    createdAt: new Date().toISOString(),
    tags,
  }

  try {
    const res = await fetch("/api/gtm/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onLibraryChange?.(0) // Signal that library changed; component will refetch
    }
  } catch {
    // Fall through silently
  }
}, [output, motion, vertical, selectedContent, platform, activePlatformView, solution, capturedGraphic, uploadedGraphic, onLibraryChange])
```

- [ ] **Step 2: Update handleSchedule to use the calendar API**

Replace the existing `handleSchedule` callback (approximately lines 323-383) with:

```typescript
const handleSchedule = useCallback(async () => {
  if (!scheduleDate || !output || !motion || !selectedContent) return

  const dtParts = scheduleDate.split("T")
  const dateOnly = dtParts[0]
  const hour = dtParts[1] ? parseInt(dtParts[1].split(":")[0], 10) : 9
  const timeSlot: "morning" | "afternoon" = hour < 12 ? "morning" : "afternoon"

  const ct = contentTypes.find((c) => c.key === selectedContent)
  const categoryMap: Record<string, string> = {
    "social-post": "linkedin-post",
    "cold-emails": "cold-email",
    "linkedin-dm": "cold-email",
    "lead-magnet": "lead-magnet",
    "discovery-script": "discovery-call",
    "partner-pitch": "partner-outreach",
    "battle-card": "content-creation",
    "microsite": "content-creation",
    "one-pager": "content-creation",
  }

  const newTask = {
    id: `task-scheduled-${crypto.randomUUID().slice(0, 8)}`,
    title: `${ct?.label || selectedContent}: ${output.slice(0, 60).replace(/\n/g, " ")}...`,
    category: categoryMap[selectedContent] || "content-creation",
    solution,
    date: dateOnly,
    timeSlot,
    duration: 30,
    completed: false,
    description: output.slice(0, 500),
    sortOrder: 99,
    roxTouchpoint: "Engagement Quality",
  }

  try {
    const res = await fetch("/api/gtm/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
    if (res.ok) {
      setScheduled(true)
      setShowScheduler(false)
      setTimeout(() => setScheduled(false), 3000)
    }
  } catch {
    // Fall through silently
  }
}, [scheduleDate, output, motion, selectedContent, solution])
```

- [ ] **Step 3: Commit**

```bash
git add Website/src/components/gtm/ContentBuilder.tsx
git commit -m "feat(gtm): migrate ContentBuilder save/schedule from localStorage to API"
```

---

### Task 8: Migrate ContentLibrary.tsx from localStorage to API

**Files:**
- Modify: `Website/src/components/gtm/ContentLibrary.tsx`

- [ ] **Step 1: Replace localStorage load/save/delete with API calls**

Replace the `loadLibrary` and `saveLibrary` functions (lines 9-22) and update the component:

Remove:
```typescript
function loadLibrary(solution: string): SavedContentItem[] {
  try {
    const stored = localStorage.getItem(`gtm_library_${solution}`)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLibrary(solution: string, items: SavedContentItem[]): void {
  try {
    localStorage.setItem(`gtm_library_${solution}`, JSON.stringify(items))
  } catch { /* quota */ }
}
```

Replace with:
```typescript
async function fetchLibrary(solution: string): Promise<SavedContentItem[]> {
  try {
    const res = await fetch(`/api/gtm/content?solution=${encodeURIComponent(solution)}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.items || []).map((item: Record<string, unknown>) => ({
      id: item.id as string,
      contentType: item.contentType as string,
      platform: item.platform as "linkedin" | "twitter" | "instagram" | undefined,
      motion: item.motion as "direct" | "partner",
      vertical: (item.solution as string) || null,
      content: item.content as string,
      graphic: (item.graphic || item.blobUrl) as string | undefined,
      savedAt: item.createdAt as string,
      tags: item.tags as string[],
    }))
  } catch {
    return []
  }
}
```

- [ ] **Step 2: Update component state and effects**

Add loading state and replace the `useEffect`:

```typescript
const [loading, setLoading] = useState(true)
```

Replace the existing useEffect:
```typescript
useEffect(() => {
  setLoading(true)
  fetchLibrary(solution).then((loaded) => {
    setItems(loaded)
    setLoading(false)
  })
}, [solution])
```

- [ ] **Step 3: Update handleDelete to use the API**

```typescript
const handleDelete = useCallback(
  async (id: string) => {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    try {
      await fetch(`/api/gtm/content/${id}`, { method: "DELETE" })
    } catch {
      // Fall through
    }
  },
  [items]
)
```

- [ ] **Step 4: Add loading UI before the empty state check**

Before the existing `if (items.length === 0)` block, add:

```tsx
if (loading) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 400,
    }}>
      <p style={{
        fontSize: 14,
        color: "var(--gtm-text-muted)",
        fontFamily: font,
      }}>
        Loading library...
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add Website/src/components/gtm/ContentLibrary.tsx
git commit -m "feat(gtm): migrate ContentLibrary from localStorage to API"
```

---

### Task 9: Content Dashboard Page

**Files:**
- Create: `Website/src/app/gtm/content/page.tsx`

- [ ] **Step 1: Create the content dashboard page**

This page shows all content (published and unpublished) grouped by solution, with solution tabs, content type filtering, and publish/unpublish actions for microsites.

```tsx
// Website/src/app/gtm/content/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Copy,
  Check,
  Trash2,
  Eye,
  X,
  ExternalLink,
  Link2,
  Globe,
  FileText,
  Share2,
  MessageSquare,
  BookOpen,
  Phone,
  Handshake,
  Shield,
  FileBarChart,
} from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface ContentItem {
  id: string
  contentType: string
  platform?: string
  motion: "direct" | "partner"
  solution: string
  content: string
  blobUrl?: string
  createdAt: string
  tags: string[]
}

interface MicrositeRecord {
  slug: string
  title: string
  description?: string
  solution: string
  blobUrl: string
  contentId?: string
  publishedAt: string
}

const solutionTabs = [
  { key: "all", label: "All" },
  { key: "trade-shows", label: "Trade Shows" },
  { key: "recruiting", label: "Recruiting" },
  { key: "field-sales", label: "Field Sales" },
  { key: "facilities", label: "Facilities" },
  { key: "events-venues", label: "Events & Venues" },
]

const contentTypeMap: Record<string, { label: string; icon: typeof FileText }> = {
  "cold-emails": { label: "Cold Emails", icon: FileText },
  "social-post": { label: "Social Post", icon: Share2 },
  "linkedin-dm": { label: "LinkedIn DM", icon: MessageSquare },
  "lead-magnet": { label: "Lead Magnet", icon: BookOpen },
  "discovery-script": { label: "Discovery Script", icon: Phone },
  "partner-pitch": { label: "Partner Pitch", icon: Handshake },
  "battle-card": { label: "Battle Card", icon: Shield },
  "microsite": { label: "Microsite", icon: Globe },
  "one-pager": { label: "One Pager", icon: FileBarChart },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ContentDashboard() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [sites, setSites] = useState<MicrositeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSolution, setActiveSolution] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [copied, setCopied] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<ContentItem | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/gtm/content").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/gtm/microsites").then((r) => r.json()).catch(() => ({ sites: [] })),
    ]).then(([contentData, siteData]) => {
      setItems(contentData.items || [])
      setSites(siteData.sites || [])
      setLoading(false)
    })
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    try {
      await fetch(`/api/gtm/content/${id}`, { method: "DELETE" })
    } catch {}
  }, [])

  const handleUnpublish = useCallback(async (slug: string) => {
    setSites((prev) => prev.filter((s) => s.slug !== slug))
    try {
      await fetch(`/api/gtm/microsites/${slug}`, { method: "DELETE" })
    } catch {}
  }, [])

  const handleCopyLink = useCallback((slug: string) => {
    const url = `${window.location.origin}/m/${slug}`
    navigator.clipboard.writeText(url)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleCopyContent = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  // Build a map of contentId -> MicrositeRecord for matching
  const siteByContentId = new Map<string, MicrositeRecord>()
  for (const site of sites) {
    if (site.contentId) siteByContentId.set(site.contentId, site)
  }

  // Filter items
  const filtered = items.filter((item) => {
    if (activeSolution !== "all" && item.solution !== activeSolution) return false
    if (typeFilter !== "all" && item.contentType !== typeFilter) return false
    return true
  })

  const uniqueTypes = Array.from(new Set(items.map((i) => i.contentType)))

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--gtm-text-muted)", fontFamily: font }}>
          Loading content...
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 48px" }}>
      {/* Page Header */}
      <div style={{ padding: "48px 0 0" }}>
        <p style={{
          fontSize: 11, fontWeight: 600, color: "var(--gtm-cyan)",
          letterSpacing: "0.14em", fontFamily: font, marginBottom: 10, textTransform: "uppercase",
        }}>
          CONTENT HUB
        </p>
        <h1 style={{
          fontSize: 36, fontWeight: 300, color: "var(--gtm-text-primary)",
          fontFamily: font, margin: 0, transition: "color 200ms ease",
        }}>
          Content Dashboard
        </h1>
        <p style={{
          fontSize: 16, fontWeight: 400, color: "var(--gtm-text-muted)",
          fontFamily: font, marginTop: 8, transition: "color 200ms ease",
        }}>
          All generated content across solutions. Publish, copy, and manage from one place.
        </p>
      </div>

      {/* Solution Tabs */}
      <div style={{ display: "flex", gap: 4, marginTop: 32, marginBottom: 16, flexWrap: "wrap" }}>
        {solutionTabs.map((tab) => {
          const active = activeSolution === tab.key
          const count = tab.key === "all"
            ? items.length
            : items.filter((i) => i.solution === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSolution(tab.key)}
              style={{
                padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                fontFamily: font, cursor: "pointer",
                border: active ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                background: active ? "var(--gtm-accent-bg)" : "transparent",
                color: active ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                transition: "all 150ms ease",
              }}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Content Type Filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => setTypeFilter("all")}
          style={{
            padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600,
            fontFamily: font, cursor: "pointer",
            border: typeFilter === "all" ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
            background: typeFilter === "all" ? "var(--gtm-accent-bg)" : "transparent",
            color: typeFilter === "all" ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
            transition: "all 150ms ease",
          }}
        >
          All Types
        </button>
        {uniqueTypes.map((type) => {
          const ct = contentTypeMap[type]
          const active = typeFilter === type
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                fontFamily: font, cursor: "pointer",
                border: active ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                background: active ? "var(--gtm-accent-bg)" : "transparent",
                color: active ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                transition: "all 150ms ease",
              }}
            >
              {ct?.label || type}
            </button>
          )
        })}
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <div style={{
          border: "2px dashed var(--gtm-border)", borderRadius: 12,
          padding: 48, textAlign: "center", marginTop: 32,
        }}>
          <p style={{ fontSize: 14, color: "var(--gtm-text-muted)", fontFamily: font, margin: 0 }}>
            No content found for this filter.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {filtered.map((item) => {
            const ct = contentTypeMap[item.contentType]
            const Icon = ct?.icon || FileText
            const micrositeRecord = siteByContentId.get(item.id)

            return (
              <div
                key={item.id}
                style={{
                  background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)",
                  borderRadius: 10, padding: 20, display: "flex", flexDirection: "column",
                  transition: "all 200ms ease",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon size={14} style={{ color: "var(--gtm-accent)", flexShrink: 0 }} />
                    <span style={{
                      fontSize: 13, fontWeight: 700, color: "var(--gtm-text-primary)",
                      fontFamily: font, transition: "color 200ms ease",
                    }}>
                      {ct?.label || item.contentType}
                    </span>
                    {micrositeRecord && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
                        background: "rgba(0,187,165,0.15)", color: "#00BBA5", fontFamily: font,
                      }}>
                        LIVE
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font }}>
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Preview */}
                <p style={{
                  fontSize: 13, color: "var(--gtm-text-muted)", fontFamily: font,
                  lineHeight: 1.6, margin: 0, flex: 1, transition: "color 200ms ease",
                }}>
                  {item.content.slice(0, 120)}{item.content.length > 120 ? "..." : ""}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
                  {item.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 3,
                        background: "var(--gtm-accent-bg)", color: "var(--gtm-accent-text)", fontFamily: font,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Published microsite URL */}
                {micrositeRecord && (
                  <div style={{
                    marginTop: 10, padding: "8px 12px", borderRadius: 6,
                    background: "rgba(0,187,165,0.06)", border: "1px solid rgba(0,187,165,0.2)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Link2 size={12} style={{ color: "#00BBA5", flexShrink: 0 }} />
                    <span style={{
                      fontSize: 12, color: "#00BBA5", fontFamily: font, fontWeight: 500,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                    }}>
                      /m/{micrositeRecord.slug}
                    </span>
                    <button
                      onClick={() => handleCopyLink(micrositeRecord.slug)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: copied === micrositeRecord.slug ? "#00BBA5" : "var(--gtm-text-faint)",
                        padding: 2, display: "flex",
                      }}
                    >
                      {copied === micrositeRecord.slug ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    <a
                      href={`/m/${micrositeRecord.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--gtm-text-faint)", display: "flex", padding: 2 }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: "flex", gap: 6, marginTop: 12,
                  borderTop: "1px solid var(--gtm-border)", paddingTop: 12,
                }}>
                  <button
                    onClick={() => setViewItem(item)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                      background: "transparent", fontSize: 11, fontWeight: 600,
                      fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Eye size={12} /> View
                  </button>
                  <button
                    onClick={() => handleCopyContent(item.id, item.content)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                      background: "transparent", fontSize: 11, fontWeight: 600,
                      fontFamily: font, cursor: "pointer", transition: "all 150ms ease",
                      color: copied === item.id ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                    }}
                  >
                    {copied === item.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                  {micrositeRecord && (
                    <button
                      onClick={() => handleUnpublish(micrositeRecord.slug)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                        background: "transparent", fontSize: 11, fontWeight: 600,
                        fontFamily: font, color: "#E5484D", cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                    >
                      <X size={12} /> Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 4, border: "1px solid var(--gtm-border)",
                      background: "transparent", fontSize: 11, fontWeight: 600,
                      fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease", marginLeft: "auto",
                    }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setViewItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--gtm-bg-card)", borderRadius: 12, padding: 32,
              maxWidth: 700, width: "90%", maxHeight: "80vh", overflowY: "auto",
              border: "1px solid var(--gtm-border)", position: "relative",
            }}
          >
            <button
              onClick={() => setViewItem(null)}
              style={{
                position: "absolute", top: 16, right: 16, background: "transparent",
                border: "none", cursor: "pointer", color: "var(--gtm-text-faint)", padding: 4,
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{
                fontSize: 16, fontWeight: 700, color: "var(--gtm-text-primary)", fontFamily: font,
              }}>
                {contentTypeMap[viewItem.contentType]?.label || viewItem.contentType}
              </span>
              {viewItem.platform && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                  background: "var(--gtm-accent-bg)", color: "var(--gtm-accent-text)", fontFamily: font,
                }}>
                  {viewItem.platform}
                </span>
              )}
            </div>

            <pre style={{
              whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: font,
              fontSize: 14, lineHeight: 1.75, color: "var(--gtm-text-primary)",
              margin: 0, background: "var(--gtm-bg-page)", padding: 20,
              borderRadius: 8, border: "1px solid var(--gtm-border)",
            }}>
              {viewItem.content}
            </pre>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => handleCopyContent(viewItem.id, viewItem.content)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                  borderRadius: 6, border: "1px solid var(--gtm-border)",
                  background: "var(--gtm-bg-card)", fontSize: 13, fontWeight: 600,
                  fontFamily: font, cursor: "pointer", transition: "all 200ms ease",
                  color: copied === viewItem.id ? "var(--gtm-accent)" : "var(--gtm-text-primary)",
                }}
              >
                {copied === viewItem.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy All</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add Website/src/app/gtm/content/page.tsx
git commit -m "feat(gtm): add content dashboard page grouped by solution"
```

---

### Task 10: Verify and Test End-to-End

**Files:** (no new files)

- [ ] **Step 1: Run the dev server**

```bash
cd /Users/jakehamann/Development/Momentify/Website && npx next dev
```

- [ ] **Step 2: Test content API**

Open the GTM tool, navigate to a solution page (e.g., Trade Shows), go to the Content Builder tab. Generate content and click Save. Verify:
- No console errors
- Content persists after page refresh (not just in-memory)
- Content Library tab shows the saved item

- [ ] **Step 3: Test calendar API**

Navigate to the Calendar page. Verify:
- Tasks load (either from KV or defaults)
- Drag-drop reorder works and persists after refresh
- Toggle complete works and persists
- Delete works and persists

- [ ] **Step 4: Test schedule from Content Builder**

Generate content, click "Schedule to Calendar", pick a date/time, confirm. Navigate to the Calendar page and verify the task appears.

- [ ] **Step 5: Test content dashboard**

Navigate to `/gtm/content`. Verify:
- All content loads grouped by solution
- Solution tab filtering works
- Content type filtering works
- View, Copy, Delete actions work

- [ ] **Step 6: Test microsite publish (requires a microsite content item)**

If a microsite content item exists, test the publish flow from the dashboard. After publishing, verify `/m/{slug}` serves the microsite in an iframe.

- [ ] **Step 7: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(gtm): address issues found during end-to-end testing"
```
