/**
 * Public page serving: /p/<slug>
 * Fetches the stored HTML from Blob, injects OG/Twitter meta into <head>
 * and the view/time tracking beacon before </body>. No auth — these URLs
 * are the shareable deliverable. (Coexists with the legacy /m/<slug>
 * microsite route; new tracked pages live under /p.)
 */

import { NextResponse } from 'next/server'
import { kv } from '@/lib/gtm/kv-store'
import { PAGES_KEY, type PageItem } from '@/lib/gtm/pages-types'

export const maxDuration = 30

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function beacon(slug: string): string {
  return `<script>(function(){var g="${slug}";var v;try{v=localStorage.getItem("pvn_vid")||Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem("pvn_vid",v)}catch(e){v="anon"}
var send=function(ev,s){try{navigator.sendBeacon("/api/gtm/page-event",new Blob([JSON.stringify({slug:g,vid:v,event:ev,seconds:s||0,referrer:ev==="view"?document.referrer:undefined})],{type:"application/json"}))}catch(e){}};
send("view");var t0=Date.now(),acc=0,vis=!document.hidden;
var flush=function(){if(vis){acc+=Date.now()-t0}t0=Date.now()};
document.addEventListener("visibilitychange",function(){flush();vis=!document.hidden});
var fin=function(){flush();var s=Math.round(acc/1000);if(s>0){send("time",s);acc=0}};
addEventListener("pagehide",fin);
setInterval(function(){flush();var s=Math.round(acc/1000);if(s>=15){send("time",s);acc=0}},15000);
})();</script>`
}

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }): Promise<NextResponse> {
  const { slug } = await ctx.params
  try {
    const raw = await kv.get(PAGES_KEY)
    const pages: PageItem[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : (raw as PageItem[])) : []
    const page = pages.find((p) => p.slug === slug)
    if (!page) {
      // Renamed slugs live in gtm:pages:redirects {old: new} — shared links
      // must keep working after a correction.
      try {
        const rraw = await kv.get('gtm:pages:redirects')
        const redirects: Record<string, string> = rraw ? (typeof rraw === 'string' ? JSON.parse(rraw) : (rraw as Record<string, string>)) : {}
        const target = redirects[slug]
        if (target && pages.some((p) => p.slug === target)) {
          return NextResponse.redirect(new URL(`/p/${target}`, request.url), 301)
        }
      } catch { /* fall through to 404 */ }
      return new NextResponse('Not found', { status: 404 })
    }

    const res = await fetch(page.htmlUrl, { cache: 'no-store' })
    if (!res.ok) return new NextResponse('Page unavailable', { status: 502 })
    let html = await res.text()

    const origin = new URL(request.url).origin
    const pageUrl = `${origin}/p/${page.slug}`
    const meta = [
      `<meta property="og:type" content="article"/>`,
      `<meta property="og:title" content="${esc(page.title)}"/>`,
      page.description && `<meta property="og:description" content="${esc(page.description)}"/>`,
      page.description && `<meta name="description" content="${esc(page.description)}"/>`,
      `<meta property="og:url" content="${pageUrl}"/>`,
      page.ogImage && `<meta property="og:image" content="${esc(page.ogImage)}"/>`,
      page.ogImage && `<meta property="og:image:width" content="1200"/>`,
      page.ogImage && `<meta property="og:image:height" content="630"/>`,
      `<meta name="twitter:card" content="${page.ogImage ? 'summary_large_image' : 'summary'}"/>`,
      `<meta name="twitter:title" content="${esc(page.title)}"/>`,
      page.description && `<meta name="twitter:description" content="${esc(page.description)}"/>`,
      page.ogImage && `<meta name="twitter:image" content="${esc(page.ogImage)}"/>`,
    ]
      .filter(Boolean)
      .join('\n')

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, (mm) => `${mm}\n${meta}`)
    } else {
      html = `<head>${meta}</head>${html}`
    }
    if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `${beacon(page.slug)}</body>`)
    } else {
      html += beacon(page.slug)
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // short edge cache keeps repeat opens fast without staling updates long
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('page serve failed:', error)
    return new NextResponse('Page unavailable', { status: 500 })
  }
}
