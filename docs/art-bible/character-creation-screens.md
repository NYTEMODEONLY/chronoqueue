# ChronoQueue — Character Creation Screen Mockups & UI Component Specs

**Version:** 1.0 (Sprint 1)
**Author:** Art Director, VOID Studios
**Date:** 2026-04-04
**Parent Issue:** [VOI-16](/VOI/issues/VOI-16) — Character Creation Screen Mockups & UI Component Specs
**Depends On:** [Visual Language Definition](visual-language.md), [UI Visual Direction](ui-visual-direction.md), [GDD v1](/docs/GDD-v1.md)

---

## Design Intent

Character creation is the player's first interaction with ChronoQueue. It must accomplish three things in under 60 seconds:

1. **Signal "this is a game"** — not a form, not a signup flow, not onboarding. The dark palette, gold accents, and Cinzel typography must land immediately.
2. **Make class choice feel meaningful** — The GDD says this is "the player's first and most meaningful upfront decision." The UI must convey that each class is a fundamentally different way to experience the queue.
3. **Get out of the way fast** — Pillar 1 (Zero-Pressure Play) means no friction. Three screens: name, class, confirm. No tutorials, no mandatory reading, no "are you sure?" dialogs beyond one confirmation.

The flow is linear: **Name → Class Selection → Confirm & Enter**. No back-and-forth branching. The player can go back at any step, but the forward path is always one click away.

---

# Part 1: Screen-by-Screen Mockups

## Screen 1: Name Input

### Design Goal

The name input is the opening curtain. The player sees ChronoQueue's visual identity for the first time — dark background, gold accents, atmospheric typography. The screen should feel like writing your name in a guild registry, not filling out a contact form.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                          (dark void: --bg-deep)                      │
│                                                                      │
│                                                                      │
│                        C H R O N O Q U E U E                         │
│                     Cinzel Bold 39px --accent-gold                    │
│                        letter-spacing: 0.1em                         │
│                                                                      │
│                     "Your heroes are busy."                          │
│                  Inter Italic 16px --text-secondary                   │
│                                                                      │
│                                                                      │
│              ┌─────────────────────────────────────┐                 │
│              │                                     │                 │
│              │  NAME YOUR HERO                     │                 │
│              │  Exo 2 Semi-Bold 20px --text-accent │                 │
│              │                                     │                 │
│              │  ┌─────────────────────────────┐    │                 │
│              │  │ Gerald_                      │    │                 │
│              │  │                              │    │                 │
│              │  └─────────────────────────────┘    │                 │
│              │  Inter 16px --text-primary           │                 │
│              │  on --bg-deep input background       │                 │
│              │                                     │                 │
│              │  2-16 characters. Letters and        │                 │
│              │  spaces only.                        │                 │
│              │  Inter 13px --text-tertiary          │                 │
│              │                                     │                 │
│              │        ┌───────────────────┐        │                 │
│              │        │   CHOOSE CLASS    │        │                 │
│              │        │   Primary Button  │        │                 │
│              │        └───────────────────┘        │                 │
│              │                                     │                 │
│              └─────────────────────────────────────┘                 │
│               Panel: --bg-base, 1px --border-subtle                  │
│               border-top: 1px --border-strong                        │
│               max-width: 480px, centered                             │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Layout Specifications — Name Input

| Property | Value | Notes |
|----------|-------|-------|
| Container | `max-width: 480px; margin: 0 auto` | Centered, narrow — this is an intimate moment |
| Vertical centering | `min-height: 100vh; display: flex; flex-direction: column; justify-content: center` | Screen content is vertically centered in the viewport |
| Title (CHRONOQUEUE) | Cinzel Bold, `--font-display` (39px), `--accent-gold`, `letter-spacing: 0.1em`, `text-align: center` | The wordmark. First thing the player sees. |
| Tagline | Inter Italic, `--font-body` (16px), `--text-secondary`, `margin-top: 8px`, `text-align: center` | Sets tone. Rotates from a pool: "Your heroes are busy." / "The queue awaits." / "Time is a suggestion." |
| Panel | `--bg-base`, `border: 1px solid var(--border-subtle)`, `border-top: 1px solid var(--border-strong)`, `border-radius: 2px`, `padding: 32px 24px`, `margin-top: 48px` | Standard panel treatment per visual language |
| Panel header | Exo 2 Semi-Bold, `--font-h3` (20px), `--text-accent`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `margin-bottom: 24px` | "NAME YOUR HERO" |
| Input field | See Component Spec: Game Input Field (Part 3) | |
| Validation hint | Inter, `--font-small` (13px), `--text-tertiary`, `margin-top: 8px` | Constraint messaging |
| CTA button | See Component Spec: Primary Button (Part 3) | "CHOOSE CLASS →" — disabled until name is valid (2+ chars) |

### Behavior

- **Auto-focus** the name input on page load. The cursor is blinking in the field the moment the screen appears.
- **Live validation**: The "CHOOSE CLASS" button enables (gold fill appears) as soon as the name meets minimum length (2 chars). No submit-to-validate pattern.
- **Character limit**: 16 chars max. Counter not shown unless player reaches 14+ chars, then a subtle `14/16` appears in `--text-tertiary` at the input's right edge.
- **No "generate random name" button** in MVP. The input is enough. Random names are a nice-to-have for post-MVP.
- **Enter key** submits if valid, same as clicking the button.
- **Transition out**: Fade out (200ms) → next screen fades in (200ms). No slide. Game transitions are cuts, not slides.

---

## Screen 2: Class Selection

### Design Goal

This is the main event of character creation. The GDD specifies six classes, each with distinct flavor, playstyle, and stat distributions. The player must be able to:
1. See all six classes at a glance and distinguish them visually.
2. Read enough about any class to make an informed choice without opening a separate detail view.
3. Feel the *personality* of each class through its visual treatment.

