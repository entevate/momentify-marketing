"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Flame, Snowflake, User, UserPlus, Upload, Paperclip, Eye, Download, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DrawerPanel from "./DrawerPanel";
import type { Session } from "./types";

interface SessionDetailDrawerProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
  onSave?: (updated: Session) => void;
}

/* ---- Helper Components ---- */

function EditableField({ label, value, onChange, type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-150"
        style={{
          background: "var(--dash-input-bg)",
          border: "1px solid var(--dash-input-border)",
          color: "var(--dash-text)",
          minHeight: 36,
        }}
      />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
        {label}
      </label>
      <div
        className="rounded-lg px-3 py-2 text-sm"
        style={{
          background: "var(--dash-input-bg)",
          border: "1px solid var(--dash-input-border)",
          color: "var(--dash-text)",
          minHeight: 36,
        }}
      >
        {value || <span style={{ color: "var(--dash-text-muted)" }}>&mdash;</span>}
      </div>
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (val: boolean) => void }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
        {label}
      </label>
      <div className="flex gap-2">
        {[true, false].map((opt) => (
          <button
            key={String(opt)}
            onClick={() => onChange(opt)}
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150"
            style={{
              background: value === opt ? "var(--dash-accent-soft)" : "var(--dash-input-bg)",
              border: `1px solid ${value === opt ? "var(--dash-accent)" : "var(--dash-input-border)"}`,
              color: value === opt ? "var(--dash-accent)" : "var(--dash-text-muted)",
            }}
          >
            {opt ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

const tempOptions: { val: Session["temp"]; label: string; icon: React.ReactNode; color: string }[] = [
  { val: "hot", label: "Hot", icon: <Flame size={14} />, color: "#EF4444" },
  { val: "warm", label: "Warm", icon: <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#F2B33D" }} />, color: "#F2B33D" },
  { val: "cold", label: "Cold", icon: <Snowflake size={14} />, color: "#3B82F6" },
  { val: null, label: "Unset", icon: null, color: "var(--dash-text-muted)" },
];

function TempSelect({ value, onChange }: { value: Session["temp"]; onChange: (val: Session["temp"]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = tempOptions.find((o) => o.val === value) || tempOptions[3];

  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
        Temp
      </label>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm"
          style={{
            background: "var(--dash-input-bg)",
            border: "1px solid var(--dash-input-border)",
            color: selected.color,
            minHeight: 36,
          }}
        >
          {selected.icon}
          {selected.label}
          <ChevronDown size={14} className="ml-auto" style={{ color: "var(--dash-text-muted)" }} />
        </button>
        {open && (
          <div
            className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg p-1.5 shadow-dash-3"
            style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)" }}
          >
            {tempOptions.map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => { onChange(opt.val); setOpen(false); }}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
                style={{ color: opt.color }}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MediaField({ hasMedia, onPreview }: { hasMedia: boolean; onPreview?: () => void }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
        Media
      </label>
      {hasMedia ? (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: "var(--dash-input-bg)", border: "1px solid var(--dash-input-border)", minHeight: 36 }}
        >
          <Paperclip size={14} style={{ color: "var(--dash-text-muted)" }} />
          <span className="flex-1 text-sm" style={{ color: "var(--dash-text)" }}>Business Card</span>
          <button
            onClick={onPreview}
            className="rounded p-1 transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
            title="Preview"
          >
            <Eye size={14} style={{ color: "var(--dash-text-muted)" }} />
          </button>
          <button
            className="rounded p-1 transition-colors duration-100 hover:bg-[var(--dash-surface-2)]"
            title="Download"
          >
            <Download size={14} style={{ color: "var(--dash-text-muted)" }} />
          </button>
        </div>
      ) : (
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-4 text-sm transition-colors duration-150"
          style={{
            borderColor: "var(--dash-input-border)",
            color: "var(--dash-text-muted)",
            background: "var(--dash-input-bg)",
          }}
        >
          <Upload size={16} />
          Upload Media
        </button>
      )}
    </div>
  );
}

function MediaPreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
      <div
        className="relative z-10 w-full max-w-sm rounded-xl p-6 shadow-dash-4"
        style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>Business Card Preview</h3>
          <button onClick={onClose} className="rounded-lg p-1 transition-colors duration-150" style={{ color: "var(--dash-text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <div
          className="flex aspect-[1.75/1] w-full flex-col justify-between rounded-lg p-5"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid var(--dash-border)" }}
        >
          <div>
            <div className="mb-1 text-sm font-medium text-white">John Smith</div>
            <div className="text-[11px] text-gray-400">Senior Account Executive</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400">Acme Corporation</div>
            <div className="text-[11px] text-gray-500">john.smith@acme.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg" style={{ border: "1px solid var(--dash-border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-150"
        style={{ color: "var(--dash-text)" }}
      >
        {title}
        {open ? (
          <ChevronUp size={16} style={{ color: "var(--dash-text-muted)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--dash-text-muted)" }} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--dash-border)" }}>
              <div className="pt-3">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Main Component ---- */

export default function SessionDetailDrawer({ session, open, onClose, onSave }: SessionDetailDrawerProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [temp, setTemp] = useState<Session["temp"]>(null);
  const [followUp, setFollowUp] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [notes, setNotes] = useState("");
  const [showMediaPreview, setShowMediaPreview] = useState(false);

  const isNew = session === null;

  // Reset local state when session changes
  useEffect(() => {
    if (session) {
      const [first, ...rest] = session.name.split(" ");
      setFirstName(first);
      setLastName(rest.join(" "));
      setEmail(session.email);
      setCompany(session.company);
      setTitle(session.title);
      setTemp(session.temp);
      setFollowUp(session.followUp);
      setOptIn(session.optIn === true);
      setNotes(session.notes ? "Session notes captured" : "");
    } else if (open) {
      // New session mode: clear all fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setCompany("");
      setTitle("");
      setTemp(null);
      setFollowUp(false);
      setOptIn(false);
      setNotes("");
    }
  }, [session, open]);

  // Dirty detection (for existing sessions)
  const isDirty = session
    ? firstName !== session.name.split(" ")[0] ||
      lastName !== session.name.split(" ").slice(1).join(" ") ||
      email !== session.email ||
      company !== session.company ||
      title !== session.title ||
      temp !== session.temp ||
      followUp !== session.followUp ||
      optIn !== (session.optIn === true)
    : false;

  // For new sessions, require at least a name
  const canCreate = isNew && firstName.trim().length > 0;

  const handleSave = () => {
    if (!onSave) return;

    if (isNew) {
      // Create new session
      onSave({
        id: `manual-${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        created: "Just now",
        email,
        company,
        title,
        temp,
        followUp,
        optIn: optIn ? true : null,
        media: false,
        notes: notes.length > 0,
      });
    } else {
      // Update existing session
      onSave({
        ...session,
        name: `${firstName} ${lastName}`.trim(),
        email,
        company,
        title,
        temp,
        followUp,
        optIn: optIn ? true : null,
      });
    }
  };

  // Enhancement indicator: sessions with notes AND media are enhanced
  const isEnhanced = session ? session.notes && session.media : false;

  const showFooter = isNew ? canCreate : isDirty;

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      title={isNew ? "New Session" : "Session Details"}
      icon={isNew
        ? <UserPlus size={18} style={{ color: "var(--dash-text-muted)" }} />
        : <User size={18} style={{ color: "var(--dash-text-muted)" }} />
      }
      footer={
        showFooter ? (
          <button
            onClick={handleSave}
            className="w-full rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00BBA5, #1A56DB)" }}
          >
            {isNew ? "Create Session" : "Save Changes"}
          </button>
        ) : undefined
      }
    >
      {/* Metadata line (only for existing sessions) */}
      {session && (
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--dash-text-muted)" }}>
          <span>Captured</span>
          <span
            className="rounded-md px-2 py-0.5"
            style={{ background: "var(--dash-surface-2)", color: "var(--dash-text)" }}
          >
            {session.created}
          </span>
          <span>from</span>
          <span
            className="rounded-md px-2 py-0.5"
            style={{ background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}
          >
            Registration
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <Sparkles size={13} style={{ color: isEnhanced ? "#5FD9C2" : "#F2B33D" }} />
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: isEnhanced ? "rgba(95,217,194,0.15)" : "rgba(242,179,61,0.15)",
                color: isEnhanced ? "#5FD9C2" : "#F2B33D",
              }}
            >
              {isEnhanced ? "Enhanced" : "Enhance"}
            </span>
          </div>
        </div>
      )}

      {/* Primary fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <EditableField label="First Name" value={firstName} onChange={setFirstName} />
          <EditableField label="Last Name" value={lastName} onChange={setLastName} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TempSelect value={temp} onChange={setTemp} />
          <EditableField label="Email" value={email} onChange={setEmail} type="email" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <EditableField label="Company" value={company} onChange={setCompany} />
          <EditableField label="Title" value={title} onChange={setTitle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ToggleField label="Follow Up" value={followUp} onChange={setFollowUp} />
          <ToggleField label="Opt In" value={optIn} onChange={setOptIn} />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--dash-text-muted)" }}>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-150"
            style={{
              background: "var(--dash-input-bg)",
              border: "1px solid var(--dash-input-border)",
              color: "var(--dash-text)",
              resize: "vertical",
            }}
          />
        </div>

        <MediaField hasMedia={session?.media ?? false} onPreview={() => setShowMediaPreview(true)} />
      </div>

      {/* Collapsible sections (only for existing sessions) */}
      {session && (
        <div className="mt-6 space-y-3">
          <CollapsibleSection title="Empty Fields">
            <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
              No empty fields to display.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="Trait Selections">
            <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
              No trait selections recorded.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="Content Viewed">
            <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
              No content viewed data available.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="Additional Details">
            <div className="space-y-3">
              <ReadOnlyField label="Session ID" value={session.id} />
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Media preview modal */}
      {showMediaPreview && <MediaPreviewModal onClose={() => setShowMediaPreview(false)} />}
    </DrawerPanel>
  );
}
