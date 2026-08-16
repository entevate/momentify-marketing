"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Self-contained library count badge.
 *
 * Fetches `/api/gtm/content?solution=X` to compute the count for a single
 * solution, and listens for the `gtm:library-changed` event (dispatched by
 * ContentBuilder + ContentLibrary on save / delete) so it auto-refreshes
 * without requiring prop drilling from a parent tab container.
 *
 * Renders nothing when count is null (pre-auth) or 0 — same behavior as the
 * SolutionTabs badge.
 */

const LIBRARY_CHANGED_EVENT = "gtm:library-changed"

interface LibraryCountBadgeProps {
  solution: string
  /** Optional accent color override; defaults to var(--gtm-accent). */
  color?: string
}

export default function LibraryCountBadge({
  solution,
  color = "var(--gtm-accent)",
}: LibraryCountBadgeProps) {
  const [count, setCount] = useState<number | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/gtm/content?solution=${encodeURIComponent(solution)}&kept=true`)
      if (!res.ok) {
        if (res.status !== 401) setCount(null)
        return
      }
      const data = await res.json()
      setCount(Array.isArray(data.items) ? data.items.length : 0)
    } catch {
      setCount(null)
    }
  }, [solution])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    function onChange(e: Event) {
      const detail = (e as CustomEvent<{ solution?: string }>).detail
      if (!detail || detail.solution === solution) refresh()
    }
    window.addEventListener(LIBRARY_CHANGED_EVENT, onChange)
    return () => window.removeEventListener(LIBRARY_CHANGED_EVENT, onChange)
  }, [refresh, solution])

  if (count === null || count <= 0) return null

  return (
    <span
      aria-label={`${count} saved items`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 6px",
        marginLeft: 6,
        borderRadius: 9,
        background: color,
        color: "#ffffff",
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {count}
    </span>
  )
}
