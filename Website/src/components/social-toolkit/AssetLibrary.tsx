"use client";

import { useState } from "react";
import { brands } from "./backgroundData";

export interface SavedAsset {
  id: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  brand: string;
  backgroundId: string;
  aspectRatio: string;
  headline: string;
  subhead: string;
  bodyCopy: string;
  textPosition: "top" | "center" | "bottom";
  showLogo: boolean;
  logoVariant?: "auto" | "dark" | "white";
  logoScale?: number;
  showUrl?: boolean;
  urlScale?: number;
  headlineFontSize?: number;
  headlineFontWeight?: number;
  subheadFontSize?: number;
  subheadFontWeight?: number;
  bodyFontSize?: number;
  bodyFontWeight?: number;
  caption?: string;
  hashtags?: string[];
  category?: string;
}

interface AssetLibraryProps {
  assets: SavedAsset[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AssetLibrary({ assets, onEdit, onDelete }: AssetLibraryProps) {
  const [brandFilter, setBrandFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Derive categories from assets
  const categories = Array.from(
    new Set(assets.map((a) => a.category || "Uncategorized"))
  ).sort();

  const filtered = assets.filter((a) => {
    if (brandFilter !== "all" && a.brand !== brandFilter) return false;
    if (categoryFilter !== "all" && (a.category || "Uncategorized") !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.headline.toLowerCase().includes(q) ||
        a.subhead.toLowerCase().includes(q) ||
        (a.bodyCopy || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const brandLabel = (id: string) => brands.find((b) => b.id === id)?.label || id;
  const brandColor = (id: string) => brands.find((b) => b.id === id)?.color || "#999";

  if (assets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-charcoal/15 mb-3">
          <svg className="w-12 h-12 mx-auto" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M6 18h36M18 18v20M30 18v20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-charcoal/30 text-[14px] font-medium">No saved assets yet</p>
        <p className="text-charcoal/20 text-[13px] mt-1">Create your first graphic above and save it to the library</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[13px] placeholder:text-charcoal/25 focus:outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all"
          />
        </div>
        {/* Brand filter */}
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[13px] font-medium focus:outline-none focus:border-teal/40 transition-all"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
        {/* Category filter */}
        {categories.length > 1 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-charcoal/10 bg-white text-charcoal text-[13px] font-medium focus:outline-none focus:border-teal/40 transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-charcoal/30 text-[13px] py-8">No assets match your filters</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl border border-charcoal/[0.06] bg-white overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-charcoal/[0.02] overflow-hidden relative">
                {asset.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.thumbnail}
                    alt={asset.headline || "Saved asset"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/15">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-charcoal truncate">
                      {asset.headline || "Untitled"}
                    </p>
                    <p className="text-[11px] text-charcoal/30 mt-0.5">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: brandColor(asset.brand) }}
                  >
                    {brandLabel(asset.brand).split(" ")[0]}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(asset.id)}
                    className="flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium text-teal border border-teal/20 hover:bg-teal/[0.04] transition-colors"
                  >
                    Edit
                  </button>
                  {deleteConfirm === asset.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          onDelete(asset.id);
                          setDeleteConfirm(null);
                        }}
                        className="px-3 py-1.5 rounded-md text-[12px] font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 rounded-md text-[12px] font-medium text-charcoal/40 border border-charcoal/10 hover:bg-charcoal/[0.04] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(asset.id)}
                      className="px-3 py-1.5 rounded-md text-[12px] font-medium text-charcoal/30 border border-charcoal/[0.06] hover:text-red-400 hover:border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
