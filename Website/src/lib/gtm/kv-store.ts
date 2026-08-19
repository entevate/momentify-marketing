/**
 * KV store with local file fallback.
 *
 * Wraps `@vercel/kv` so the app works without Vercel KV configured (i.e. local
 * dev). On the first call it probes Vercel KV; if the env vars (KV_REST_API_URL
 * + KV_REST_API_TOKEN) are missing or the probe throws, it switches to a
 * file-backed JSON store at `.gtm-kv-fallback.json` in the project root.
 *
 * Same surface as `@vercel/kv`'s `kv` for the methods we actually use:
 *   get, set, del, smembers, sadd, srem, incr, lpush, ltrim, lrange, mget
 *
 * Usage:
 *   import { kv } from "@/lib/gtm/kv-store"   // drop-in for `@vercel/kv`'s `kv`
 *
 * Production with KV configured: zero behavior change.
 * Local dev without KV: data persists across restarts via a file in cwd
 * (gitignored — add to .gitignore if not already).
 */

import { kv as vercelKv } from "@vercel/kv"
import fs from "fs/promises"
import path from "path"

type Json = string | number | boolean | null | Json[] | { [k: string]: Json }
type StoreShape = Record<string, Json>

const FALLBACK_FILE = path.join(process.cwd(), ".gtm-kv-fallback.json")

let modeResolved = false
let useVercelKv = false
let fallbackCache: StoreShape | null = null

async function resolveMode(): Promise<boolean> {
  if (modeResolved) return useVercelKv
  // The Vercel KV SDK throws if KV_REST_API_URL / KV_REST_API_TOKEN are absent.
  // Cheap probe: try a get on a sentinel key. Any throw -> fall back to fs.
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      throw new Error("vercel kv not configured")
    }
    await vercelKv.get("__kv_probe__")
    useVercelKv = true
  } catch {
    useVercelKv = false
  }
  modeResolved = true
  return useVercelKv
}

async function readStore(): Promise<StoreShape> {
  if (fallbackCache) return fallbackCache
  try {
    const raw = await fs.readFile(FALLBACK_FILE, "utf-8")
    fallbackCache = JSON.parse(raw) as StoreShape
  } catch {
    fallbackCache = {}
  }
  return fallbackCache
}

async function writeStore(): Promise<void> {
  if (!fallbackCache) return
  await fs.writeFile(FALLBACK_FILE, JSON.stringify(fallbackCache, null, 2), "utf-8")
}

export const kv = {
  async get<T>(key: string): Promise<T | null> {
    if (await resolveMode()) {
      return vercelKv.get<T>(key)
    }
    const store = await readStore()
    const v = store[key]
    return (v === undefined ? null : (v as unknown as T))
  },

  async set(key: string, value: unknown): Promise<unknown> {
    if (await resolveMode()) {
      return vercelKv.set(key, value)
    }
    const store = await readStore()
    store[key] = value as Json
    await writeStore()
    return "OK"
  },

  async del(key: string): Promise<number> {
    if (await resolveMode()) {
      return vercelKv.del(key)
    }
    const store = await readStore()
    if (key in store) {
      delete store[key]
      await writeStore()
      return 1
    }
    return 0
  },

  async smembers(key: string): Promise<string[]> {
    if (await resolveMode()) {
      return (await vercelKv.smembers(key)) as string[]
    }
    const store = await readStore()
    const v = store[key]
    return Array.isArray(v) ? (v as string[]) : []
  },

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (await resolveMode()) {
      if (members.length === 0) return 0
      return vercelKv.sadd(key, ...(members as [string, ...string[]]))
    }
    const store = await readStore()
    const set = new Set<string>(Array.isArray(store[key]) ? (store[key] as string[]) : [])
    let added = 0
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m)
        added++
      }
    }
    store[key] = Array.from(set)
    await writeStore()
    return added
  },

  async srem(key: string, ...members: string[]): Promise<number> {
    if (await resolveMode()) {
      if (members.length === 0) return 0
      return vercelKv.srem(key, ...(members as [string, ...string[]]))
    }
    const store = await readStore()
    const set = new Set<string>(Array.isArray(store[key]) ? (store[key] as string[]) : [])
    let removed = 0
    for (const m of members) {
      if (set.delete(m)) removed++
    }
    store[key] = Array.from(set)
    await writeStore()
    return removed
  },

  /* ---- Redis list + counter ops (used by the QR scan log) ---- */

  async incr(key: string): Promise<number> {
    if (await resolveMode()) {
      return vercelKv.incr(key)
    }
    const store = await readStore()
    const next = (typeof store[key] === "number" ? (store[key] as number) : 0) + 1
    store[key] = next
    await writeStore()
    return next
  },

  async lpush(key: string, ...values: unknown[]): Promise<number> {
    if (await resolveMode()) {
      return vercelKv.lpush(key, ...(values as [unknown, ...unknown[]]))
    }
    const store = await readStore()
    const list = Array.isArray(store[key]) ? (store[key] as Json[]) : []
    // Redis LPUSH prepends each value in turn, so a multi-arg push ends up reversed.
    for (const v of values) list.unshift(v as Json)
    store[key] = list
    await writeStore()
    return list.length
  },

  async ltrim(key: string, start: number, stop: number): Promise<string> {
    if (await resolveMode()) {
      return vercelKv.ltrim(key, start, stop)
    }
    const store = await readStore()
    const list = Array.isArray(store[key]) ? (store[key] as Json[]) : []
    store[key] = stop === -1 ? list.slice(start) : list.slice(start, stop + 1)
    await writeStore()
    return "OK"
  },

  async lrange<T = unknown>(key: string, start: number, stop: number): Promise<T[]> {
    if (await resolveMode()) {
      return (await vercelKv.lrange(key, start, stop)) as T[]
    }
    const store = await readStore()
    const list = Array.isArray(store[key]) ? (store[key] as unknown as T[]) : []
    return stop === -1 ? list.slice(start) : list.slice(start, stop + 1)
  },

  async mget<T = unknown>(...keys: string[]): Promise<(T | null)[]> {
    if (await resolveMode()) {
      if (keys.length === 0) return []
      return (await vercelKv.mget<T[]>(...keys)) as (T | null)[]
    }
    const store = await readStore()
    return keys.map((k) => (store[k] === undefined ? null : (store[k] as unknown as T)))
  },
}
