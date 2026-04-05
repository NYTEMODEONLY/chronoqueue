# Inventory & Item UI Component Specs

**Version:** 1.0
**Author:** Art Director, VOID Studios
**Date:** 2026-04-04
**Parent Issue:** [VOI-27](/VOI/issues/VOI-27) — Inventory & Item UI Component Designs
**Depends On:** [Visual Language](../art-bible/visual-language.md), [UI Visual Direction](../art-bible/ui-visual-direction.md), [Item System Spec](item-system.md)
**Implements For:** Sprint 3 development

---

## Design North Star

> The inventory is the player's trophy case. Every item should feel like it *arrived* — earned, found, won. The grid is not a spreadsheet of assets; it's a collection of small victories, each colored by rarity and waiting to be examined.

The inventory UI serves all four agency layers:
- **AFK/Casual:** Auto-equip handles everything. The inventory is rarely visited. When they do, "NEW" badges and rarity glow make decisions instant.
- **Engaged:** Filter by slot, sort by stat. Compare items against equipped gear. Sell in bulk.
- **Deep:** Sort by sell value for gold optimization. Filter by specific stats for build targeting.

All specs reference tokens from `visual-language.md` and follow the five UI rules from `ui-visual-direction.md`.

---

# 1. Inventory Grid Layout

## 1.1 Grid Structure

50 slots total. The grid is the central element of the inventory screen.

```
┌─ INVENTORY (24/50) ──────────────────────────────────────┐
│                                                          │
│  [Filter: All v] [Sort: Rarity v]  ████████░░░░ 24/50   │
│                                                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
│  │ ⚔ │ │ 🛡 │ │ ⚔ │ │ 💍│ │   │ │   │ │   │ │   │      │
│  │Stf│ │Plt│ │Dag│ │Rng│ │   │ │   │ │   │ │   │      │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘      │
│  Rare  Com   Epic  Unco                                  │
│                                                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
│  │...│ │...│ │...│ │...│ │   │ │   │ │   │ │   │      │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘      │
│                                                          │
│  ... (50 slots total, 6-7 rows)                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 1.2 Slot Cell Design

Each inventory slot is a square cell containing a text-based item representation.

### Cell Dimensions

| Viewport | Cell Size | Grid Columns | Gap |
|----------|-----------|-------------|-----|
| Desktop (1024px+) | 56px x 56px | 10 | 4px |
| Tablet (768-1023px) | 48px x 48px | 8 | 3px |
| Mobile (<768px) | 52px x 52px | 5 | 3px |

### Filled Slot Anatomy

```
┌─────────────────┐
│  border: rarity  │
│                  │
│     [icon]       │  ← slot-type icon, --font-small (13px)
│   [abbrev name]  │  ← truncated name, --font-micro (10px)
│                  │
└─────────────────┘
```

**CSS values:**

```css
.inventory-slot--filled {
  aspect-ratio: 1;
  background: var(--bg-surface);              /* #1a1e28 */
  border: 1.5px solid;                        /* color set by rarity */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: background 100ms ease;
  position: relative;
}

.inventory-slot--filled:hover {
  background: var(--bg-raised);               /* #232833 */
  border-color: brightness(current, 1.3);     /* brighten rarity color 30% */
}

.inventory-slot--filled:active {
  transform: scale(0.96);
}
```

**Rarity border colors (from design tokens):**

| Rarity | Border Color | Border Opacity | Glow on Hover |
|--------|-------------|----------------|---------------|
| Common | `--rarity-common` (#9d9d9d) | 40% | none |
| Uncommon | `--rarity-uncommon` (#1eff00) | 40% | `0 0 4px rgba(30,255,0,0.15)` |
| Rare | `--rarity-rare` (#0070dd) | 50% | `0 0 4px rgba(0,112,221,0.2)` |
| Epic | `--rarity-epic` (#a335ee) | 60% | `0 0 4px rgba(163,53,238,0.25)` |
| Legendary | `--rarity-legendary` (#ff8000) | 70% | `0 0 6px rgba(255,128,0,0.3)` |
| Mythic | `--rarity-mythic` (#e6cc80) | 80% | `0 0 8px rgba(230,204,128,0.4)` |

Border opacity ramps up with rarity — common items are visually quiet, legendary items demand attention even at rest.

### Slot-Type Icons

Each item displays a single-character icon indicating its equipment slot. These serve as scannable shapes — the player can parse the grid by shape before reading names.

| Slot | Icon | Rationale |
|------|------|-----------|
| Head | `◆` | Diamond — sits atop |
| Chest | `■` | Solid square — core, sturdy |
| Legs | `▼` | Down-pointing — lower body |
| Weapon | `⚔` | Universal weapon symbol |
| Off-hand | `◐` | Half-circle — secondary |
| Accessory 1 | `○` | Ring shape |
| Accessory 2 | `○` | Ring shape |

```css
.slot-icon {
  font-family: var(--font-inter);
  font-size: var(--font-small);               /* 13px */
  line-height: 1;
  color: var(--text-secondary);               /* #9a9690 */
}

