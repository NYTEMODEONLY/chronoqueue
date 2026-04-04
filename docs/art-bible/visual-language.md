# ChronoQueue — Visual Language Definition

**Version:** 1.0 (Pre-Production)
**Author:** Art Director, VOID Studios
**Date:** 2026-04-04
**Parent:** [VOI-1](/VOI/issues/VOI-1) — ChronoQueue Pre-Production Kickoff

---

## Design North Star

> **ChronoQueue must look like a game, not like a web app.**

Every visual decision flows from this principle. A text-based game on the web has a specific danger: it can easily look like a dashboard, a document, or an admin panel. The visual language defined here exists to prevent that. Every pixel should signal to the player: "this is a game world you inhabit," not "this is a tool you operate."

### Guiding Principles

1. **Readability is king.** The player should parse the screen in under 2 seconds — where am I, what's happening, what do I do next? In a text-heavy game, visual hierarchy does the work that 3D environments do in graphical games.
2. **Dark is home.** Dark backgrounds are non-negotiable. Light backgrounds read as "document" or "web app." Dark reads as "game," "terminal," "atmosphere."
3. **Color means something.** Every color in the palette has a gameplay function. No decorative color. If it's gold, it's important. If it's red, something is taking damage. If it's green, something is healing or available.
4. **Density signals depth.** Idle RPGs thrive on visible complexity — stats ticking up, bars filling, loot streaming in. The UI should feel information-rich without being cluttered. Tight spacing, multiple panels, always something moving.
5. **Respect the RPG player's muscle memory.** Rarity colors, stat layouts, equipment grids — use established conventions. The player should feel at home immediately.

---

## 1. Typography System

### Font Stack

| Role | Font | Type | Why |
|------|------|------|-----|
| **Display / Titles** | **Cinzel** | Serif | Roman capitals with fantasy weight. Immediately signals "RPG" — evokes quest titles, level-up banners, chapter headings. Serious enough for real gameplay, ornate enough to feel like a game world. |
| **Headings / Section Labels** | **Exo 2** | Sans-serif | Geometric, slightly futuristic. Bridges the gap between game-like and modern UI. Works for panel headers, category labels, navigation. |
| **Body / UI Text** | **Inter** | Sans-serif | Best-in-class web readability. Optimized for screens at all sizes. Neutral enough to disappear — lets content speak. Used for descriptions, dialogue, menu items. |
| **Stats / Combat Log / Numbers** | **JetBrains Mono** | Monospace | Clean monospace with excellent legibility at small sizes. Monospace is critical for the combat log (MUD aesthetic), stat columns (alignment), and number-heavy displays. The monospace treatment alone signals "game terminal" vs "web paragraph." |

**All fonts are Google Fonts — free, web-optimized, no licensing friction.**

### Font Sizing Scale

Base unit: `1rem = 16px`. Scale uses a 1.25 ratio (Major Third) for harmonious progression.

| Token | Size | Use |
|-------|------|-----|
| `--font-display` | 2.441rem (39px) | Game title, major event banners ("LEVEL UP!") |
| `--font-h1` | 1.953rem (31px) | Screen titles ("Inventory", "Quest Log") |
| `--font-h2` | 1.563rem (25px) | Panel headers ("Equipment", "Character Stats") |
| `--font-h3` | 1.25rem (20px) | Sub-sections, item names in detail views |
| `--font-body` | 1rem (16px) | Standard UI text, descriptions, dialogue |
| `--font-small` | 0.8rem (13px) | Secondary info, timestamps, tooltips |
| `--font-micro` | 0.64rem (10px) | Minimal labels (use sparingly — accessibility floor) |
| `--font-stat` | 0.875rem (14px) | Stat numbers, combat log entries (monospace) |

### Font Weight Rules

- **Cinzel (display):** 700 (bold) only. Display text should command attention.
- **Exo 2 (headings):** 600 (semi-bold) for panel headers, 500 (medium) for sub-labels.
- **Inter (body):** 400 (regular) for body, 500 (medium) for emphasis, 600 (semi-bold) for interactive labels (buttons, links).
- **JetBrains Mono (stats):** 400 (regular) for log text, 500 (medium) for highlighted values (damage numbers, stat bonuses).

