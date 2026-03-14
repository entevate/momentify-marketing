"use client";

interface BadgeProps {
  count: number;
  variant?: "default" | "accent";
}

export default function Badge({ count, variant = "default" }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{
        background:
          variant === "accent"
            ? "var(--dash-accent-soft)"
            : "var(--dash-surface-2)",
        color:
          variant === "accent"
            ? "var(--dash-accent)"
            : "var(--dash-text-muted)",
        minWidth: 20,
      }}
    >
      {count}
    </span>
  );
}