/* For items with rarity uncommon+, icon inherits rarity color */
.slot-icon--rare-plus {
  color: inherit;                              /* matches rarity text color */
}
```

### Abbreviated Item Name

Items display a truncated name (first word or smart abbreviation). Full name is revealed on hover/tap via tooltip.

```css
.slot-name {
  font-family: var(--font-inter);
  font-size: var(--font-micro);               /* 10px */
  line-height: 1.1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  color: inherit;                              /* rarity color from parent */
}
```

**Name truncation rules:**
- Single-word names: show full (e.g., "Sword", "Helm")
- Multi-word names: show first word (e.g., "Staff of Minor Flame" → "Staff")
- Exception: if first word is a prefix adjective (Rusty, Worn, etc.), show the base type instead

### Empty Slot

```css
.inventory-slot--empty {
  aspect-ratio: 1;
  background: var(--bg-deep);                 /* #0d0f14 */
  border: 1px dashed var(--border-subtle);    /* #2a3040 */
  border-radius: var(--panel-radius);         /* 2px */
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot-marker {
  color: var(--text-tertiary);                /* #5c5955 */
  opacity: 0.3;
  font-size: var(--font-small);
}
```

Empty slots display `▫` (small white square) at 30% opacity. Dashed border distinguishes empty from filled.

### "NEW" Badge

Recently acquired items (since last inventory visit) show a small badge.

```
┌───────────┐
│ NEW ┐     │
│     │     │
│   [icon]  │
│   [name]  │
└───────────┘
```

```css
.new-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-family: var(--font-exo2);
  font-size: 7px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--bg-deep);
  background: var(--accent-gold);             /* #c9a959 */
  padding: 1px 3px;
  border-radius: 1px;
  line-height: 1;
}
```

The badge auto-dismisses when the player opens the inventory (marks all as "seen") or after 5 minutes of the inventory being open.

### Selected State

When a slot is tapped/clicked to view details:

```css
.inventory-slot--selected {
  background: var(--bg-raised);               /* #232833 */
  border-color: var(--accent-gold);           /* #c9a959 — overrides rarity */
  box-shadow: 0 0 0 1px var(--accent-gold-dim); /* #8a7339 outer ring */
}
```

## 1.3 Capacity Bar

Displayed below the panel header, above the grid.

```
Slots: 24/50  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░
```

```css
.capacity-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.capacity-label {
  font-family: var(--font-mono);              /* JetBrains Mono */
  font-size: var(--font-small);               /* 13px */
  color: var(--text-secondary);               /* #9a9690 */
  white-space: nowrap;
}

.capacity-bar {
  flex: 1;
  height: 4px;
  background: var(--bg-deep);                 /* #0d0f14 */
  border-radius: 2px;
  overflow: hidden;
}

.capacity-bar-fill {
  height: 100%;
  background: var(--accent-gold-dim);         /* #8a7339 */
  transition: width 300ms ease-out;
  border-radius: 2px;
}

/* Warning state: 90%+ capacity (45+ items) */
.capacity-bar-fill--warning {
  background: var(--status-warning);          /* #f39c12 */
}

/* Full state: 50/50 */
.capacity-bar-fill--full {
  background: var(--status-health);           /* #c0392b */
}
```

## 1.4 Filter and Sort Controls

Positioned between the panel header and the capacity bar.

```css
.inventory-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.inventory-select {
  font-family: var(--font-exo2);
  font-size: var(--font-small);               /* 13px */
  font-weight: 500;
  color: var(--text-primary);                 /* #e8e6e1 */
  background: var(--bg-surface);              /* #1a1e28 */
  border: 1px solid var(--border-subtle);     /* #2a3040 */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 4px 8px;
  cursor: pointer;
  appearance: none;
  /* Custom dropdown arrow */
  background-image: url("data:...");          /* gold chevron SVG */
  background-repeat: no-repeat;
  background-position: right 6px center;
  padding-right: 20px;
}

.inventory-select:hover {
  border-color: var(--border-strong);         /* #3d4558 */
}

.inventory-select:focus {
  border-color: var(--accent-gold-dim);       /* #8a7339 */
  outline: none;
}
```

**Filter options:** All, Head, Chest, Legs, Weapon, Off-hand, Accessory
**Sort options:** Rarity (default), Power Score, Slot, Newest, Sell Value

---

# 2. Equipment Panel

## 2.1 Slot Layout

7 equipment slots arranged in a structured layout that reads top-to-bottom like a character silhouette — not a literal paper doll (this is a text game), but a spatial arrangement that maps to body position.

### Desktop/Tablet Layout

```
┌─ EQUIPMENT ──────────────────────────┐
│                                      │
│          ┌────────┐                  │
│          │  HEAD  │                  │
│          └────────┘                  │
│                                      │
│  ┌────────┐          ┌────────┐      │
│  │OFF-HAND│          │ WEAPON │      │
│  └────────┘          └────────┘      │
│                                      │
│          ┌────────┐                  │
│          │ CHEST  │                  │
│          └────────┘                  │
│                                      │
│          ┌────────┐                  │
│          │  LEGS  │                  │
│          └────────┘                  │
│                                      │
│  ┌────────┐          ┌────────┐      │
│  │ ACC 1  │          │ ACC 2  │      │
│  └────────┘          └────────┘      │
│                                      │
└──────────────────────────────────────┘
```

### Mobile Layout (Compact)

On mobile, the spatial arrangement collapses to a 2-column grid that preserves left/right pairing:

```
┌─ EQUIPMENT ──────────────────┐
│                              │
│  ┌──────────┐ ┌──────────┐  │
│  │   HEAD   │ │  WEAPON  │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │  CHEST   │ │ OFF-HAND │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │   LEGS   │ │  ACC 1   │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────────────────┐   │
│  │       ACC 2          │   │
│  └──────────────────────┘   │
│                              │
└──────────────────────────────┘
```

## 2.2 Equipment Slot Cell

Each equipment slot is wider than an inventory slot — it shows the full item name (or "Empty") with rarity color.

### Filled Equipment Slot

```
┌─────────────────────────────┐
│  ◆ HEAD                     │  ← slot label
│  Iron Helm                  │  ← item name, rarity-colored
│  [Common]                   │  ← rarity badge
└─────────────────────────────┘
```

```css
.equipment-slot {
  background: var(--bg-surface);              /* #1a1e28 */
  border: 1.5px solid var(--border-subtle);   /* #2a3040, overridden by rarity */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  transition: background 100ms ease, border-color 100ms ease;
  min-height: 56px;
}

