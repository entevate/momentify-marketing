import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  // Gated: only the authed UI asks; infographic-preview stays open (iframes cannot send headers). It used to be open to anyone who found the URL.
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const solution = searchParams.get("solution")

  if (!solution) {
    return NextResponse.json({ exists: false })
  }

  try {
    const publicPath = path.join(process.cwd(), `public/gtm/${solution}-infographic.html`)
    const exists = fs.existsSync(publicPath)
    return NextResponse.json({ exists })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