The layout is a card grid. Each class gets a card. One card is selected at a time. Selection reveals a stat breakdown panel.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ← BACK                    CHOOSE YOUR CLASS                         │
│  Inter 14px               Cinzel Bold 31px --accent-gold             │
│  --text-secondary          letter-spacing: 0.05em                    │
│                                                                      │
│  Gerald awaits a path.                                               │
│  Inter Italic 16px --text-secondary                                  │
│                                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                       │
│  │            │ │            │ │  ★ ACTIVE  │                       │
│  │ ⚔         │ │ ⚡         │ │ ✦          │                       │
│  │            │ │            │ │            │                       │
│  │ CHRONO-   │ │ TIME-      │ │ EPOCH      │                       │
│  │ KNIGHT    │ │ STOMPER    │ │ MAGE       │                       │
│  │            │ │            │ │            │                       │
│  │ Balanced  │ │ Glass      │ │ Magic      │                       │
│  │ melee     │ │ cannon     │ │ damage     │                       │
│  │ fighter   │ │ melee      │ │ dealer     │                       │
│  │            │ │            │ │            │                       │
│  │ STR / VIT │ │ STR / SPD  │ │ INT / SPD  │                       │
│  │            │ │            │ │            │                       │
│  └────────────┘ └────────────┘ └────────────┘                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                       │
│  │            │ │            │ │            │                       │
│  │ ◈         │ │ ★         │ │ 🛡         │                       │
│  │            │ │            │ │            │                       │
│  │ IDLE-     │ │ LOOT       │ │ UN-        │                       │
│  │ MASTER    │ │ GREMLIN    │ │ FLAPPABLE  │                       │
│  │            │ │            │ │            │                       │
│  │ Idle      │ │ Item       │ │ Tank       │                       │
│  │ optimizer │ │ hunter     │ │            │                       │
│  │            │ │            │ │            │                       │
│  │ SPD / LCK │ │ LCK / VIT  │ │ VIT / STR  │                       │
│  │            │ │            │ │            │                       │
│  └────────────┘ └────────────┘ └────────────┘                       │
│                                                                      │
│  ┌─ EPOCH MAGE ─────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  "The queue bends to my will."                                │   │
│  │  Inter Italic --text-secondary                                │   │
│  │                                                               │   │
│  │  Magic damage dealer. High burst, squishy.                    │   │
│  │  Inter 16px --text-primary                                    │   │
│  │                                                               │   │
│  │  ── STARTING STATS ──                                         │   │
│  │                                                               │   │
│  │  STR ██░░░░░░░░░░░░   2                                      │   │
│  │  INT █████████████░   9    ← highest, --accent-gold           │   │
│  │  VIT ████░░░░░░░░░░   4                                      │   │
│  │  SPD █████░░░░░░░░░   5                                      │   │
│  │  LCK █████░░░░░░░░░   5                                      │   │
│  │                                                               │   │
│  │  Total: 25                                                    │   │
│  │                                                               │   │
│  │  ── GROWTH FOCUS ──                                           │   │
│  │                                                               │   │
│  │  INT ████████████████████  40%  "Your primary power source"   │   │
│  │  SPD ████████████░░░░░░░░  20%                                │   │
│  │  LCK ████████████░░░░░░░░  20%                                │   │
│  │  VIT ██████░░░░░░░░░░░░░░  15%                                │   │
│  │  STR ██░░░░░░░░░░░░░░░░░░   5%                                │   │
│  │                                                               │   │
│  │              ┌────────────────────────────┐                   │   │
│  │              │   BEGIN AS EPOCH MAGE      │                   │   │
│  │              │   Primary Button (large)   │                   │   │
│  │              └────────────────────────────┘                   │   │
│  │                                                               │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Class Card Grid Specifications

| Property | Value |
|----------|-------|
| Grid container | `display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 960px; margin: 0 auto` |
| Card min-width | `200px` |
| Card aspect-ratio | `~3:4` (not enforced via CSS, achieved through consistent content height) |
| Card padding | `20px 16px` |
| Card background | `var(--bg-base)` default, `var(--bg-surface)` on hover |
| Card border | `1px solid var(--border-subtle)` default |
| Card border (hover) | `1px solid var(--border-strong)` |
| Card border (selected) | `1px solid var(--accent-gold)`, `box-shadow: 0 0 8px rgba(201,169,89,0.2)` |
| Card border-radius | `2px` |
| Card cursor | `pointer` |
| Card transition | `border-color 150ms ease-out, background-color 150ms ease-out, box-shadow 150ms ease-out` |

### Class Visual Identity

Each class gets a single-character icon glyph and a color accent used only within the class card and detail panel. These are **not** the gameplay status colors — they're identity markers for the selection screen.