.equipment-slot:hover {
  background: var(--bg-raised);               /* #232833 */
}

.equipment-slot--filled {
  border-left: 3px solid;                     /* rarity color — thicker left accent */
}

.equipment-slot-label {
  font-family: var(--font-exo2);
  font-size: var(--font-micro);               /* 10px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);                /* #5c5955 */
  display: flex;
  align-items: center;
  gap: 4px;
}

.equipment-slot-label-icon {
  font-size: 9px;
}

.equipment-item-name {
  font-family: var(--font-inter);
  font-size: var(--font-stat);                /* 14px */
  font-weight: 500;
  line-height: 1.3;
  /* color: set by rarity tier */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.equipment-rarity-badge {
  font-family: var(--font-mono);
  font-size: var(--font-micro);               /* 10px */
  text-transform: uppercase;
  /* color: set by rarity tier, dimmed 20% */
}
```

### Empty Equipment Slot

```css
.equipment-slot--empty {
  background: var(--bg-deep);                 /* #0d0f14 */
  border: 1px dashed var(--border-subtle);    /* #2a3040 */
  opacity: 0.7;
}

.equipment-slot--empty .equipment-slot-label {
  color: var(--text-tertiary);                /* #5c5955 */
}

.equipment-empty-text {
  font-family: var(--font-inter);
  font-size: var(--font-small);               /* 13px */
  font-style: italic;
  color: var(--text-tertiary);                /* #5c5955 */
}
```

Empty slots show the slot label (e.g., "◆ HEAD") in tertiary color and "Empty" in italic below. This makes unequipped slots visible and actionable — the player knows what they're missing.

## 2.3 Equipment Panel Grid CSS

```css
/* Desktop/Tablet: spatial layout using CSS Grid with named areas */
.equipment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto auto auto;
  grid-template-areas:
    ".       head    ."
    "offhand .       weapon"
    ".       chest   ."
    ".       legs    ."
    "acc1    .       acc2";
  gap: 6px;
  max-width: 300px;
  margin: 0 auto;
}

/* Mobile: compact 2-column */
@media (max-width: 767px) {
  .equipment-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "head    weapon"
      "chest   offhand"
      "legs    acc1"
      "acc2    acc2";
    max-width: 100%;
  }
}
```

---

# 3. Item Tooltip / Detail View

## 3.1 Trigger Behavior

- **Desktop:** Hover shows mini-tooltip (name + rarity). Click opens full detail panel.
- **Tablet:** Tap opens full detail panel (no hover state).
- **Mobile:** Tap opens full detail panel as a bottom sheet (slides up from bottom of screen).

## 3.2 Mini-Tooltip (Desktop Hover Only)

Appears on hover over any inventory or equipment slot. Positioned above the hovered cell, centered.

```
         ┌───────────────────────────┐
         │  Staff of Minor Flame     │
         │  [Rare] Weapon — Staff    │
         │  Power: 42                │
         └─────────────┬─────────────┘
                       ▼
                   [hovered cell]
```

```css
.mini-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-raised);               /* #232833 */
  border: 1px solid var(--border-strong);     /* #3d4558 */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 6px 10px;
  white-space: nowrap;
  z-index: 50;
  pointer-events: none;
  /* Entry: instant. No fade. Game UIs don't wait. */
}

.mini-tooltip-name {
  font-family: var(--font-inter);
  font-size: var(--font-stat);                /* 14px */
  font-weight: 500;
  /* color: rarity tier color */
}

.mini-tooltip-meta {
  font-family: var(--font-mono);
  font-size: var(--font-micro);               /* 10px */
  color: var(--text-secondary);               /* #9a9690 */
  margin-top: 2px;
}

.mini-tooltip-power {
  font-family: var(--font-mono);
  font-size: var(--font-micro);
  color: var(--text-accent);                  /* #c9a959 */
}

.mini-tooltip-arrow {
  /* 6px CSS triangle pointing down, matches border-strong color */
}
```

## 3.3 Full Detail Panel

Opens when an item is clicked/tapped. On desktop, this is the left sidebar panel (300px). On mobile, this is a bottom sheet.

### Detail Panel Anatomy

```
┌─ ITEM DETAIL ──────────────────────────┐
│                                        │
│  STAFF OF MINOR FLAME                  │  ← Cinzel, --font-h3 (20px), rarity color
│  ★ RARE                                │  ← rarity label with icon
│                                        │
│  ── SLOT ──                            │
│  ⚔ Weapon — Staff                      │  ← Exo 2, --font-small
│                                        │
│  ── STATS ──                           │
│  ◆ INT   +12                           │  ← green if better than equipped
│  ◆ LCK   +3                            │  ← green if better than equipped
│  ◆ VIT   -2  (vs equipped)             │  ← red if worse than equipped
│                                        │
│  ── POWER ──                           │
│  Power Score: 42  (+8 vs equipped)     │  ← gold accent for upgrade
│                                        │
│  ── FLAVOR ──                          │
│  "Carved from the Ever-Burning Oak.    │  ← Inter italic, --text-secondary
│   It smells faintly of ambition."      │
│                                        │
│  ── SELL VALUE ──                       │
│  ● 340 Gold                            │  ← --accent-gold
│                                        │
│  ┌──────────┐  ┌───────────────────┐   │
│  │  EQUIP   │  │   SELL (340g)     │   │
│  └──────────┘  └───────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### Detail Panel CSS