### Line Height

- Body text: 1.5 (comfortable reading)
- Stats/combat log: 1.3 (tighter — information density matters more than reading comfort)
- Headings: 1.1 (tight — headings should feel compact and punchy)

### Letter Spacing

- Cinzel display: `+0.05em` (slight tracking opens up the capitals)
- Exo 2 headings: `+0.02em`
- JetBrains Mono: `0` (monospace handles its own spacing)
- Inter body: `0` (Inter is optimized as-is)

### Typography Do/Don't

| DO | DON'T |
|----|-------|
| Use Cinzel for moments of gravity (level up, legendary drop, boss encounter) | Use Cinzel for body text or UI labels — it becomes unreadable |
| Use monospace for ALL number-heavy displays (stats, damage, gold, XP) | Use proportional fonts for stat columns — misaligned numbers look amateurish |
| Use Inter for anything the player reads continuously (quest descriptions, item lore) | Mix more than 2 fonts on any single panel — it creates visual noise |
| Use ALL CAPS sparingly (Cinzel headers, rarity labels) | Use all caps for body text or combat log — it reduces readability by ~20% |

---

## 2. Color Palette

### Core Theme: Dark Fantasy

The palette is dark, warm-accented, and atmospheric. The overall mood is a candlelit tavern — dark walls, warm light on the important things, deep shadows everywhere else.

### Base Colors

| Token | Hex | RGB | Use |
|-------|-----|-----|-----|
| `--bg-deep` | `#0d0f14` | 13, 15, 20 | Deepest background — page body, behind everything |
| `--bg-base` | `#13161d` | 19, 22, 29 | Primary panel background |
| `--bg-surface` | `#1a1e28` | 26, 30, 40 | Elevated surfaces — cards, tooltips, modals |
| `--bg-raised` | `#232833` | 35, 40, 51 | Highest elevation — active panels, hover states |
| `--border-subtle` | `#2a3040` | 42, 48, 64 | Panel borders, dividers |
| `--border-strong` | `#3d4558` | 61, 69, 88 | Active borders, focus rings |

