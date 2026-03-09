"use client";

import { useState } from "react";

interface CaptionGeneratorProps {
  headline: string;
  subhead: string;
  bodyCopy: string;
  brandLabel: string;
  caption: string;
  setCaption: (v: string) => void;
  hashtags: string[];
  setHashtags: (v: string[]) => void;
}

export default function CaptionGenerator({
  headline,
  subhead,
  bodyCopy,
  brandLabel,
  caption,
  setCaption,
  hashtags,
  setHashtags,
}: CaptionGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captionCopied, setCaptionCopied] = useState(false);
  const [hashtagsCopied, setHashtagsCopied] = useState(false);

  const hasContent = headline || subhead || bodyCopy;

  const generate = async () => {
    if (!hasContent) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/social-toolkit/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, subhead, bodyCopy, brand: brandLabel }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate caption.");
        return;
      }

      setCaption(data.caption || "");
      setHashtags(data.hashtags || []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-charcoal">Caption & Hashtags</h3>
        <button
          onClick={generate}
          disabled={loading || !hasContent}
          className="px-4 py-2 rounded-lg bg-action-gradient text-white text-[13px] font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-40 flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
              <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {loading ? "Generating..." : "Generate Caption"}
        </button>
      </div>

      {error && (
        <p className="text-[13px] text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Caption */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal/40">
            Caption
          </label>
          {caption && (
            <button
              onClick={() => copyText(caption, setCaptionCopied)}
              className="text-[11px] font-medium text-teal hover:text-teal/80 transition-colors flex items-center gap-1"
            >
              {captionCopied ? (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Click Generate Caption to create an AI-powered caption..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[14px] placeholder:text-charcoal/25 focus:outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all resize-none"
        />
      </div>

      {/* Hashtags */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal/40">
            Hashtags
          </label>
          {hashtags.length > 0 && (
            <button
              onClick={() => copyText(hashtags.join(" "), setHashtagsCopied)}
              className="text-[11px] font-medium text-teal hover:text-teal/80 transition-colors flex items-center gap-1"
            >
              {hashtagsCopied ? (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Copy All
                </>
              )}
            </button>
          )}
        </div>
        {hashtags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-charcoal/[0.04] text-charcoal/60 text-[12px] font-medium"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-charcoal/25 italic">No hashtags yet</p>
        )}
      </div>
    </div>
  );
}