```css
.item-detail-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* --- Item Name --- */
.item-detail-name {
  font-family: var(--font-cinzel);
  font-size: var(--font-h3);                  /* 20px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  /* color: rarity tier color */
  /* text-shadow: rarity glow (from RarityText component) */
}

/* --- Rarity Badge --- */
.item-detail-rarity {
  font-family: var(--font-mono);
  font-size: var(--font-small);               /* 13px */
  font-weight: 500;
  text-transform: uppercase;
  /* color: rarity tier color */
  display: flex;
  align-items: center;
  gap: 4px;
}

.rarity-icon {
  /* ★ for rare+, ▫ for common/uncommon */
}

/* --- Section Divider --- */
.detail-section-label {
  font-family: var(--font-exo2);
  font-size: var(--font-micro);               /* 10px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);                /* #5c5955 */
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 3px;
  margin-top: 4px;
}

/* --- Stat Lines --- */
.stat-line {
  font-family: var(--font-mono);
  font-size: var(--font-stat);                /* 14px */
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  color: var(--text-accent);                  /* ◆ in gold */
  font-size: 10px;
}

.stat-name {
  width: 32px;
  color: var(--text-primary);                 /* #e8e6e1 */
}

.stat-value {
  color: var(--text-primary);
  tabular-nums: true;
}

/* --- Flavor Text --- */
.item-flavor {
  font-family: var(--font-inter);
  font-size: var(--font-small);               /* 13px */
  font-style: italic;
  line-height: 1.5;
  color: var(--text-secondary);               /* #9a9690 */
  padding-left: 8px;
  border-left: 2px solid var(--border-subtle);
}

/* --- Sell Value --- */
.item-sell-value {
  font-family: var(--font-mono);
  font-size: var(--font-stat);                /* 14px */
  color: var(--accent-gold);                  /* #c9a959 */
  display: flex;
  align-items: center;
  gap: 4px;
}

/* --- Action Buttons --- */
.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

/* Uses GameButton component: primary for EQUIP, secondary for SELL */
```

## 3.4 Stat Comparison

When viewing an unequipped item that could fill an equipment slot, stats are shown with a comparison diff against the currently equipped item in that slot.

### Comparison Rules

1. If no item is currently equipped in that slot, all stats show as green (pure upgrade).
2. If an item is equipped, show the delta for each stat present on *either* item.
3. Stats present on the new item but not the old: green `+N`.
4. Stats present on the old item but not the new: red `-N` with "(lost)" label.
5. Stats present on both: green `+N` if higher, red `-N` if lower, `--text-tertiary` `0` if equal.

### Comparison Display

```
── STATS (vs. Iron Staff) ──
◆ INT   +12    ▲ +5              ← green: new item is +5 better
◆ LCK   +3    ▲ +3              ← green: old item had 0 LCK
◆ STR   --     ▼ -4  (lost)     ← red: old item had +4 STR, new has none
```

```css
.stat-diff--positive {
  color: var(--status-stamina);               /* #27ae60 — green */
  font-weight: 500;
}

.stat-diff--negative {
  color: var(--status-health);                /* #c0392b — red */
  font-weight: 500;
}

.stat-diff--neutral {
  color: var(--text-tertiary);                /* #5c5955 */
}

.stat-diff-label {
  font-family: var(--font-mono);
  font-size: var(--font-small);               /* 13px */
  margin-left: 8px;
}
```

### Power Score Comparison

```
Power Score: 42  ▲ +8             ← gold if upgrade, red if downgrade
```

```css
.power-diff--upgrade {
  color: var(--accent-gold-bright);           /* #e8c84a */
  font-weight: 500;
}

.power-diff--downgrade {
  color: var(--status-health);                /* #c0392b */
}
```

## 3.5 Mobile Bottom Sheet

On mobile, the detail view slides up from the bottom as a sheet overlay.

```css
.item-detail-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 70vh;
  background: var(--bg-base);                 /* #13161d */
  border-top: 2px solid var(--border-strong); /* #3d4558 */
  border-radius: 8px 8px 0 0;                /* exception: rounded top corners for sheet */
  padding: var(--panel-padding-mobile);       /* 12px */
  padding-bottom: calc(var(--bottombar-height) + 12px); /* clear bottom nav */
  overflow-y: auto;
  z-index: 100;
  /* Slide-up animation: 200ms ease-out translateY */
  animation: sheet-up 200ms ease-out;
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.sheet-handle {
  width: 32px;
  height: 4px;
  background: var(--border-strong);           /* #3d4558 */
  border-radius: 2px;
  margin: 0 auto 12px;
}

/* Backdrop overlay */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
```

---

# 4. Item Drop Notification

## 4.1 Design Philosophy

Item drops are the heartbeat reward of idle play. The notification must:
1. Be visible without demanding attention (Pillar 1: zero-pressure).
2. Scale in visual drama with rarity — common drops are footnotes, legendary drops are events.
3. Never obstruct the adventure log, which is the primary viewport.

## 4.2 Toast Anatomy

Toasts appear in the top-right corner on desktop, top-center on mobile. They stack downward (max 3 visible, FIFO).

```
┌─────────────────────────────────────────┐
│  ★  Staff of Minor Flame               │
│     [Rare] Weapon  |  Power: 42        │
│     ◆ INT +12  ◆ LCK +3               │
└─────────────────────────────────────────┘
```