| Class | Icon Glyph | Accent Tint | Rationale |
|-------|-----------|-------------|-----------|
| **Chronoknight** | `⚔` | `--accent-gold` (#c9a959) | Gold = balanced, reliable, the "default hero" energy |
| **Timestomper** | `⚡` | `#e05555` (warm red) | Aggression, speed, risk — glass cannon energy |
| **Epoch Mage** | `✦` | `#7b68ee` (medium slate blue) | Magic, intellect, the classic mage purple-blue |
| **Idlemaster** | `◈` | `#2a9d8f` (teal, `--accent-teal`) | Efficiency, optimization, the "system player" |
| **Loot Gremlin** | `★` | `#e8c84a` (`--accent-gold-bright`) | Treasure, luck, the glint of shiny things |
| **Unflappable** | `🛡` | `#7a8fa6` (steel blue-gray) | Stoic, immovable, armored patience |

**These accent tints are used for:**
- The icon glyph color on the card
- A subtle `border-left: 3px solid {accent}` on the selected detail panel
- The highest stat bar fill color in the stat preview

**These accent tints are NOT used for:**
- Body text (always `--text-primary` or `--text-secondary`)
- Background fills (always the standard `--bg-*` tokens)
- Buttons (always standard gold primary button treatment)

### Class Card Content Hierarchy

Each card contains, top to bottom:

1. **Icon glyph** — 24px, class accent color, centered or top-left
2. **Class name** — Exo 2 Semi-Bold, `--font-h3` (20px), `--text-primary`, uppercase. Hyphenated if needed (CHRONO-KNIGHT wraps on narrow cards).
3. **Playstyle one-liner** — Inter, `--font-body` (16px), `--text-secondary`. "Balanced melee fighter." / "Glass cannon melee." etc.
4. **Primary stats** — JetBrains Mono, `--font-stat` (14px), `--text-accent`. "STR / VIT" — the two dominant stats, separated by ` / `.

**Card text is left-aligned.** Centered text in small cards creates ragged edges. Left-aligned keeps it clean.

### Detail Panel (Below Cards)

When a class is selected, a detail panel expands below the card grid (slide-down, 200ms ease-out). This panel contains the full stat breakdown and the confirmation CTA.

| Property | Value |
|----------|-------|
| Panel container | `max-width: 960px; margin: 16px auto 0; padding: 24px` |
| Panel background | `var(--bg-base)` |
| Panel border | `1px solid var(--border-subtle)`, `border-top: 1px solid var(--border-strong)` |
| Panel border-left | `3px solid {class-accent-color}` — the class identity stripe |
| Panel border-radius | `2px` |
| Panel transition | `max-height 200ms ease-out, opacity 200ms ease-out` (use max-height for expand/collapse) |

**Detail panel content:**

1. **Class name** — Cinzel Bold, `--font-h2` (25px), `--text-primary`. This is a Moment-level use of Cinzel — the player is considering their destiny.
2. **Flavor quote** — Inter Italic, `--font-body` (16px), `--text-secondary`. "The queue bends to my will."
3. **Playstyle description** — Inter, `--font-body` (16px), `--text-primary`. "Magic damage dealer. High burst, squishy."
4. **Starting Stats section** — See Stat Display component spec (Part 3)
5. **Growth Focus section** — Shows the class growth weights as bars, sorted highest-to-lowest. This tells the engaged player "here's what this class becomes long-term."
6. **CTA button** — "BEGIN AS {CLASS NAME}" — Primary button, large variant. See Button component spec (Part 3).

### The Six Classes — Stat Data Reference

For the programmer's implementation, here is the complete data set:

```
CHRONOKNIGHT
  flavor: "Time is a blade, and I am its edge."
  playstyle: "Balanced melee fighter. Steady, reliable progression."
  primaryStats: "STR / VIT"
  starting: { STR: 7, INT: 3, VIT: 7, SPD: 4, LCK: 4 }
  growth: { STR: 30, INT: 10, VIT: 30, SPD: 15, LCK: 15 }

TIMESTOMPER
  flavor: "Why wait? Hit harder."
  playstyle: "Glass cannon melee. Kills fast, dies sometimes."
  primaryStats: "STR / SPD"
  starting: { STR: 9, INT: 2, VIT: 4, SPD: 6, LCK: 4 }
  growth: { STR: 40, INT: 5, VIT: 15, SPD: 25, LCK: 15 }

EPOCH MAGE
  flavor: "The queue bends to my will."
  playstyle: "Magic damage dealer. High burst, squishy."
  primaryStats: "INT / SPD"
  starting: { STR: 2, INT: 9, VIT: 4, SPD: 5, LCK: 5 }
  growth: { STR: 5, INT: 40, VIT: 15, SPD: 20, LCK: 20 }

IDLEMASTER
  flavor: "I progress while I sleep."
  playstyle: "Idle optimization specialist. Best AFK performance."
  primaryStats: "SPD / LCK"
  starting: { STR: 4, INT: 4, VIT: 4, SPD: 7, LCK: 6 }
  growth: { STR: 15, INT: 15, VIT: 15, SPD: 30, LCK: 25 }

LOOT GREMLIN
  flavor: "If it's shiny, it's mine."
  playstyle: "Item hunter. Better drop quality, slower kills."
  primaryStats: "LCK / VIT"
  starting: { STR: 4, INT: 3, VIT: 5, SPD: 4, LCK: 9 }
  growth: { STR: 15, INT: 10, VIT: 20, SPD: 15, LCK: 40 }

UNFLAPPABLE
  flavor: "I have all the time in the world."
  playstyle: "Tank. Survives harder content earlier."
  primaryStats: "VIT / STR"
  starting: { STR: 5, INT: 3, VIT: 9, SPD: 4, LCK: 4 }
  growth: { STR: 20, INT: 10, VIT: 40, SPD: 15, LCK: 15 }
```

### Behavior — Class Selection Screen

- **First load**: No class is selected. Detail panel is collapsed. All six cards visible. The screen title and subtitle are enough context.
- **Card click/tap**: Selects that class. Previously selected card deselects. Detail panel updates (cross-fade content, 150ms). If no panel was showing, it expands.
- **Card hover** (desktop): Subtle background lighten + border strengthen. Not a selection — just tactile feedback.
- **Keyboard navigation**: Arrow keys move selection between cards. Enter confirms (equivalent to clicking the CTA). Tab cycles through cards. Focus ring uses `--border-strong` with 2px offset.
- **"← BACK" link**: Top-left. Returns to Name Input screen. Inter, `--font-stat` (14px), `--text-secondary`, hover: `--text-accent`. The `←` arrow is a text character, not an icon. No back button styling — this is a subtle link, not a prominent action.
- **CTA click**: Proceeds to Confirm & Enter screen with selected class.

---

## Screen 3: Stat Review & Confirmation

### Design Goal

A brief confirmation screen that recaps the player's choices before entering the game. This is NOT a "are you sure?" friction gate — it's a moment of anticipation. The player sees their hero's identity crystallized: name, class, starting stats. One button to begin.

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ← BACK                    YOUR HERO                                 │
│  Inter 14px               Cinzel Bold 31px --accent-gold             │
│  --text-secondary          letter-spacing: 0.05em                    │
│                                                                      │
│                                                                      │
│  ┌─ HERO SUMMARY ────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────┐     │  │
│  │  │                                                      │     │  │
│  │  │           G E R A L D                                │     │  │
│  │  │   Cinzel Bold 39px --text-primary                    │     │  │
│  │  │   letter-spacing: 0.08em                             │     │  │
│  │  │                                                      │     │  │
│  │  │           Level 1 Epoch Mage                         │     │  │
│  │  │   Exo 2 Medium 20px --text-accent                    │     │  │
│  │  │                                                      │     │  │
│  │  │   "The queue bends to my will."                      │     │  │
│  │  │   Inter Italic 16px --text-secondary                 │     │  │
│  │  │                                                      │     │  │
│  │  └──────────────────────────────────────────────────────┘     │  │
│  │  Identity card: --bg-surface, border-left: 3px class accent   │  │
│  │                                                                │  │
│  │  ── STARTING STATS ──                                         │  │
│  │                                                                │  │
│  │  STR ██░░░░░░░░░░░░   2        Damage output                 │  │
│  │  INT █████████████░   9        Magic power                    │  │
│  │  VIT ████░░░░░░░░░░   4        Health pool                   │  │
│  │  SPD █████░░░░░░░░░   5        Action speed                  │  │
│  │  LCK █████░░░░░░░░░   5        Drop quality                  │  │
│  │                                                                │  │
│  │  Total: 25            JetBrains Mono --text-tertiary          │  │
│  │                                                                │  │
│  │  ── WHAT THIS MEANS ──                                        │  │
│  │                                                                │  │
│  │  Max HP: 75   |   Damage: 5-7   |   Crit: 2.5%               │  │
│  │  JetBrains Mono 14px, labels --text-secondary,                │  │
│  │  values --text-primary                                        │  │
│  │                                                                │  │
│  │                                                                │  │
│  │              ┌──────────────────────────────┐                 │  │
│  │              │                              │                 │  │
│  │              │     ENTER THE QUEUE          │                 │  │
│  │              │                              │                 │  │
│  │              └──────────────────────────────┘                 │  │
│  │              Primary Button (large), gold, centered           │  │
│  │                                                                │  │
│  │  You can change nothing about this later.                     │  │
│  │  Choose wisely. Or don't. Gerald doesn't judge.               │  │
│  │  Inter Italic 13px --text-tertiary, centered                  │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Layout Specifications — Confirmation Screen

| Property | Value |
|----------|-------|
| Container | `max-width: 640px; margin: 0 auto` — narrower than class selection, more focused |
| Identity card | `--bg-surface`, `border-left: 3px solid {class-accent}`, `padding: 24px`, `margin-bottom: 24px`, `text-align: center` |
| Hero name | Cinzel Bold, `--font-display` (39px), `--text-primary`, `letter-spacing: 0.08em`, `text-transform: uppercase` |
| Class title | Exo 2 Medium, `--font-h3` (20px), `--text-accent`, `margin-top: 8px` |
| Flavor quote | Inter Italic, `--font-body` (16px), `--text-secondary`, `margin-top: 12px` |
| Stat section | Same stat bar component as class selection, but with brief descriptions beside each stat |
| Derived stats | JetBrains Mono, `--font-stat` (14px), labels in `--text-secondary`, values in `--text-primary`, pipe-separated |
| CTA | "ENTER THE QUEUE" — Primary Button large variant. This is the biggest button in the entire creation flow. |
| Flavor footnote | Inter Italic, `--font-small` (13px), `--text-tertiary`, `text-align: center`, `margin-top: 16px` |

### Stat Descriptions (shown on confirmation screen only)

| Stat | Brief Description |
|------|-------------------|
| STR | "Damage output" |
| INT | "Magic power" |
| VIT | "Health pool" |
| SPD | "Action speed" |
| LCK | "Drop quality" |

These are not shown on the class selection screen (too much text density). They appear here as a final educational moment for players who want to understand what they chose.

### Behavior — Confirmation Screen

- **"← BACK" link**: Returns to class selection with previous selection preserved.
- **CTA click**: Triggers the transition-to-game sequence (Screen 4).
- **No "are you sure?" dialog.** The confirmation screen IS the "are you sure" moment. One more click and you're in. Pillar 1: zero friction.

---

## Screen 4: Transition to Game

### Design Goal

A brief, atmospheric transition that bridges "you're creating a character" to "you're playing a game." This is not a loading screen (the game should load instantly — it's text). It's a narrative beat.

### Sequence (all viewports)

```
PHASE 1: Fade to dark (300ms)
  The confirmation screen fades to --bg-deep.

PHASE 2: Entry text (hold 2 seconds)
  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │                                                              │
  │              Gerald joins the queue.                          │
  │              Inter Italic 20px --text-secondary              │
  │              Fades in over 400ms, centered                   │
  │                                                              │
  │              Position 9,417 of 9,417.                         │
  │              JetBrains Mono 14px --text-tertiary             │
  │              Fades in 200ms after first line                  │
  │                                                              │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘

PHASE 3: Transition to Main Game View (300ms)
  Entry text fades out. The main game screen (adventure view)
  fades in. The adventure log already has its first entry:

  "Gerald arrives at the Back of the Line.
   The queue stretches endlessly ahead.
   This is going to take a while."
```

### Timing Breakdown

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Confirmation screen fade-out | 300ms | 0.3s |
| Entry text line 1 fade-in | 400ms | 0.7s |
| Entry text line 2 fade-in | 200ms (staggered 400ms after line 1) | 1.1s |
| Hold | 1500ms | 2.6s |
| Entry text fade-out | 300ms | 2.9s |
| Main game view fade-in | 300ms | 3.2s |
| **Total transition time** | **~3.2 seconds** | |

This is the maximum time the player spends not interacting. 3.2 seconds is enough for the narrative beat without feeling like a gate. If the player clicks/taps during Phase 2, skip directly to Phase 3 (respect Pillar 1: never hold the player hostage).

---

# Part 2: Responsive Variants

## Phone Portrait (< 480px)

### Screen 1: Name Input — Phone

```
┌──────────────────────┐
│                      │
│   C H R O N O Q U E U E
│   Cinzel 25px        │
│   --accent-gold      │
│                      │
│   "Your heroes       │
│    are busy."        │
│   Inter Italic 14px  │
│                      │
│ ┌──────────────────┐ │
│ │ NAME YOUR HERO   │ │
│ │                  │ │
│ │ ┌──────────────┐ │ │
│ │ │ Gerald_      │ │ │
│ │ └──────────────┘ │ │
│ │                  │ │
│ │ 2-16 characters  │ │
│ │                  │ │
│ │ ┌──────────────┐ │ │
│ │ │ CHOOSE CLASS │ │ │
│ │ └──────────────┘ │ │
│ │                  │ │
│ └──────────────────┘ │
│                      │
└──────────────────────┘
```

**Phone adaptations:**
- Title scales to `--font-h1` (31px) below 480px, `25px` below 360px
- Panel becomes full-width with `margin: 0 12px`
- Padding reduces to `20px 16px`
- Input and button become `width: 100%`
- Virtual keyboard push: the panel should be in a scrollable container so the keyboard doesn't obscure the input. Use `padding-bottom: 50vh` as a keyboard-safe buffer.

### Screen 2: Class Selection — Phone

```
┌──────────────────────┐
│ ← Back               │
│                      │
│   CHOOSE YOUR CLASS  │
│   Cinzel 25px        │
│                      │
│ Gerald awaits a path.│
│                      │
│ ┌──────────────────┐ │
│ │ ⚔ CHRONOKNIGHT   │ │
│ │ Balanced melee    │ │
│ │ STR / VIT         │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ⚡ TIMESTOMPER    │ │
│ │ Glass cannon      │ │
│ │ STR / SPD         │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ✦ EPOCH MAGE     │ │  ← selected
│ │ Magic damage      │ │     (gold
│ │ INT / SPD         │ │      border)
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ◈ IDLEMASTER     │ │
│ │ Idle optimizer    │ │
│ │ SPD / LCK         │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ★ LOOT GREMLIN   │ │
│ │ Item hunter       │ │
│ │ LCK / VIT         │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 🛡 UNFLAPPABLE   │ │
│ │ Tank              │ │
│ │ VIT / STR         │ │
│ └──────────────────┘ │
│                      │
│ ── EPOCH MAGE ────── │
│                      │
│ "The queue bends     │
│  to my will."        │
│                      │
│ STR ██░░░░░░░  2     │
│ INT █████████  9     │
│ VIT ████░░░░░  4     │
│ SPD █████░░░░  5     │
│ LCK █████░░░░  5     │
│                      │
│ ┌──────────────────┐ │
│ │ BEGIN AS EPOCH   │ │
│ │ MAGE             │ │
│ └──────────────────┘ │
│                      │
└──────────────────────┘
```

**Phone adaptations:**
- Cards switch to `grid-template-columns: 1fr` — single column, full width
- Cards become compact horizontal rows: icon + name + playstyle on one line, primary stats below
- Card height reduces (no aspect ratio enforcement — content drives height)
- Detail panel appears below the selected card (no separate zone — inline expansion)
- Growth Focus section is hidden on phone (too much data for the viewport). Starting Stats are sufficient for the choice.
- The page scrolls vertically — all six cards + detail panel are in a single scroll view
- CTA button is `width: 100%`, `position: sticky; bottom: 12px` when detail panel is in view (keeps the action always reachable)

### Screen 3: Confirmation — Phone

```
┌──────────────────────┐
│ ← Back               │
│                      │
│   YOUR HERO          │
│   Cinzel 25px        │
│                      │
│ ┌──────────────────┐ │
│ │                  │ │
│ │   G E R A L D    │ │
│ │   Cinzel 31px    │ │
│ │                  │ │
│ │   Level 1        │ │
│ │   Epoch Mage     │ │
│ │   Exo 2 16px     │ │
│ │                  │ │
│ │   "The queue     │ │
│ │    bends to      │ │
│ │    my will."     │ │
│ │                  │ │
│ └──────────────────┘ │
│                      │
│ ── STARTING STATS ── │
│                      │
│ STR ██░░░░░  2       │
│     Damage output    │
│ INT ████████ 9       │
│     Magic power      │
│ VIT ████░░░  4       │
│     Health pool      │
│ SPD █████░░  5       │
│     Action speed     │
│ LCK █████░░  5       │
│     Drop quality     │
│                      │
│ HP: 75  DMG: 5-7     │
│ Crit: 2.5%           │
│                      │
│ ┌──────────────────┐ │
│ │ ENTER THE QUEUE  │ │
│ └──────────────────┘ │
│                      │
│ Choose wisely.       │
│ Or don't.            │
│                      │
└──────────────────────┘
```

**Phone adaptations:**
- Hero name scales down to `--font-h1` (31px)
- Identity card is full-width
- Derived stats wrap to 2 lines instead of pipe-separated single line
- CTA is full-width
- Flavor footnote is shortened: "Choose wisely. Or don't."

## Tablet (768–1024px)

### Screen 2: Class Selection — Tablet

```
┌──────────────────────────────────────────────┐
│ ← Back              CHOOSE YOUR CLASS        │
│                                              │
│ Gerald awaits a path.                        │
│                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ ⚔        │ │ ⚡        │ │ ✦ ACTIVE │      │
│ │ CHRONO-  │ │ TIME-    │ │ EPOCH    │      │
│ │ KNIGHT   │ │ STOMPER  │ │ MAGE     │      │
│ │ Balanced │ │ Glass    │ │ Magic    │      │
│ │ melee    │ │ cannon   │ │ damage   │      │
│ │ STR/VIT  │ │ STR/SPD  │ │ INT/SPD  │      │
│ └──────────┘ └──────────┘ └──────────┘      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ ◈        │ │ ★        │ │ 🛡        │      │
│ │ IDLE-    │ │ LOOT     │ │ UN-      │      │
│ │ MASTER   │ │ GREMLIN  │ │ FLAPPABLE│      │
│ │ Idle opt │ │ Item     │ │ Tank     │      │
│ │ SPD/LCK  │ │ LCK/VIT  │ │ VIT/STR  │      │
│ └──────────┘ └──────────┘ └──────────┘      │
│                                              │
│ ┌─ EPOCH MAGE ─────────────────────────────┐│
│ │ "The queue bends to my will."            ││
│ │                                           ││
│ │ STR ██░░░░░░ 2    Growth: INT 40%        ││
│ │ INT ████████ 9    Growth: SPD 20%        ││
│ │ VIT ████░░░░ 4    Growth: LCK 20%        ││
│ │ SPD █████░░░ 5    Growth: VIT 15%        ││
│ │ LCK █████░░░ 5    Growth: STR  5%        ││
│ │                                           ││
│ │       ┌──────────────────────────┐       ││
│ │       │   BEGIN AS EPOCH MAGE    │       ││
│ │       └──────────────────────────┘       ││
│ └───────────────────────────────────────────┘│
│                                              │
└──────────────────────────────────────────────┘
```

**Tablet adaptations:**
- Card grid stays at `grid-template-columns: repeat(3, 1fr)` — three columns work at 768px+
- Cards are narrower but still readable (min 200px each with gap)
- Detail panel shows Starting Stats and Growth Focus side-by-side in two columns (saves vertical space)
- Title scales to `--font-h1` (31px)

## Responsive Breakpoint Summary

| Element | Phone (<480px) | Tablet (768–1024px) | Desktop (1024px+) |
|---------|---------------|--------------------|--------------------|
| Class card grid | 1 column (list) | 3 columns | 3 columns |
| Card layout | Compact horizontal row | Standard vertical card | Standard vertical card |
| Detail panel | Inline below card | Below grid, 2-col stats | Below grid, full layout |
| Growth Focus | Hidden | Beside starting stats | Below starting stats |
| Title font size | 25px | 31px | 31px |
| Hero name (confirm) | 31px | 39px | 39px |
| CTA width | 100% | auto (centered) | auto (centered) |
| Panel padding | 16px | 20px | 24px |
| Panel max-width | 100% - 24px margin | 100% - 40px margin | 960px centered |

---

# Part 3: Component Specifications

## Component 1: Class Selection Card (`ui_class_card`)

A clickable card representing one of the six character classes. Used in the class selection grid.

### States

| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | `1px solid var(--border-subtle)` | `var(--bg-base)` | None |
| Hover | `1px solid var(--border-strong)` | `var(--bg-surface)` | None |
| Selected | `1px solid var(--accent-gold)` | `var(--bg-surface)` | `0 0 8px rgba(201,169,89,0.2)` |
| Focus (keyboard) | `1px solid var(--accent-gold)` + `outline: 2px solid var(--border-strong); outline-offset: 2px` | `var(--bg-surface)` | None |

### DOM Structure

```html
<button class="class-card" role="radio" aria-checked="false" data-class="epoch-mage">
  <span class="class-card__icon" aria-hidden="true">✦</span>
  <h3 class="class-card__name">Epoch Mage</h3>
  <p class="class-card__playstyle">Magic damage dealer. High burst, squishy.</p>
  <p class="class-card__primary-stats">INT / SPD</p>
</button>
```

**Accessibility:** The card grid is a `role="radiogroup"`. Each card is `role="radio"`. `aria-checked` toggles on selection. This gives screen readers correct semantics for a single-select group.

### CSS Specification

```css
.class-card {
  /* Reset */
  appearance: none;
  font: inherit;
  cursor: pointer;
  text-align: left;

  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 16px;

  /* Visual */
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-top: 1px solid var(--border-strong);
  border-radius: 2px;

  /* Transition */
  transition: border-color 150ms ease-out,
              background-color 150ms ease-out,
              box-shadow 150ms ease-out;
}

.class-card:hover {
  background: var(--bg-surface);
  border-color: var(--border-strong);
}

.class-card[aria-checked="true"] {
  background: var(--bg-surface);
  border-color: var(--accent-gold);
  box-shadow: 0 0 8px rgba(201, 169, 89, 0.2);
}

.class-card__icon {
  font-size: 24px;
  line-height: 1;
  /* Color set per-class via data attribute or CSS variable */
}

.class-card__name {
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: var(--font-h3);  /* 20px */
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.1;
  margin: 0;
}

.class-card__playstyle {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: var(--font-body);  /* 16px */
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.class-card__primary-stats {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  font-size: var(--font-stat);  /* 14px */
  color: var(--text-accent);
  line-height: 1;
  margin: 4px 0 0 0;
}
```

### Phone Variant (< 480px)

```css
@media (max-width: 479px) {
  .class-card {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }

  .class-card__icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .class-card__content {
    flex: 1;
    min-width: 0;  /* Allow text truncation */
  }

  .class-card__name {
    font-size: 16px;
  }

  .class-card__playstyle {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
```

---

## Component 2: Stat Display Bar (`ui_stat_bar`)

A horizontal bar showing a stat name, visual fill proportional to value, and the numeric value. Used in class detail panels and the confirmation screen.

### Visual Structure

```
STR ████████░░░░░░░░░░  7      ← standard
INT █████████████████░  9      ← highest stat, gold accent
VIT ████████░░░░░░░░░░  7
SPD ████░░░░░░░░░░░░░░  4
LCK ████░░░░░░░░░░░░░░  4
```

### DOM Structure

```html
<div class="stat-bar" data-stat="str">
  <span class="stat-bar__label">STR</span>
  <div class="stat-bar__track">
    <div class="stat-bar__fill" style="width: 70%"></div>
  </div>
  <span class="stat-bar__value">7</span>
</div>
```

### CSS Specification

```css
.stat-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 20px;
}

.stat-bar + .stat-bar {
  margin-top: 6px;
}

.stat-bar__label {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: var(--font-stat);  /* 14px */
  color: var(--text-secondary);
  width: 32px;  /* Fixed width for alignment */
  flex-shrink: 0;
  text-align: right;
}

.stat-bar__track {
  flex: 1;
  height: 8px;
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: 1px;
  overflow: hidden;
  min-width: 80px;
}

.stat-bar__fill {
  height: 100%;
  background: var(--border-strong);  /* Default fill: subtle gray */
  border-radius: 1px;
  transition: width 300ms ease-out;
}

/* Highest stat in the set gets gold treatment */
.stat-bar--highest .stat-bar__fill {
  background: var(--accent-gold);
}

.stat-bar--highest .stat-bar__value {
  color: var(--accent-gold);
}

.stat-bar__value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: var(--font-stat);  /* 14px */
  color: var(--text-primary);
  width: 20px;  /* Fixed width for alignment */
  flex-shrink: 0;
  text-align: right;
}
```

### Fill Width Calculation

The bar fill is proportional to the stat value relative to the maximum possible starting stat (9, the highest across all classes).

```
fill_percentage = (stat_value / 10) * 100
```

We use 10 as the denominator (not 9) to leave visual headroom — a stat of 9 fills 90%, not 100%. This prevents the bar from looking "maxed out" at character creation. The empty space hints that stats will grow.

### Animation

When the detail panel opens or switches to a new class, stat bars animate their fill from 0% to target width over 300ms ease-out, staggered 50ms per stat (top to bottom). This creates a satisfying "stats loading in" cascade.

---

## Component 3: Game Input Field (`ui_input_field`)

A styled text input that reads as "game UI" rather than "web form." Used for the character name input and potentially for future text inputs (search, chat).

### Visual States

```
Default:     ┌───────────────────────────────┐
             │ _                             │
             └───────────────────────────────┘
             --bg-deep bg, --border-subtle border

Focused:     ┌───────────────────────────────┐
             │ Gerald_                       │
             └───────────────────────────────┘
             --bg-deep bg, --accent-gold-dim border
             subtle inner glow

Filled:      ┌───────────────────────────────┐
             │ Gerald                        │
             └───────────────────────────────┘
             --bg-deep bg, --border-strong border

Error:       ┌───────────────────────────────┐
             │ G                             │
             └───────────────────────────────┘
             --bg-deep bg, --status-critical border
             "Too short" message below
```

### CSS Specification

```css
.game-input {
  /* Reset */
  appearance: none;
  outline: none;

  /* Layout */
  width: 100%;
  height: 44px;
  padding: 0 16px;

  /* Typography */
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: var(--font-body);  /* 16px — prevents iOS zoom on focus */
  color: var(--text-primary);
  line-height: 44px;

  /* Visual */
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: 2px;

  /* Transition */
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

.game-input::placeholder {
  color: var(--text-tertiary);
  font-style: italic;
}

.game-input:focus {
  border-color: var(--accent-gold-dim);
  box-shadow: inset 0 0 8px rgba(201, 169, 89, 0.1);
}

.game-input--error {
  border-color: var(--status-critical);
  box-shadow: inset 0 0 8px rgba(231, 76, 60, 0.1);
}

.game-input--valid {
  border-color: var(--border-strong);
}
```

### Key Design Decisions

- **`font-size: 16px`** — Critical on iOS. Below 16px, Safari auto-zooms on input focus, which breaks the layout.
- **`--bg-deep` background** — The input looks carved into the panel, like a field in a game character sheet. Not white, not panel-colored — darker than its container.
- **No rounded corners** (2px border-radius only) — Web inputs are typically rounded. Game inputs are sharp.
- **Inset glow on focus** — Instead of the standard focus ring (which reads as "web"), a subtle inner glow in gold signals "game UI, active."
- **No floating label** — The "NAME YOUR HERO" label is external (panel header). The input itself shows placeholder text in italic tertiary color.

---

## Component 4: Primary Button / CTA (`ui_button_primary`)

The main action button. Used for "CHOOSE CLASS," "BEGIN AS {CLASS}," and "ENTER THE QUEUE."

### Visual States

```
Default:     ┌───────────────────────────────┐
             │       ENTER THE QUEUE         │
             └───────────────────────────────┘
             --accent-gold bg, --bg-deep text

Hover:       ┌───────────────────────────────┐  ↑ 1px shift
             │       ENTER THE QUEUE         │
             └───────────────────────────────┘
             --accent-gold-bright bg, brightened

Active:      ┌───────────────────────────────┐  ↓ 1px shift
             │       ENTER THE QUEUE         │
             └───────────────────────────────┘
             darkened gold bg, pressed-in feel

Disabled:    ┌───────────────────────────────┐
             │       CHOOSE CLASS            │
             └───────────────────────────────┘
             --bg-raised bg, --text-tertiary text
             cursor: not-allowed
```

### CSS Specification

```css
.btn-primary {
  /* Reset */
  appearance: none;
  cursor: pointer;
  border: none;

  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 32px;
  min-width: 200px;

  /* Typography */
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: var(--font-body);  /* 16px */
  color: var(--bg-deep);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1;

  /* Visual */
  background: linear-gradient(
    180deg,
    var(--accent-gold-bright) 0%,
    var(--accent-gold) 100%
  );
  border-radius: 2px;

  /* Transition */
  transition: transform 100ms ease-out,
              background 150ms ease-out,
              box-shadow 150ms ease-out;
}

.btn-primary:hover {
  background: linear-gradient(
    180deg,
    #ecd35a 0%,
    var(--accent-gold-bright) 100%
  );
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(201, 169, 89, 0.3);
}

.btn-primary:active {
  background: linear-gradient(
    180deg,
    var(--accent-gold) 0%,
    var(--accent-gold-dim) 100%
  );
  transform: translateY(1px);
  box-shadow: none;
}

.btn-primary:disabled {
  cursor: not-allowed;
  background: var(--bg-raised);
  color: var(--text-tertiary);
  transform: none;
  box-shadow: none;
}

/* Large variant — used for final CTAs */
.btn-primary--large {
  height: 52px;
  padding: 0 40px;
  font-size: 18px;
  min-width: 260px;
}

/* Full-width variant — mobile */
.btn-primary--full {
  width: 100%;
  min-width: unset;
}
```

### Key Design Decisions

- **Gold gradient** (lighter top → darker bottom) — Simulates a light source from above, giving the button physical presence. Flat color reads as "web."
- **translateY on hover/active** — The 1px up-shift on hover and 1px down-shift on press creates a tactile "button press" feel without heavy animation.
- **Dark text on gold** — High contrast. The `--bg-deep` color on `--accent-gold` is ~12:1 contrast ratio, well above WCAG AAA.
- **Exo 2 uppercase with tracking** — Matches the panel header treatment from the visual language. Buttons are structural UI elements, not body text.
- **Large variant** adds 8px height and wider padding for the "ENTER THE QUEUE" CTA — the most important button in the flow.

---

## Component 5: Growth Focus Bar (`ui_growth_bar`)

A simplified bar showing class stat growth percentages, used in the class detail panel. Distinct from the stat bar — this shows where the class's future power goes.

### Visual Structure

```
── GROWTH FOCUS ──

INT ████████████████████  40%  "Your primary power source"
SPD ████████████░░░░░░░░  20%
LCK ████████████░░░░░░░░  20%
VIT ██████░░░░░░░░░░░░░░  15%
STR ██░░░░░░░░░░░░░░░░░░   5%
```

### CSS Specification

```css
.growth-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 16px;
}

.growth-bar + .growth-bar {
  margin-top: 4px;
}

.growth-bar__label {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  font-size: 13px;
  color: var(--text-secondary);
  width: 32px;
  flex-shrink: 0;
  text-align: right;
}

.growth-bar__track {
  flex: 1;
  height: 6px;
  background: var(--bg-deep);
  border-radius: 1px;
  overflow: hidden;
}

.growth-bar__fill {
  height: 100%;
  background: var(--text-secondary);  /* Default: muted */
  border-radius: 1px;
  transition: width 300ms ease-out;
}

/* Top growth stat gets accent treatment */
.growth-bar--primary .growth-bar__fill {
  background: var(--accent-gold-dim);
}

.growth-bar__pct {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  font-size: 13px;
  color: var(--text-tertiary);
  width: 32px;
  flex-shrink: 0;
  text-align: right;
}

.growth-bar__hint {
  font-family: 'Inter', sans-serif;
  font-style: italic;
  font-size: 13px;
  color: var(--text-tertiary);
}
```

### Sorting Rule

Growth bars are always sorted highest-to-lowest (not in STR/INT/VIT/SPD/LCK order). This immediately communicates "this class is about INT" by putting the dominant stat at the top. The player reads the hierarchy before the numbers.

### Hint Text

Only the top (primary) growth stat gets a hint phrase. These are fixed per stat:

| Stat | Hint |
|------|------|
| STR | "Your primary weapon" |
| INT | "Your primary power source" |
| VIT | "Your endurance edge" |
| SPD | "Your tempo advantage" |
| LCK | "Your treasure magnet" |

---

## Component 6: Back Link (`ui_back_link`)

A minimal text link for navigating backward in the creation flow.

### CSS Specification

```css
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: var(--font-stat);  /* 14px */
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: color 150ms ease-out;
  padding: 8px 0;  /* Touch target padding */
}

.back-link:hover {
  color: var(--text-accent);
}

.back-link::before {
  content: '←';
  font-size: 14px;
}
```

**Design note:** The `←` is the text character U+2190, not an SVG icon. Keeping it as text ensures it inherits the font color transition and stays visually consistent with the link text.

---

# Part 4: Color & Typography in Action

## Typography Map Across Creation Flow

| Screen | Element | Font | Weight | Size | Color |
|--------|---------|------|--------|------|-------|
| Name | Game title "CHRONOQUEUE" | Cinzel | Bold 700 | 39px (25px phone) | `--accent-gold` |
| Name | Tagline | Inter | Italic 400 | 16px | `--text-secondary` |
| Name | Panel header "NAME YOUR HERO" | Exo 2 | Semi-Bold 600 | 20px | `--text-accent` |
| Name | Input text | Inter | Regular 400 | 16px | `--text-primary` |
| Name | Validation hint | Inter | Regular 400 | 13px | `--text-tertiary` |
| Name | CTA button | Exo 2 | Semi-Bold 600 | 16px | `--bg-deep` on gold |
| Class | Screen title "CHOOSE YOUR CLASS" | Cinzel | Bold 700 | 31px (25px phone) | `--accent-gold` |
| Class | Subtitle | Inter | Italic 400 | 16px | `--text-secondary` |
| Class | Card class name | Exo 2 | Semi-Bold 600 | 20px (16px phone) | `--text-primary` |
| Class | Card playstyle | Inter | Regular 400 | 16px (14px phone) | `--text-secondary` |
| Class | Card primary stats | JetBrains Mono | Regular 400 | 14px | `--text-accent` |
| Class | Detail panel class name | Cinzel | Bold 700 | 25px | `--text-primary` |
| Class | Detail flavor quote | Inter | Italic 400 | 16px | `--text-secondary` |
| Class | Stat labels | JetBrains Mono | Medium 500 | 14px | `--text-secondary` |
| Class | Stat values | JetBrains Mono | Medium 500 | 14px | `--text-primary` (gold for highest) |
| Class | Section headers "STARTING STATS" | Exo 2 | Semi-Bold 600 | 14px | `--text-accent` |
| Confirm | Screen title "YOUR HERO" | Cinzel | Bold 700 | 31px | `--accent-gold` |
| Confirm | Hero name | Cinzel | Bold 700 | 39px (31px phone) | `--text-primary` |
| Confirm | "Level 1 {Class}" | Exo 2 | Medium 500 | 20px (16px phone) | `--text-accent` |
| Confirm | Flavor quote | Inter | Italic 400 | 16px | `--text-secondary` |
| Confirm | Stat descriptions | Inter | Regular 400 | 13px | `--text-tertiary` |
| Confirm | Derived stat labels | JetBrains Mono | Regular 400 | 14px | `--text-secondary` |
| Confirm | Derived stat values | JetBrains Mono | Medium 500 | 14px | `--text-primary` |
| Confirm | Flavor footnote | Inter | Italic 400 | 13px | `--text-tertiary` |
| Transition | Entry text | Inter | Italic 400 | 20px | `--text-secondary` |
| Transition | Queue position | JetBrains Mono | Regular 400 | 14px | `--text-tertiary` |

## Color Usage Across Creation Flow

| Color Token | Where It Appears in Creation |
|-------------|------------------------------|
| `--bg-deep` (#0d0f14) | Page background (all screens), input field background, button text |
| `--bg-base` (#13161d) | Panel backgrounds, card default background |
| `--bg-surface` (#1a1e28) | Card hover/selected, identity card on confirmation |
| `--bg-raised` (#232833) | Disabled button background |
| `--border-subtle` (#2a3040) | Card/panel default borders, input default border, stat bar track |
| `--border-strong` (#3d4558) | Panel top-edge border, card hover border, stat bar fill (non-highlighted) |
| `--accent-gold` (#c9a959) | Screen titles, section headers, card primary stats, CTA gradient, highlighted stat |
| `--accent-gold-bright` (#e8c84a) | CTA hover state, selected card glow |
| `--accent-gold-dim` (#8a7339) | Input focus border, growth bar primary fill |
| `--text-primary` (#e8e6e1) | Class names, hero name, stat values, playstyle text |
| `--text-secondary` (#9a9690) | Flavor text, subtitles, back link, stat labels |
| `--text-tertiary` (#5c5955) | Validation hints, footnotes, queue position |
| `--text-accent` (#c9a959) | Panel headers, primary stat callouts, class/level display |
| `--status-critical` (#e74c3c) | Input error state border |
| Per-class accent tints | Card icon color, detail panel left border, highest stat bar |

## Accessibility Checklist

- All interactive elements (cards, buttons, inputs) have visible focus indicators.
- Cards use `role="radiogroup"` / `role="radio"` with `aria-checked`.
- Input has associated label (panel header) via `aria-labelledby`.
- Button states (disabled) communicated via `aria-disabled`.
- All color-coded information has a text equivalent (stat names, not just bar fills).
- Minimum font size: 13px (above the 10px accessibility floor from visual language).
- All text/background combinations meet WCAG AA (4.5:1 minimum).
- Transition sequence skippable (click/tap to skip to game).

---

## Implementation Notes for Lead Programmer

1. **Data-driven**: The six classes and their stats should be defined as a JSON/TS data structure, not hardcoded into JSX. The class card grid and detail panel render from this data.
2. **URL routing**: Each screen should have a route (`/create/name`, `/create/class`, `/create/confirm`) so the browser back button works naturally. The player's in-progress creation state persists in local state (not URL params — no stat leakage into the address bar).
3. **CSS custom properties**: All tokens from `visual-language.md` must be defined as CSS custom properties before this flow is built. The creation screens are the first real consumer of the design system.
4. **Font loading**: Cinzel, Exo 2, Inter, and JetBrains Mono must all be loaded before the name input screen renders. Use `font-display: block` for the first render — a flash of unstyled text on the very first screen would break the atmosphere.
5. **Transition sequence**: The Phase 2 text ("Gerald joins the queue.") should use the player's chosen name. This is the first moment their name appears in a narrative context — it lands differently than seeing it in a form field.
6. **No server round-trip on creation**: Character creation should be instant (client-side state → commit to server in background). The player should never see a loading spinner between "ENTER THE QUEUE" and the transition sequence.

---

*This document applies the visual language from [visual-language.md](visual-language.md) and the UI direction from [ui-visual-direction.md](ui-visual-direction.md) to the character creation flow. All implementation must reference the component specs defined here. Deviations require Art Director review.*
