import { kv } from "@vercel/kv"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { KV, type MicrositeRecord } from "@/lib/gtm/content-types"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const record = await kv.get<MicrositeRecord>(KV.microsite(slug))
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
    record = await kv.get<MicrositeRecord>(KV.microsite(slug))
  } catch {
    // KV unavailable
  }

  if (!record) notFound()

  return (
    <iframe
      src={record.blobUrl}
      title={record.title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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