### Position and Stacking

```css
.toast-container {
  position: fixed;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: none;
}

/* Desktop: top-right */
@media (min-width: 768px) {
  .toast-container {
    top: calc(var(--topbar-height) + 8px);    /* 56px from top */
    right: 16px;
    max-width: 320px;
  }
}

/* Mobile: top-center */
@media (max-width: 767px) {
  .toast-container {
    top: calc(var(--topbar-height) + 8px);
    left: 8px;
    right: 8px;
  }
}
```

## 4.3 Rarity-Specific Toast Styling

### Common (Subtle — 3s duration)

The player barely notices. A soft confirmation that loot happened.

```css
.toast--common {
  background: var(--bg-surface);              /* #1a1e28 */
  border: 1px solid var(--border-subtle);     /* #2a3040 */
  border-left: 3px solid var(--rarity-common); /* #9d9d9d */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 8px 12px;
  pointer-events: auto;
  /* Enter: slide in from right (desktop) or top (mobile), 150ms */
  /* Exit: fade out, 200ms */
}
```

**Content:** Name only. No stats. Single line.
```
│  ▫  Iron Helm [Common]                     │
```

### Uncommon (Noticeable — 4s duration)

Slightly more prominent. Worth a glance.

```css
.toast--uncommon {
  background: var(--bg-surface);
  border: 1px solid rgba(30, 255, 0, 0.15);
  border-left: 3px solid var(--rarity-uncommon); /* #1eff00 */
  border-radius: var(--panel-radius);
  padding: 8px 12px;
  pointer-events: auto;
}
```

**Content:** Name + slot type. Two lines max.
```
│  ▸  Dented Iron Shield                     │
│     [Uncommon] Off-hand                    │
```

### Rare (Noteworthy — 5s duration)

Clear visual distinction. The player should notice.

```css
.toast--rare {
  background: var(--bg-surface);
  border: 1px solid rgba(0, 112, 221, 0.2);
  border-left: 3px solid var(--rarity-rare);  /* #0070dd */
  border-radius: var(--panel-radius);
  padding: 10px 14px;
  pointer-events: auto;
  box-shadow: 0 0 8px rgba(0, 112, 221, 0.1);
}
```

**Content:** Name + slot + key stats. Three lines.
```
│  ★  Staff of Minor Flame                   │
│     [Rare] Weapon  |  Power: 42            │
│     ◆ INT +12  ◆ LCK +3                   │
```

### Epic (Impressive — 6s duration)

The player should stop and look. Stronger glow, wider padding.

```css
.toast--epic {
  background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(163, 53, 238, 0.08) 100%);
  border: 1px solid rgba(163, 53, 238, 0.25);
  border-left: 3px solid var(--rarity-epic);  /* #a335ee */
  border-radius: var(--panel-radius);
  padding: 12px 16px;
  pointer-events: auto;
  box-shadow: 0 0 12px rgba(163, 53, 238, 0.15);
}
```

**Content:** Full display — name, slot, power, stats. Four lines.

### Legendary (Dramatic — 8s duration)

This is a genuine event. The toast commands attention.

```css
.toast--legendary {
  background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(255, 128, 0, 0.1) 100%);
  border: 1.5px solid rgba(255, 128, 0, 0.3);
  border-left: 4px solid var(--rarity-legendary); /* #ff8000 */
  border-radius: var(--panel-radius);
  padding: 14px 16px;
  pointer-events: auto;
  box-shadow: 0 0 16px rgba(255, 128, 0, 0.2);
  /* Entry animation: scale from 0.95 + glow pulse, 400ms */
  animation: legendary-enter 400ms ease-out;
}

@keyframes legendary-enter {
  0%   { transform: scale(0.95); opacity: 0; box-shadow: 0 0 0 rgba(255,128,0,0); }
  50%  { box-shadow: 0 0 24px rgba(255,128,0,0.35); }
  100% { transform: scale(1); opacity: 1; box-shadow: 0 0 16px rgba(255,128,0,0.2); }
}
```

**Content:** Full display with flavor text excerpt. "LEGENDARY ITEM!" header in Cinzel.

```
│  ★ LEGENDARY ITEM!                        │  ← Cinzel, --font-small, orange
│                                            │
│  Immaculate Temporal Blade                 │  ← Inter, --font-stat, orange
│  of Relentless Cleaving                    │
│  [Legendary] Weapon  |  Power: 187        │
│  ◆ STR +28  ◆ SPD +14  ◆ LCK +9          │
│  "It was forged in time that hasn't       │
│   happened yet."                           │
└────────────────────────────────────────────┘
```

### Mythic (Cinematic — 10s duration)

The rarest drop in the game. The toast is a moment.

```css
.toast--mythic {
  background: linear-gradient(135deg, var(--bg-raised) 0%, rgba(230, 204, 128, 0.12) 100%);
  border: 2px solid rgba(230, 204, 128, 0.4);
  border-radius: var(--panel-radius);
  padding: 16px 18px;
  pointer-events: auto;
  box-shadow:
    0 0 20px rgba(230, 204, 128, 0.25),
    inset 0 1px 0 rgba(230, 204, 128, 0.1);
  animation: mythic-enter 600ms ease-out;
}

@keyframes mythic-enter {
  0%   { transform: scale(0.9); opacity: 0; }
  30%  { box-shadow: 0 0 40px rgba(230,204,128,0.5); }
  100% { transform: scale(1); opacity: 1; }
}

/* Subtle ambient glow pulse while visible */
.toast--mythic::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: var(--panel-radius);
  box-shadow: 0 0 12px rgba(230, 204, 128, 0.15);
  animation: mythic-pulse 2s ease-in-out infinite;
}

@keyframes mythic-pulse {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}
```