**Why not pure black (#000)?** Pure black creates harsh contrast that causes eye strain in text-heavy interfaces. The blue-tinted dark base (`#0d0f14`) feels deeper and more atmospheric — like looking into a dark room rather than at a turned-off screen.

### Text Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--text-primary` | `#e8e6e1` | Primary text — warm off-white. Not pure white (less eye strain). |
| `--text-secondary` | `#9a9690` | Secondary text — muted descriptions, inactive labels. |
| `--text-tertiary` | `#5c5955` | Tertiary — disabled states, flavor text, timestamps. |
| `--text-accent` | `#c9a959` | Gold accent text — interactive, important, highlighted. |

### Accent Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--accent-gold` | `#c9a959` | **Primary accent.** XP gains, gold currency, interactive highlights, primary buttons. Gold-on-dark is the signature of RPG interfaces. |
| `--accent-gold-bright` | `#e8c84a` | Bright gold for hover/active states, critical events. |
| `--accent-gold-dim` | `#8a7339` | Muted gold for borders, subtle indicators. |
| `--accent-blue` | `#4a8fbf` | Mana, magic, information panels, links. |
| `--accent-teal` | `#2a9d8f` | Success states, quest completion, positive feedback. |

### Status Colors (Gameplay-Critical)

These colors have strict gameplay meaning. Never use them decoratively.

| Token | Hex | Meaning |
|-------|-----|---------|
| `--status-health` | `#c0392b` | Health / HP. Damage taken. Danger. |
| `--status-health-fill` | `#e74c3c` | Health bar fill (brighter for visibility). |
| `--status-mana` | `#2980b9` | Mana / MP. Magic. Resources. |
| `--status-mana-fill` | `#3498db` | Mana bar fill. |
| `--status-xp` | `#8e7cc3` | Experience points. Progression. |
| `--status-xp-fill` | `#a68edb` | XP bar fill. |
| `--status-stamina` | `#27ae60` | Energy / stamina. Available actions. |
| `--status-warning` | `#f39c12` | Warnings. Low resources. Caution. |
| `--status-critical` | `#e74c3c` | Critical failures. Death. Destruction. |

### Rarity Tier Colors

These follow the established WoW/RPG convention. Players will recognize these instantly.

| Tier | Token | Hex | Text Shadow/Glow |
|------|-------|-----|------------------|
| **Common** | `--rarity-common` | `#9d9d9d` | None |
| **Uncommon** | `--rarity-uncommon` | `#1eff00` | `0 0 4px rgba(30,255,0,0.3)` |
| **Rare** | `--rarity-rare` | `#0070dd` | `0 0 4px rgba(0,112,221,0.3)` |
| **Epic** | `--rarity-epic` | `#a335ee` | `0 0 4px rgba(163,53,238,0.3)` |
| **Legendary** | `--rarity-legendary` | `#ff8000` | `0 0 6px rgba(255,128,0,0.4)` |
| **Mythic** | `--rarity-mythic` | `#e6cc80` | `0 0 8px rgba(230,204,128,0.5)` |

**Glow treatment:** Rarity Uncommon and above gets a subtle `text-shadow` glow matching the tier color. This immediately distinguishes loot quality in the combat log without the player needing to read the label. Legendary and Mythic get stronger glow — these are moments of excitement.

### Color Accessibility

- All text/background combinations must meet **WCAG AA contrast ratio (4.5:1 minimum)** for body text.
- Primary text (`#e8e6e1`) on base background (`#13161d`): contrast ratio ~14:1. Passes AAA.
- Secondary text (`#9a9690`) on base background: contrast ratio ~5.2:1. Passes AA.
- Rarity colors on dark backgrounds: all pass AA minimum. Green (`#1eff00`) is the weakest at ~5.8:1.
- **Colorblind consideration:** Rarity tiers must never rely on color alone. Each tier also gets a text label ("Common", "Rare", etc.) and a distinct border/frame treatment on item cards.

---

## 3. Layout Patterns

### Design Philosophy: Game HUD, Not Web Page

The layout should feel like a game HUD — persistent status at the top/bottom, content panels that the player navigates between, information always visible. Not a scrolling web page with a header and footer.

### Viewport Strategy

| Breakpoint | Token | Target |
|------------|-------|--------|
| `< 480px` | `--bp-phone` | Phone portrait — single column, stacked panels |
| `480–768px` | `--bp-phone-landscape` | Phone landscape / small tablet — still single column, wider panels |
| `768–1024px` | `--bp-tablet` | Tablet — two-column layout begins |
| `1024–1440px` | `--bp-desktop` | Desktop — full multi-panel layout |
| `> 1440px` | `--bp-wide` | Wide desktop — max-width container, extra whitespace on sides |

**Max content width:** `1200px`. Beyond this, content centers with dark background bleeding to edges. This prevents the UI from looking stretched and lost on ultrawide monitors.

### Layout Zones

```
┌──────────────────────────────────────────────┐
│                  TOP BAR (fixed)              │
│  Character Name | Level | HP/MP/XP Bars      │
├────────────┬─────────────────┬───────────────┤
│            │                 │               │
│  LEFT      │    CENTER       │   RIGHT       │
│  PANEL     │    CONTENT      │   PANEL       │
│            │                 │               │
│  Character │  Combat Log /   │  Quest        │
│  Stats     │  Adventure      │  Tracker /    │
│  Equipment │  Feed           │  Inventory    │
│  Slots     │                 │               │
│            │                 │               │
├────────────┴─────────────────┴───────────────┤
│              BOTTOM BAR (fixed)               │
│  Actions | Navigation Tabs | Notifications   │
└──────────────────────────────────────────────┘
```

### Desktop (1024px+)

- **Top bar** (fixed, ~48px height): Character identity strip — name, level badge, HP/MP/XP mini-bars. Always visible. This is the player's "status at a glance."
- **Left panel** (280px, collapsible): Character stats, equipment slots, stat allocations. Persistent sidebar.
- **Center content** (flexible): The main viewport — combat log, adventure feed, quest details, inventory grid (depending on active tab/view).
- **Right panel** (260px, collapsible): Quest tracker, active buffs, recent notifications. Secondary info.
- **Bottom bar** (fixed, ~44px): Navigation tabs (Adventure, Inventory, Quests, Stats, Settings) + action buttons.

### Tablet (768–1024px)

- Top bar remains fixed.
- **Two-column layout:** Left panel + center content merge. Right panel becomes a collapsible overlay.
- Bottom bar navigation becomes the primary navigation method.
- Panels toggle via bottom tabs instead of being simultaneously visible.

### Mobile (< 768px)

- **Single column, tab-based.** Each major section (Stats, Combat Log, Inventory, Quests) gets its own full-screen view.
- Top bar condenses: HP/MP/XP bars become a single combined "status strip" — thin colored bars stacked.
- Bottom bar becomes the primary navigation (5 tab icons).
- Swipe gestures between major sections (optional enhancement).
- **Critical rule:** The combat/adventure log is the default view on mobile. It's the "idle" screen — what you see when you open the game to check progress.

### Panel Layout Rules

- **Minimum panel width:** 260px. Panels should never be narrower — content becomes unreadable.
- **Panel padding:** 12px (mobile), 16px (tablet), 20px (desktop). Tight but breathable.
- **Panel gap:** 4px. Panels sit close together, separated by the border treatment, not by whitespace. White space between panels reads as "web app." Tight gapped panels read as "game HUD."
- **Scroll behavior:** Each panel scrolls independently. The combat log scrolls while stats stay fixed. This is critical — a page that scrolls as a whole feels like a website. Independent panel scrolling feels like a game client.

### Key Layout Patterns

**Character Stats Panel:**
```
┌─ CHARACTER STATS ──────────────┐
│ ◆ Strength      24  (+3)       │
│ ◆ Dexterity     18  (+1)       │
│ ◆ Intelligence  31  (+5)       │
│ ◆ Vitality      22  (+2)       │
│ ◆ Luck          15  (+0)       │
│                                │
│ ─── EQUIPMENT ───              │
│ [Helm]  [Armor]  [Weapon]      │
│ [Boots] [Shield] [Amulet]      │
│ [Ring1] [Ring2]  [Trinket]     │
└────────────────────────────────┘
```
- Stats use monospace font, right-aligned numbers, bonus in accent gold.
- Equipment slots are a fixed grid — 3 columns, styled as inset "socket" shapes.

**Combat / Adventure Log:**
```
┌─ ADVENTURE LOG ────────────────┐
│ 14:23  You attack the Goblin   │
│        Shaman for 24 damage.   │
│ 14:23  Goblin Shaman casts     │
│        Fireball! You take 18   │
│        damage.                 │
│ 14:24  You defeat the Goblin   │
│        Shaman!                 │
│ 14:24  ★ Loot: Staff of Minor  │
│        Flame [Rare]            │
│ 14:24  +120 XP | +34 Gold      │
│ 14:25  Entering: Darkwood      │
│        Clearing (Act 1-3)      │
│ ...                            │
└────────────────────────────────┘
```
- Monospace font. Timestamps in tertiary color.
- Damage numbers in `--status-health` red. XP in `--status-xp` purple. Gold in `--accent-gold`.
- Item drops colored by rarity tier with glow treatment.
- Auto-scrolls to bottom (latest events). Player can scroll up to review history.

**Inventory Grid:**
```
┌─ INVENTORY (24/40) ────────────┐
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │ ▫ │ │ ▫ │ │ ▫ │ │ ▫ │ │ ▫ │ │
│ └───┘ └───┘ └───┘ └───┘ └───┘ │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │ ▫ │ │ ▫ │ │ ▫ │ │ ▫ │ │   │ │
│ └───┘ └───┘ └───┘ └───┘ └───┘ │
│ ...                            │
└────────────────────────────────┘
```
- Grid cells: 48px square (desktop), 40px (mobile). CSS Grid, responsive column count.
- Cell border color matches item rarity. Empty cells show `--border-subtle`.
- Item name text inside or below the cell, truncated with ellipsis.
- Hover/tap reveals tooltip.

---

## 4. UI Component Language

### What Makes It "Game" vs "Web App"

| Web App Pattern | Game Pattern (Use This) |
|----------------|------------------------|
| Flat white cards with `box-shadow` | Dark panels with styled borders (double-line, inner glow) |
| Material Design rounded buttons | Beveled buttons with gradient, press-in hover state |
| Thin progress bar (accent color on gray) | Textured bar with dark track, bright fill, segment marks |
| Plain dropdown selects | Styled select with panel background, gold border on focus |
| Toast notification (slides down from top) | Event banner that flashes across the center (like a game achievement popup) |
| Breadcrumb navigation | Tab bar with active indicator (glowing underline) |
| Loading spinner | Progress bar with flavor text ("Traversing the Darkwood...") |

### Panel Component

The panel is the foundational container. Every grouping of information lives in a panel.

```css
/* Panel base treatment */
.panel {
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-top: 1px solid var(--border-strong);  /* Top edge catch-light */
  border-radius: 2px;  /* Barely rounded — sharp = game, round = web app */
}

.panel-header {
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: var(--font-h3);
  color: var(--text-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: linear-gradient(180deg, var(--bg-raised) 0%, var(--bg-base) 100%);
}
```

**Key details:**
- `border-radius: 2px` — barely rounded. Sharp corners feel like game panels. Fully rounded (8px+) feels like web cards.
- Top border is brighter — simulates a subtle "catch light" like a physical panel edge.
- Header has a gradient — subtle depth that flat web cards lack.
- Header text is uppercase with tracking — feels like a game UI label, not a web heading.

### Progress Bars (HP / MP / XP / Stamina)

Progress bars are the most important visual element in an idle RPG. They represent time passing and progress happening. They must feel satisfying to watch fill.

```
HP:  ████████████░░░░░░░░  234 / 450
MP:  ██████████████░░░░░░  180 / 220
XP:  ███░░░░░░░░░░░░░░░░░  1,240 / 8,500  Lvl 14
```

**Design rules:**
- **Track** (background): `var(--bg-deep)` with 1px inset border. The track should look like a carved-out channel.
- **Fill**: Bright status color with a subtle horizontal gradient (lighter at top, darker at bottom — simulates dimension).
- **Fill animation**: When value changes, the bar animates smoothly (300ms ease-out). In an idle game, watching bars move IS the game.
- **Segment marks** (optional): Faint vertical lines every 25% on the track. Helps the player gauge progress at a glance.
- **Text overlay**: Current/max values displayed in monospace, right-aligned inside or beside the bar.
- **Height**: 20px (main status bars), 12px (secondary bars like quest progress), 6px (mini bars in the top status strip).
- **Corner radius**: 1px. Near-square. Rounded progress bars look like Bootstrap.

### Buttons

```
┌─────────────────┐
│   EQUIP ITEM    │   Primary: gold bg, dark text
└─────────────────┘

┌─────────────────┐
│   SELL ITEM     │   Secondary: dark bg, gold border
└─────────────────┘

┌─────────────────┐
│   DESTROY       │   Danger: dark bg, red border, red text
└─────────────────┘
```

**Button treatment:**
- **Primary**: Background `var(--accent-gold)`, text `var(--bg-deep)`, subtle top-to-bottom gradient (lighter to darker). On hover: brighten to `--accent-gold-bright`, slight upward shift (1px). On press: darken, shift down (1px) — tactile "press in" feel.
- **Secondary**: Background `var(--bg-surface)`, border `var(--accent-gold-dim)`, text `var(--text-accent)`. On hover: border brightens, subtle background lighten.
- **Danger**: Background `var(--bg-surface)`, border/text `var(--status-critical)`. On hover: background tints red.
- **Border radius**: 2px (matching panels).
- **Font**: Exo 2, semi-bold, uppercase, tracked. Buttons should look like game UI, not web links.
- **Min height**: 40px (touch-friendly).

### Item Tooltips

Tooltips are critical — they're how the player evaluates loot. They must be instantly readable.

```
┌─ STAFF OF MINOR FLAME ─────────┐
│ [Rare]          Weapon — Staff  │
│                                 │
│ ◆ +12 Intelligence              │
│ ◆ +8 Fire Damage                │
│ ◆ +3% Critical Chance           │
│                                 │
│ "Carved from a branch of the    │
│  Ever-Burning Oak."             │
│                                 │
│ Level Required: 10              │
│ Sell Value: 340g                │
└─────────────────────────────────┘
```

**Tooltip design:**
- Background: `var(--bg-surface)` with higher opacity than panels.
- **Border color matches item rarity.** This is the strongest visual signal — the border color tells you the item quality before you read a word.
- Item name in **Cinzel**, colored by rarity.
- Stats in monospace, with values in `--text-accent` gold.
- Flavor text in italic Inter, `--text-secondary` color.
- Appears on hover (desktop) or tap (mobile). Position: above the item, centered. Falls back to below if insufficient space.
- **Animation**: Fade in (150ms). No slide, no bounce. Quick and clean.

### Notification Toasts / Event Banners

Two levels of notification:

**Event Banner (major):** Level up, legendary drop, boss defeated, new act unlocked.
- Full-width banner across center content area.
- Background: semi-transparent dark with rarity/event-appropriate border glow.
- Text in Cinzel, centered, gold or event color.
- Enters: scale up from 90% to 100% + fade in (200ms).
- Exits: fade out after 3 seconds.

**Toast (minor):** Item looted, quest updated, buff expired.
- Small card, appears in bottom-right corner (desktop) or top of screen (mobile).
- Stacks vertically (max 3 visible, older ones compress).
- Auto-dismiss after 4 seconds. Can be dismissed manually.

### Scrollbar Styling

Custom scrollbars reinforce the game feel. Browser-default scrollbars break the illusion.

```css
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deep);
}
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-gold-dim);
}
```

### Tab Navigation

Bottom navigation tabs are the primary navigation on all viewports (with side panels supplementing on desktop).

- **Active tab**: Gold underline (2px), icon and label in `--text-accent`.
- **Inactive tab**: Icon and label in `--text-secondary`.
- **Tab bar background**: `var(--bg-base)` with top border `var(--border-subtle)`.
- **Icons**: Simple, outlined style. Not filled. Consistent 20px sizing.
- **Labels**: Inter, 11px, below icon. Hidden on very small phones (icon-only mode below 360px width).

---

## 5. Mood Board & Visual References

### Primary References

**A Dark Room** — Tone and atmosphere target.
- What to take: The power of restraint. Dark backgrounds, sparse text, slow reveal. Proves that text-only can be atmospheric.
- What to avoid: Too minimal for an idle RPG. ChronoQueue needs visible complexity (bars, stats, grids). A Dark Room is a narrative game; ChronoQueue is a systems game.

**Melvor Idle** — Layout and information architecture target.
- What to take: Clean panel layout, dark theme, sidebar navigation, well-organized skill/item displays. Modern and polished.
- What to avoid: It leans too "dashboard." Too many rounded corners, too much whitespace between panels. ChronoQueue needs tighter, more game-like panel treatment.

**Classic WoW UI** — Color language and RPG convention target.
- What to take: The gold-on-dark color scheme. Rarity tier colors. Equipment slot grids. Panel borders with subtle beveling. The entire RPG visual vocabulary.
- What to avoid: The actual WoW UI is pixel art at a specific resolution. ChronoQueue is text-based and responsive — different constraints.

**MUD Client Interfaces (Mudlet, MUSHclient)** — Combat log and text feed target.
- What to take: Monospace colored text on black. The scrolling text log as the primary game view. Color-coded information (damage red, loot green, dialogue white). Timestamp formatting.
- What to avoid: Bare terminal aesthetics. ChronoQueue needs more structure (panels, bars, grids) than a raw text stream.

### Secondary References

**Candy Box 2** — For the surprise-and-delight factor. Text game that transcends its medium.

**Torn City** — For information density. Shows how much data a browser RPG can display without overwhelming (when structured well).

**Trimps** — For progress bar design and idle mechanic visualization.

### Anti-References (What NOT to Look Like)

**Material Design dashboards** — Flat white cards, lots of whitespace, thin sans-serif, rounded everything. This is the "web app" aesthetic we are actively avoiding.

**Bootstrap/default HTML** — Browser-default form controls, unstyled progress bars, system fonts. Screams "prototype" not "game."

**Kingdom of Loathing** — The humor and RPG systems are inspirational, but the white-background, hand-drawn aesthetic is the wrong visual language for ChronoQueue's tone.

---

## 6. Asset Naming (UI)

All UI assets follow the naming convention defined in the Art Bible:

| Prefix | Category | Example |
|--------|----------|---------|
| `ui_` | UI elements | `ui_healthbar_fill.png` |
| `ui_` | Icons | `ui_icon_sword.svg` |
| `ui_` | Borders/frames | `ui_panel_border_ornate.svg` |
| `ui_` | Backgrounds | `ui_bg_panel_texture.png` |

All names: lowercase, underscore-separated. No spaces, no camelCase.

**Preferred format:** SVG for icons and vector UI elements (scalable, small file size). PNG for textures and raster elements. WebP as an optimization target for raster assets.

---

## 7. Implementation Notes for Technical Director

These visual specifications are designed for implementation in a modern web stack (likely React/Next.js on Vercel, per the board brief):

- **CSS Custom Properties** for all color and sizing tokens. Defined once, consumed everywhere. Makes theming and future adjustments trivial.
- **Google Fonts** loaded via `@font-face` or `next/font` for optimized loading. Subset to Latin characters to minimize payload.
- **CSS Grid** for the multi-panel layout. Flexbox for internal panel layouts.
- **`prefers-color-scheme`**: ChronoQueue is dark-only. No light mode. But the token system means a light variant could be added later if needed.
- **No image assets required for initial UI.** The visual language is achievable entirely with CSS — gradients, borders, shadows, colors. This keeps the initial build lightweight and fast.
- **Animation**: CSS transitions for bar fills, panel transitions, and hover states. No heavy animation library needed. `transition: all 200ms ease-out` handles 90% of cases.
- **Responsive**: CSS Grid `auto-fit` / `minmax()` for the inventory grid. Media queries at defined breakpoints for layout zone changes. Container queries (if supported in the target stack) for panel-level responsiveness.

---

## 8. Open Questions for Cross-Department Alignment

1. **Creative Director** — Once creative pillars are finalized, I'll validate this palette and typography against them. If a pillar emphasizes humor more than atmosphere, we may need to lighten the tone (slightly warmer palette, less severe typography). Current direction assumes "parody meets serious" leans 60% serious / 40% parody visually.

2. **Technical Director** — Need confirmation on:
   - Target framework (Next.js assumed — affects font loading strategy).
   - Any performance constraints on CSS complexity (animations, gradients, blur effects).
   - Preferred CSS methodology (CSS Modules, Tailwind, styled-components, vanilla CSS).

3. **Game Designer** — Need the complete list of:
   - Equipment slot types (how many slots? what categories?).
   - Stat names (for the stats panel layout).
   - Item categories and rarity tier count (are we doing 6 tiers as defined, or fewer?).
   - Combat log event types (to define the complete color coding).

---

*This document is the source of truth for ChronoQueue's visual identity. All UI implementation must reference these specifications. Deviations require Art Director review.*
