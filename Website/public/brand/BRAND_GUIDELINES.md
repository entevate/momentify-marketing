# Momentify Brand Guidelines

Use this document as the definitive reference when formatting any Momentify slide deck, presentation, or visual asset. Follow these rules exactly.

---

## 1. Logo

- **Primary logo**: Gradient M mark + black "Momentify" wordmark. Use on white or light backgrounds.
- **Reverse logo**: Gradient M mark + white "Momentify" wordmark. Use on dark, navy, or gradient backgrounds.
- **Mark only**: The gradient M icon can be used alone when space is limited (< 120px wide).
- **Icon gradient**: Always runs from Cyan (#0CF4DF) to Deep Blue (#1F3395). Never alter the direction or colors.
- **Clear space**: Maintain space equal to the height of the "M" around all sides.
- **Never** stretch, rotate, recolor, add effects, or recreate the logo.

---

## 2. Color Palette

### Primary Colors
| Name       | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| Cyan       | #0CF4DF   | Highlights, accents, CTAs      |
| Teal       | #00BBA5   | Eyebrow labels, secondary accent |
| Blue       | #254FE5   | Action gradient endpoint       |
| Cobalt     | #3257D9   | Mid-range blue accent          |
| Deep Blue  | #1F3395   | Gradient endpoint, deep accent |

### Dark & Neutral
| Name       | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| Navy       | #1A2E73   | Background gradient endpoint   |
| Deep Navy  | #061341   | Dark text color                |
| Midnight   | #0B0B3C   | Background gradient midpoint   |
| Plum       | #7C316D   | Background gradient start      |

### Functional
| Name       | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| White      | #FFFFFF   | Light backgrounds              |
| Off White  | #F5F5F7   | Light card backgrounds         |
| Background | #07081F   | Dark mode base background      |

---

## 3. Gradients

### Action Gradient (CTAs, highlights, accents)
```
linear-gradient(135deg, #0CF4DF 0%, #1F3395 100%)
```

### Depth Gradient (hero sections, dark backgrounds)
```
linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)
```

### Light Gradient (light-mode surfaces, soft backgrounds)
```
linear-gradient(135deg, #FFFFFF 0%, #A8BDF8 100%)
```

---

## 4. Typography

**Font family**: Inter (exclusively). No other fonts.

### Type Scale
| Style      | Size  | Weight | Line-Height | Usage                    |
|------------|-------|--------|-------------|--------------------------|
| Display    | 56px  | 500    | 1.05        | Hero headlines           |
| Heading 1  | 48px  | 700    | 1.1         | Section headlines        |
| Heading 2  | 36px  | 700    | 1.15        | Subsection headlines     |
| Heading 3  | 24px  | 600    | 1.25        | Card/block titles        |
| Heading 4  | 18px  | 600    | 1.35        | Minor headings           |
| Body Large | 18px  | 400    | 1.7         | Lead paragraphs          |
| Body       | 16px  | 400    | 1.7         | Standard copy            |
| Caption    | 13px  | 400    | 1.6         | Supporting labels        |
| Eyebrow    | 11px  | 600    | 1.4         | Section labels, uppercase, tracked |

### Key Rules
- Headlines: weight 500
- Subheads: weight 300
- Display headlines use letter-spacing: -0.025em
- Eyebrow color: #00BBA5
- No em dashes in any copy. Ever.

---

## 5. Headline Treatment

The core headline pattern is:
```
Empower Every
[Accent Word].
```

- Line 1 ("Empower Every"): White text on dark, dark text (#0B0B3C) on light
- Line 2 (accent word): Gradient text fill matching the context
- Font: Inter, 500 weight, letter-spacing -0.025em

### Main Brand Accent Gradient
- On dark: linear-gradient(135deg, #0CF4DF, #5BA8F5)
- On light: linear-gradient(135deg, #1F3395, #0056D6)

### Solution-Specific Accent Gradients (on dark backgrounds)
| Solution              | Accent Gradient                              |
|-----------------------|----------------------------------------------|
| Trade Shows (Violet)  | linear-gradient(135deg, #C084FC, #E0AAFF)    |
| Recruiting (Teal)     | linear-gradient(135deg, #0CF4DF, #5FD9C2)    |
| Field Sales (Amber)   | linear-gradient(135deg, #FFDC85, #F2B33D)    |
| Facilities (Indigo)   | linear-gradient(135deg, #B8AEDC, #9080C8)    |
| Venues & Events (Crimson) | linear-gradient(135deg, #FFAA8F, #F25E3D) |

---

## 6. Solution Color Systems

Each solution vertical has its own color identity. Use these consistently.

### Trade Shows & Exhibits — Violet
- Primary: #6B21D4
- Tonal scale: #C4A3F0 (Lavender) → #9B5FE8 (Violet Light) → #6B21D4 (Violet) → #4A0FA8 (Violet Deep) → #2D0770 (Violet Dark)
- Background gradient: linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)
- Gradients: #9B5FE8 → #3A2073, #6B21D4 → #0CF4DF

### Technical Recruiting — Teal
- Primary: #5FD9C2
- Tonal scale: #A8EEE3 (Mint) → #5FD9C2 (Teal Light) → #2DB8A0 (Teal) → #1A8A76 (Teal Deep) → #0D5C4E (Teal Dark)
- Background gradient: linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)
- Gradients: #5FD9C2 → #1F3395, #0CF4DF → #2DB8A0

### Field Sales Enablement — Amber
- Primary: #F2B33D
- Tonal scale: #FFE09E (Pale Gold) → #F2B33D (Amber) → #D9920A (Amber Deep) → #A86B00 (Burnt Gold) → #6B4200 (Dark Amber)
- Background gradient: linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)
- Gradients: #F2B33D → #F25E3D, #FFE09E → #D9920A

### Facilities — Indigo
- Primary: #3A2073
- Tonal scale: #B8AEDC (Periwinkle) → #7B6CB8 (Indigo Light) → #5B4499 (Indigo) → #3A2073 (Indigo Deep) → #1E0E42 (Indigo Dark)
- Background gradient: linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)
- Gradients: #5B4499 → #1F3395, #3A2073 → #254FE5

### Venues & Events — Crimson
- Primary: #F25E3D
- Tonal scale: #FFAA8F (Coral) → #F25E3D (Crimson) → #C93A1D (Crimson Deep) → #8F200A (Scarlet) → #5C0F00 (Crimson Dark)
- Background gradient: linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)
- Gradients: #F25E3D → #F2B33D, #F25E3D → #7C316D

---

## 7. Voice & Tone

### Personality
- **Confident**: Earned authority. No hedging, qualifying, or over-explaining.
- **Grounded**: Outcomes, not promises. Evidence, not guesses.
- **Operator-Led**: Written for doers who need to act, justify spend, and prove impact.

### Tone Spectrum
- Calm urgency (not pressure)
- Insightful (not academic)
- Direct (not aggressive)
- Human (not corporate)

### Writing Rules
- Write short, declarative sentences with clear cause and effect
- Lead with the problem, then the insight, then the value
- Write as if speaking to someone who has 90 seconds
- Ask: does this help justify spend, act faster, or prove impact?

### Never Do
- Use em dashes
- Use startup cliches: "revolutionary", "game-changing", "disruptive"
- Dump features without connecting them to outcomes
- Use filler words: "very", "really", "just", "actually"
- Write long explanations with no clear payoff

### Preferred Phrasing Patterns
- "Most teams are busy. They are not blind by choice."
- "The problem is not effort. It is visibility."
- "What you do not measure is what you lose."
- "Turn effort into evidence."

### Internal Mantra
Turn effort into evidence.
Turn engagement into intelligence.
Turn moments into momentum.

---

## 8. Slide Deck Formatting Rules

When formatting Momentify slide decks, apply these conventions:

### Backgrounds
- Dark slides: Use the Depth Gradient (Plum → Midnight → Navy)
- Light slides: White (#FFFFFF) or Off White (#F5F5F7)
- Solution-specific slides: Use that solution's background gradient

### Text on Dark Backgrounds
- Headlines: White (#FFFFFF), weight 500
- Accent/keyword text: Use gradient text or solution accent color
- Body copy: rgba(255,255,255,0.80)
- Captions/labels: rgba(255,255,255,0.45)

### Text on Light Backgrounds
- Headlines: Deep Navy (#061341), weight 500
- Accent/keyword text: Use gradient text or solution accent color
- Body copy: rgba(6,19,65,0.68)
- Captions/labels: rgba(11,11,60,0.38)

### Logo Placement
- Dark slides: Reverse logo (gradient mark + white wordmark)
- Light slides: Primary logo (gradient mark + black wordmark)
- Preferred position: Top-left or bottom-left corner

### Eyebrows & Labels
- Color: #00BBA5 (Teal)
- Style: 11px, weight 600, uppercase, letter-spacing 0.14em

### Spacing
- Use generous whitespace. Do not crowd elements.
- Maintain consistent margins across slides.