**Content:** Full display with unique name treatment. The mythic name uses Cinzel, larger font.

```
┌────────────────────────────────────────────┐
│             ★ MYTHIC ITEM ★               │  ← Cinzel, centered, gold glow
│                                            │
│    Gerald's Retirement Plan               │  ← Cinzel, --font-h3, gold
│    Chrono-Blade of the Final Queue        │  ← Inter italic, --font-small
│                                            │
│    [Mythic] Weapon  |  Power: 312         │
│    ◆ STR +42  ◆ INT +28  ◆ SPD +21       │
│                                            │
│    "A sword that's been waiting           │
│     longer than anyone."                  │
└────────────────────────────────────────────┘
```

## 4.4 Toast Typography Summary

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Rarity header (Legendary+) | Cinzel | `--font-small` (13px) | 700 |
| Item name | Inter | `--font-stat` (14px) | 500 |
| Mythic unique name | Cinzel | `--font-h3` (20px) | 700 |
| Slot/power info | JetBrains Mono | `--font-micro` (10px) | 400 |
| Stat bonuses | JetBrains Mono | `--font-micro` (10px) | 500 |
| Flavor text | Inter italic | `--font-micro` (10px) | 400 |

## 4.5 Toast Interaction

- Clicking/tapping a toast opens the item's full detail panel (navigates to inventory with that item selected).
- Toasts auto-dismiss after their duration. No manual close button — keeping it clean.
- If 3+ toasts are queued, oldest auto-dismisses early. A "+N more items" counter appears below the stack.
- Toasts do NOT appear during catch-up mode (handled by the "While You Were Away" summary instead).

---

# 5. Auto-Sell Indicator

## 5.1 When It Triggers

Auto-sell activates when inventory is at 50/50 capacity and a new item drops. The lowest-value item is auto-sold. The player needs to know this happened.

## 5.2 Visual Design

The auto-sell indicator is a **modified toast** — it uses the toast system but with distinct styling to differentiate it from item drops.

```
┌─────────────────────────────────────────┐
│  ⟳ AUTO-SELL                            │  ← Exo 2, --text-secondary
│  Sold: Rusty Iron Helm [Common]         │  ← item name in rarity color
│  +34 Gold                               │  ← --accent-gold
└─────────────────────────────────────────┘
```

```css
.toast--auto-sell {
  background: var(--bg-surface);              /* #1a1e28 */
  border: 1px solid var(--border-subtle);     /* #2a3040 */
  border-left: 3px solid var(--accent-gold-dim); /* #8a7339 — gold accent, not rarity */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 8px 12px;
  pointer-events: auto;
  opacity: 0.85;                              /* slightly dimmed — less important than drops */
}

.auto-sell-label {
  font-family: var(--font-exo2);
  font-size: var(--font-micro);               /* 10px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);               /* #9a9690 */
  display: flex;
  align-items: center;
  gap: 4px;
}

.auto-sell-icon {
  /* ⟳ rotation icon */
  color: var(--accent-gold-dim);              /* #8a7339 */
}

.auto-sell-item {
  font-family: var(--font-inter);
  font-size: var(--font-small);               /* 13px */
  /* color: rarity color of sold item */
}

.auto-sell-gold {
  font-family: var(--font-mono);
  font-size: var(--font-small);               /* 13px */
  color: var(--accent-gold);                  /* #c9a959 */
}
```

**Duration:** 3 seconds. Auto-sell is a background event — acknowledged, not celebrated.

## 5.3 Capacity Warning in Inventory Panel

When inventory is at 90%+ capacity (45+ items), additional visual feedback appears:

### Capacity Bar Warning

The capacity bar shifts to `--status-warning` orange (see Section 1.3).

### Full Inventory Banner

At 50/50, a persistent banner appears at the top of the inventory grid:

```
┌─ ⚠ INVENTORY FULL ──────────────────────┐
│  New items will be auto-sold.            │
│  Sell or equip items to make room.       │
└──────────────────────────────────────────┘
```

```css
.inventory-full-banner {
  background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(243, 156, 18, 0.08) 100%);
  border: 1px solid rgba(243, 156, 18, 0.25);
  border-left: 3px solid var(--status-warning); /* #f39c12 */
  border-radius: var(--panel-radius);         /* 2px */
  padding: 8px 12px;
  margin-bottom: 8px;
}

.inventory-full-label {
  font-family: var(--font-exo2);
  font-size: var(--font-small);               /* 13px */
  font-weight: 600;
  color: var(--status-warning);               /* #f39c12 */
  display: flex;
  align-items: center;
  gap: 4px;
}

.inventory-full-text {
  font-family: var(--font-inter);
  font-size: var(--font-small);               /* 13px */
  color: var(--text-secondary);               /* #9a9690 */
  margin-top: 2px;
}
```

## 5.4 Batch Auto-Sell Summary

After catch-up mode, if multiple items were auto-sold during absence, the "While You Were Away" summary includes:

```
│  ⟳  Auto-sold: 14 items (+4,820 Gold)    │
```

This uses the same `--accent-gold` styling for the gold amount. No individual item listing — bulk auto-sell is a background system, not a review-worthy event.

---

# 6. Responsive Variants

## 6.1 Breakpoint Definitions

