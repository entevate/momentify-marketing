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
