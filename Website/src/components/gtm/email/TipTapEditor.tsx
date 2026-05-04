"use client"

/**
 * TipTap WYSIWYG editor for the email ComposePane.
 *
 * Output is canonical HTML (editor.getHTML()) which the parent stores
 * directly on EmailDraft.bodyHtml. Server-side sanitization is applied
 * on save (sanitizeEmailHtml in email-parser.ts).
 *
 * Toolbar covers the formatting set commonly supported by email clients:
 * bold, italic, headings, lists, links, blockquote, hr, image upload.
 * Tables intentionally omitted - email-client rendering parity for
 * tables is poor without a templating layer (v2 React Email).
 *
 * Image upload: Insert button opens a file picker, POSTs the file to
 * /api/gtm/email/upload-image, inserts the returned blob URL as an
 * <img> node at the cursor position. Inserted images render full-width
 * by default (constrained by the email shell's 600px content column).
 */

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { useEffect, useRef, useState } from "react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  /** Initial HTML to render. Subsequent changes via prop update do NOT replace editor content. */
  initialHtml?: string
  /** Fires on every content change with the new HTML. */
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ initialHtml, onChange, placeholder = "Write your email..." }: Props) {
  const editor = useEditor({
    immediatelyRender: false, // SSR safety in App Router
    extensions: [
      StarterKit.configure({
        // Strip nodes email clients can't render reliably.
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener", target: "_blank" },
      }),
      Image.configure({
        // Inline images get an inline-block presentation; we want block
        // by default so an inserted image gets its own line in the body.
        inline: false,
        // Allow base64 paste for quick prototyping. Production sends use
        // hosted URLs (the upload helper) so this is just a convenience.
        allowBase64: true,
        HTMLAttributes: {
          // Constrain to the email shell's content width (600px - 32px*2
          // padding = 536px). Inline style so it survives copy-paste.
          style: "max-width:100%;height:auto;display:block;border-radius:6px;margin:12px 0;",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // If parent re-seeds initialHtml after mount (e.g. user picks a Library
  // touch in LibrarySeedPanel), update the editor content.
  useEffect(() => {
    if (!editor) return
    if (initialHtml !== undefined && initialHtml !== editor.getHTML()) {
      editor.commands.setContent(initialHtml || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHtml, editor])

  if (!editor) return null

  return (
    <div style={{ border: "1px solid var(--gtm-border)", borderRadius: 8, background: "#fff", fontFamily: font }}>
      <Toolbar editor={editor} />
      <div style={{ minHeight: 280, padding: "16px 18px", fontSize: 14, lineHeight: 1.6, color: "var(--gtm-text-primary)" }}>
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .tiptap-editor-wrap .ProseMirror { outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--gtm-text-faint);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror p { margin: 0 0 12px 0; }
        .ProseMirror h1 { font-size: 22px; font-weight: 600; margin: 16px 0 10px 0; }
        .ProseMirror h2 { font-size: 18px; font-weight: 600; margin: 14px 0 8px 0; }
        .ProseMirror h3 { font-size: 16px; font-weight: 600; margin: 12px 0 6px 0; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 0 0 12px 0; }
        .ProseMirror blockquote { border-left: 3px solid var(--gtm-border); padding-left: 12px; color: var(--gtm-text-secondary); margin: 0 0 12px 0; }
        .ProseMirror a { color: #1A56DB; text-decoration: underline; }
      `}</style>
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const [tick, setTick] = useState(0)
  // Re-render the toolbar on selection change so isActive() reflects state.
  useEffect(() => {
    const handler = () => setTick((t) => t + 1)
    editor.on("selectionUpdate", handler)
    editor.on("update", handler)
    return () => {
      editor.off("selectionUpdate", handler)
      editor.off("update", handler)
    }
  }, [editor])
  void tick

  const btn = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...toolbarBtn,
        background: isActive ? "var(--gtm-accent-bg, rgba(0,187,165,0.12))" : "transparent",
        color: isActive ? "#00BBA5" : "var(--gtm-text-secondary)",
      }}
    >
      {label}
    </button>
  )

  const promptLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("URL", prev || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  // ─── Image upload ────────────────────────────────────────────────────
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  async function uploadImage(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/gtm/email/upload-image", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      // Insert at the current cursor position. The Image extension's
      // setImage command handles caret placement automatically.
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
    } catch (e) {
      alert(`Image upload failed: ${e instanceof Error ? e.message : "Unknown error"}`)
    } finally {
      setUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        padding: "8px 10px",
        borderBottom: "1px solid var(--gtm-border)",
        background: "var(--gtm-bg-page)",
      }}
    >
      {btn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
      {btn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
      <span style={sep} />
      {btn("H1", editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run())}
      {btn("H2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
      {btn("H3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
      <span style={sep} />
      {btn("• List", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
      {btn("1. List", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
      <span style={sep} />
      {btn("Link", editor.isActive("link"), promptLink)}
      {btn("Quote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
      {btn("HR", false, () => editor.chain().focus().setHorizontalRule().run())}
      <span style={sep} />
      {btn(uploading ? "Uploading..." : "Image", false, () => imageInputRef.current?.click())}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) uploadImage(file)
        }}
      />
    </div>
  )
}

const toolbarBtn: React.CSSProperties = {
  height: 28,
  padding: "0 10px",
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid var(--gtm-border)",
  borderRadius: 4,
  cursor: "pointer",
  fontFamily: "'Inter', system-ui, sans-serif",
}

const sep: React.CSSProperties = {
  width: 1,
  background: "var(--gtm-border)",
  margin: "2px 4px",
}