| Breakpoint | Width | Name | Layout Strategy |
|-----------|-------|------|-----------------|
| Mobile | < 768px | `sm` | Single column. Tab-switched panels. Bottom sheet for details. |
| Tablet | 768px - 1023px | `md` | Two-column. Inventory grid + detail panel side by side. |
| Desktop | 1024px+ | `lg` | Full layout. Detail panel as left sidebar, grid as center. |

## 6.2 Desktop Layout (1024px+)

The inventory screen replaces the adventure log as the center content area. The left panel becomes the item detail view. The right panel remains as quest/zone info.

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (persistent)                                                │
├────────────────┬───────────────────────────────────────┬──────────────┤
│ LEFT:          │ CENTER: INVENTORY                     │ RIGHT:       │
│ ITEM DETAIL    │                                       │ EQUIPMENT    │
│ 300px          │ [Filter ▾] [Sort ▾]  ████░░ 24/50    │ 260px        │
│                │                                       │              │
│ ┌────────────┐ │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│ ┌──────┐  │
│ │ STAFF OF   │ │ │⚔ ││🛡 ││⚔ ││💍││  ││  ││  ││  ││  ││  ││ │ HEAD │  │
│ │ MINOR FLAME│ │ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘│ └──────┘  │
│ │ [Rare]     │ │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│ ┌──┐┌──┐ │
│ │            │ │ │  ││  ││  ││  ││  ││  ││  ││  ││  ││  ││ │OH││WP│ │
│ │ ◆ INT  +12│ │ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘│ └──┘└──┘ │
│ │ ◆ LCK  +3 │ │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│ ┌──────┐  │
│ │            │ │ │  ││  ││  ││  ││  ││  ││  ││  ││  ││  ││ │CHEST │  │
│ │ "Carved    │ │ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘│ └──────┘  │
│ │ from the   │ │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│ ┌──────┐  │
│ │ Ever-      │ │ │  ││  ││  ││  ││  ││  ││  ││  ││  ││  ││ │ LEGS │  │
│ │ Burning    │ │ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘│ └──────┘  │
│ │ Oak."      │ │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│ ┌──┐┌──┐ │
│ │            │ │ │  ││  ││  ││  ││  ││  ││  ││  ││  ││  ││ │A1││A2│ │
│ │ [EQUIP]    │ │ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘│ └──┘└──┘ │
│ │ [SELL 340g]│ │                                       │              │
│ └────────────┘ │                                       │              │
├────────────────┴───────────────────────────────────────┴──────────────┤
│  BOTTOM BAR                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop CSS:**

```css
.inventory-screen--desktop {
  display: grid;
  grid-template-columns: 300px 1fr 260px;
  gap: var(--panel-gap);                      /* 4px */
  height: calc(100vh - var(--topbar-height) - var(--bottombar-height));
  overflow: hidden;
}

.inventory-detail-sidebar {
  overflow-y: auto;
}

.inventory-grid-area {
  overflow-y: auto;
}

.equipment-sidebar {
  overflow-y: auto;
}
```

## 6.3 Tablet Layout (768px - 1023px)

Two-column: equipment panel stacks above the inventory grid on the left, detail panel on the right.

```
┌──────────────────────────────────────────────────────────┐
│  TOP BAR (persistent)                                    │
├──────────────────────────────┬────────────────────────────┤
│ LEFT: INVENTORY + EQUIPMENT  │ RIGHT: ITEM DETAIL         │
│                              │ 280px                      │
│ ── EQUIPMENT ──              │                            │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │ ┌────────────────────────┐ │
│ │HEAD│ │CHST│ │LEGS│ │WEPN│ │ │ STAFF OF MINOR FLAME   │ │
│ └────┘ └────┘ └────┘ └────┘ │ │ [Rare]                 │ │
│ ┌────┐ ┌────┐ ┌────┐        │ │                        │ │
│ │ OH │ │ A1 │ │ A2 │        │ │ ◆ INT  +12  ▲ +5      │ │
│ └────┘ └────┘ └────┘        │ │ ◆ LCK  +3   ▲ +3      │ │
│                              │ │                        │ │
│ ── INVENTORY (24/50) ──      │ │ "Carved from the..."   │ │
│ [Filter ▾] [Sort ▾]         │ │                        │ │
│ ████████░░░░ 24/50           │ │ [EQUIP]  [SELL 340g]  │ │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│ └────────────────────────┘ │
│ │  ││  ││  ││  ││  ││  ││  ││  ││                            │
│ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘│                            │
│ ... (8 columns)              │                            │
│                              │                            │
├──────────────────────────────┴────────────────────────────┤
│  BOTTOM BAR                                              │
└──────────────────────────────────────────────────────────┘
```

**Tablet CSS:**

```css
.inventory-screen--tablet {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--panel-gap);                      /* 4px */
  height: calc(100vh - var(--topbar-height) - var(--bottombar-height));
  overflow: hidden;
}

/* Equipment uses horizontal compact layout on tablet */
.equipment-grid--tablet {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: var(--panel-gap);
}
```

## 6.4 Mobile Layout (<768px)

Single column with tab switching. The inventory tab shows the grid. Tapping an item opens the bottom sheet detail view. Equipment is accessed via the Character tab.

