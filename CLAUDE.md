# Momentify

## Design System

When building or modifying any UI, always reference the design system:

- **Written spec:** `Website/DESIGN_SYSTEM.md` -- design principles, component API docs, accessibility guidelines, patterns, dos/don'ts
- **Design tokens:** `Website/design-tokens.json` -- all color, gradient, typography, spacing, elevation, motion, and border tokens
- **Visual reference:** `Brand/design-system.html` -- live preview of all tokens and 20+ components

Use the correct design tokens for colors, gradients, typography, spacing, and elevation. Do not hardcode values that exist as tokens. Match solution vertical colors to their designated palette (violet, teal, amber, indigo, crimson).

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (uses `@theme` in globals.css, no tailwind.config.ts)
- Framer Motion for animations
- Deployed via Vercel Pro (git push to `origin/main`)

## Conventions

- Font weight 500 for headlines, 300 for subheads
- Eyebrow color: #00BBA5
- No em dashes in any copy
- Site-wide `zoom: 80%` on `<html>` element
- Don't automatically push to git