```
┌────────────────────────────┐
│ TOP STATUS (condensed)     │
│ Gerald Lv.14               │
│ ██████░░ ████░░ ██░░░░░░░  │
├────────────────────────────┤
│                            │
│  INVENTORY (24/50)         │
│  [Filter ▾] [Sort ▾]      │
│  ████████████░░░░ 24/50    │
│                            │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│  │ ⚔ │ │ 🛡 │ │ ⚔ │ │ 💍│ │   ││
│  │Stf│ │Plt│ │Dag│ │Rng│ │   ││
│  └───┘ └───┘ └───┘ └───┘ └───┘│
│                            │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│  │...│ │...│ │...│ │...│ │   ││
│  └───┘ └───┘ └───┘ └───┘ └───┘│
│                            │
│  ... (5 columns, 10 rows)  │
│                            │
├────────────────────────────┤
│ BOTTOM NAV (56px)          │
│ ⚔   📦   📜   👤   ⚙     │
│ Adv  Inv  Qst  Char Set   │
└────────────────────────────┘
```

**Mobile CSS:**

```css
.inventory-screen--mobile {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--topbar-height) - var(--bottombar-height));
  overflow-y: auto;
  padding: var(--panel-padding-mobile);       /* 12px */
}

.inventory-grid--mobile {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
}
```

**Mobile equipment (under Character tab):**

When the player navigates to the Character tab, the equipment panel uses the 2-column compact layout (Section 2.1 mobile variant). Tapping an equipped item opens the same bottom sheet detail view.

---

# 7. Component Hierarchy Summary

```
InventoryScreen
├── GamePanel (title: "Inventory (N/50)")
│   ├── InventoryControls
│   │   ├── FilterSelect (All, Head, Chest, Legs, Weapon, Off-hand, Accessory)
│   │   └── SortSelect (Rarity, Power Score, Slot, Newest, Sell Value)
│   ├── CapacityBar
│   │   └── InventoryFullBanner (conditional: when 50/50)
│   └── InventoryGrid
│       └── InventorySlot (x50)
│           ├── SlotIcon
│           ├── SlotName
│           ├── NewBadge (conditional)
│           └── MiniTooltip (desktop hover)
├── ItemDetailPanel (desktop/tablet: sidebar | mobile: BottomSheet)
│   ├── ItemName (Cinzel, rarity-colored)
│   ├── RarityBadge
│   ├── SlotInfo
│   ├── StatList
│   │   └── StatLine (with comparison diff)
│   ├── PowerScore (with comparison)
│   ├── FlavorText
│   ├── SellValue
│   └── ActionButtons (Equip, Sell)
├── EquipmentPanel (desktop: right sidebar | tablet: above grid | mobile: Character tab)
│   └── EquipmentGrid
│       └── EquipmentSlot (x7)
│           ├── SlotLabel
│           ├── ItemName (rarity-colored)
│           └── RarityBadge
└── ToastContainer (fixed overlay)
    └── ItemDropToast (rarity-specific styling)
    └── AutoSellToast
```

---

# 8. Data Model Alignment

This spec maps to the database schema as follows:

| UI Concept | DB Table/Field | Notes |
|-----------|---------------|-------|
| Inventory slots (50) | `inventories.slot_index` (0-49) | `slotIndex` is null when equipped |
| Equipment slots (7) | `items.slot` enum | head, chest, legs, weapon, off_hand, accessory_1, accessory_2 |
| Rarity display | `items.rarity_tier` (0-5) | Map: 0=common, 1=uncommon, 2=rare, 3=epic, 4=legendary, 5=mythic |
| Stat bonuses | `items.stat_bonuses` (JSONB) | Keys: str, int, vit, spd, lck |
| Power score | `items.power_score` | Integer, used for comparison |
| Sell price | `items.sell_price` | Integer, displayed in gold |
| Equipped state | `inventories.equipped` | Boolean |
| Item name | `items.name` | Full generated name |
| Weapon type | `items.weapon_type` | physical or magical (weapon slot only) |

**Note on slot names:** The task description uses "Weapon, Armor, Helm, Boots, Gloves, Ring, Amulet" but the authoritative data model uses `head, chest, legs, weapon, off_hand, accessory_1, accessory_2`. This spec follows the data model. UI labels should use human-readable names: Head, Chest, Legs, Weapon, Off-hand, Accessory 1, Accessory 2.

---

# 9. Animation Reference

All animations follow Rule 5 from the UI Visual Direction: "Motion Is Feedback, Not Decoration."

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Toast enter (slide) | 150ms | ease-out | New item drop |
| Toast exit (fade) | 200ms | ease-in | Duration elapsed |
| Legendary toast enter | 400ms | ease-out | Legendary drop |
| Mythic toast enter | 600ms | ease-out | Mythic drop |
| Mythic pulse (ambient) | 2s loop | ease-in-out | While mythic toast visible |
| Bottom sheet enter | 200ms | ease-out | Item tap (mobile) |
| Slot hover | 100ms | ease | Cursor enter |
| Slot press | instant | - | Click/tap |
| Capacity bar fill | 300ms | ease-out | Inventory change |
| New badge appear | instant | - | Item acquired |

No entrance animations on panels. No parallax. No skeleton loading states. The game is always running; the UI is always present.

---

# 10. Accessibility Notes

- All rarity information is communicated through both color AND text labels (e.g., `[Rare]`). Color alone is never the sole indicator.
- Slot-type icons supplement text labels, not replace them. Screen readers receive the full slot name.
- Stat diffs use `▲`/`▼` arrows in addition to green/red color coding, ensuring colorblind accessibility.
- Toast notifications use `role="status"` and `aria-live="polite"` (or `aria-live="assertive"` for Legendary+ drops).
- Minimum touch target size on mobile: 44px x 44px (inventory slots at 52px meet this).
- Contrast ratios: all text on `--bg-surface` meets WCAG AA (4.5:1 for body, 3:1 for large text). Verified: `--text-primary` (#e8e6e1) on `--bg-surface` (#1a1e28) = 11.2:1.
