# ChronoQueue — UI Copy Bible

> **Voice North Star:** "A DM who takes the rules seriously but not the fiction."
>
> This document is the canonical reference for all player-facing text in ChronoQueue. Every string in the game should either come from this document or be written in the voice it defines.

---

## Part 1: Character Creation Flow

### Screen 1 — Class Selection

**Title (Exo 2, Semi-Bold, uppercase):**
CHOOSE YOUR CLASS

**Subtitle (Inter, Regular):**
Each class approaches the queue differently. All of them are correct. Some of them survive.

---

#### Class Cards

Each card shows: class name, tagline, short description, primary stats, and a long description on expand.

**Chronoknight**
- *Tagline (Inter Italic):* "Time is a blade, and I am its edge."
- *Short:* Balanced melee fighter. Reliable progression. Unlikely to die in an embarrassing way.
- *Long:* The Chronoknight is the dependable center of any party — solid damage, decent survivability, and the quiet confidence of someone who's read the manual. They won't top the charts in any single category, but they won't be the one face-down in a swamp at 3 AM either. A fine choice for those who believe showing up consistently is its own form of heroism.
- *Primary Stats:* STR / VIT

**Timestomper**
- *Tagline (Inter Italic):* "Why wait? Hit harder."
- *Short:* Glass cannon melee. Kills fast. Dies sometimes. Regrets nothing.
- *Long:* The Timestomper subscribes to a simple philosophy: if the enemy is dead, it can't hurt you. This is technically correct, and technically is the only kind of correct that matters when you're charging into a room full of things that want to eat you. High damage. High speed. Low patience for being alive. Pairs well with healers, or at the very least, with a backup Timestomper.
- *Primary Stats:* STR / SPD

**Epoch Mage**
- *Tagline (Inter Italic):* "The queue bends to my will."
- *Short:* Magic damage dealer. High burst, low survivability. Very impressed with themselves.
- *Long:* The Epoch Mage channels raw temporal energy into things that are, by most accounts, on fire now. Their damage output is extraordinary. Their hit points are not. This creates a dynamic best described as "spectacular until it isn't." Epoch Mages excel in short encounters where the thing they're fighting dies before they do. When this doesn't happen, it's usually quite brief anyway.
- *Primary Stats:* INT / SPD

**Idlemaster**
- *Tagline (Inter Italic):* "I progress while I sleep."
- *Short:* Idle optimization specialist. Best AFK performance. Works hard so you don't have to.
- *Long:* The Idlemaster has perfected the art of doing things while no one is watching. Higher tick speed, better luck with drops, and an uncanny ability to make progress without supervision. They're not the strongest or the toughest, but they are, reliably, the one who's been busy while everyone else was waiting for you to come back. If the game could play itself, the Idlemaster would be employee of the month.
- *Primary Stats:* SPD / LCK

**Loot Gremlin**
- *Tagline (Inter Italic):* "If it's shiny, it's mine."
- *Short:* Item hunter. Better drop quality. Slower kills. Has their priorities straight.
- *Long:* The Loot Gremlin is less interested in the destination and more interested in what fell out of the enemies along the way. Their luck stat directly improves the quality of every item drop, turning routine encounters into shopping trips. Combat takes a little longer — they're not here to fight, they're here to acquire. If your definition of progress includes the words "Legendary" and "mine now," this is your class.
- *Primary Stats:* LCK / VIT

**Unflappable**
- *Tagline (Inter Italic):* "I have all the time in the world."
- *Short:* Tank. Survives harder content earlier. Refuses to be impressed by anything.
- *Long:* The Unflappable doesn't dodge, doesn't rush, and doesn't panic. They absorb damage with the resigned patience of someone who has been hit by worse and has the paperwork to prove it. Their survivability lets them push into tougher zones before other classes dare, which means they see things first — they just don't seem particularly excited about it. A reassuring presence in any party. Like a very calm wall.
- *Primary Stats:* VIT / STR

---

### Screen 2 — Name Your Hero

**Title (Exo 2, Semi-Bold, uppercase):**
NAME YOUR HERO

**Subtitle (Inter, Regular):**
Choose wisely. They'll be known by this name in every combat log, quest report, and obituary.

**Input Label (Inter, Medium):**
Hero Name

**Placeholder text (Inter, Regular, text-tertiary):**
e.g., Gerald

**Suggested Names (Inter, text-secondary):**
Can't decide? Try one of these:
- Gerald
- Mira
- Thornwick
- Bel
- Gorthax the Adequate
- Susan

**Character limit indicator (JetBrains Mono):**
0/16

---

#### Name Validation Messages

**Name too short (< 2 characters):**
Names must be at least 2 characters. Even legends need more than one letter.

**Name too long (> 16 characters):**
16 characters maximum. The combat log has limited space and your hero has unlimited ego.

**Name taken:**
That name is already in the queue. Someone got here first. It happens.

**Invalid characters:**
Letters only, please. The queue's filing system is old-fashioned.

**Profanity filter:**
The Clerk has rejected this name. Try something the Bureaucratic Clerk would approve of.

**Empty name on submit:**
Your hero needs a name. Anonymous adventuring is surprisingly difficult for record-keeping purposes.

---

### Screen 3 — Confirmation

**Title (Exo 2, Semi-Bold, uppercase):**
CONFIRM YOUR HERO

**Summary panel labels:**

| Label | Example |
|-------|---------|
| Name | Gerald |
| Class | Chronoknight |
| Starting Zone | The Back of the Line |

**Stat summary header (Exo 2, Medium, uppercase):**
STARTING STATS

**Stat display (JetBrains Mono):**
```
STR  7  ████████░░░░░
INT  3  ███░░░░░░░░░░
VIT  7  ████████░░░░░
SPD  4  ████░░░░░░░░░
LCK  4  ████░░░░░░░░░
```

**Flavor line (Inter Italic, text-secondary):**
Your hero has been briefed, equipped, and given a number. The queue awaits.

**Primary button:**
Enter the Queue

**Secondary button:**
Go Back

---

## Part 2: Stat Descriptions

Shown on hover/tap in character creation and the character sheet.

**STR — Strength**
Physical damage scaling. Determines how hard your hero hits things, and how hard those things wish they hadn't been hit. Higher STR means shorter fights — or at least, fights that end on your terms.

**INT — Intelligence**
Magic damage scaling. Powers spells, enchantments, and the quiet superiority of knowing something the enemy doesn't. The primary stat for anyone who believes violence should be elegant.

**VIT — Vitality**
Hit points and survivability. The difference between "wounded" and "defeated" is usually a few points of VIT. Essential for heroes who plan on having a second encounter.

**SPD — Speed**
Action speed and encounter rate. Faster heroes act more often and find more things to fight. Whether this is an advantage depends on the hero's other stats and your definition of "advantage."

**LCK — Luck**
Critical hit chance and drop quality. The most mysterious stat. LCK doesn't make your hero stronger — it makes the universe slightly more cooperative. Higher LCK means better loot, more crits, and a general sense that things are going your way, for now.

---

## Part 3: Combat Log Message Templates

> **Voice:** Deadpan reportage. The system is filing a record, not telling a story. It doesn't know it's funny.
>
> **Humor frequency:** 40-50%. Most entries are straight. Flavor entries provide the comedy.

### Standard Combat

**Attack:**
`{Name} attacks {Enemy} for {N} damage.`

**Attack (weapon named):**
`{Name} strikes {Enemy} with {Weapon} for {N} damage.`

**Critical Hit:**
`CRITICAL! {Name} strikes {Enemy} for {N} damage!`

**Miss:**
`{Name}'s attack misses.`

**Enemy Attack:**
`{Enemy} strikes {Name} for {N} damage.`

**Enemy Critical:**
`{Enemy} lands a critical hit on {Name} for {N} damage.`

**Enemy Miss:**
`{Enemy}'s attack misses {Name}.`

**Defeat Enemy:**
`{Name} defeats {Enemy}.`

**Hero Death:**
`{Name} has fallen.`

**Hero Death (flavor variant, 15% chance):**
- `{Name} has fallen. They seemed surprised.`
- `{Name} has been defeated. It was not their finest moment.`
- `{Name} is down. The {Enemy} does not appear to feel bad about this.`

### Level Up

**Standard:**
`LEVEL UP! {Name} reaches Level {N}!`

**Stat gains (displayed below):**
`STR +{N}   VIT +{N}   SPD +{N}`

### Loot

**Item drop:**
`Loot: {Item Name} [{Rarity}]`

**Gold:**
`+{N} Gold`

**XP:**
`+{N} XP`

**Rare+ drop (flavor append, 30% chance):**
- `{Name} seems pleased.`
- `{Name} holds it up to the light.`
- `The party pauses to admire it briefly.`

### Quest Events

**Quest accepted:**
`Quest accepted: {Quest Name}`

**Quest progress:**
`Quest progress: {N}/{Total} {objective}`

**Quest progress (flavor variant, 20% chance):**
`Quest progress: {N}/{Total} {objective} ({flavor})`
- Flavor options: "reluctantly," "so far," "and counting," "on a good day"

**Quest complete:**
`Quest complete: {Quest Name}`

**Quest rewards:**
`Rewards: {XP} XP, {Gold} Gold, {Item Count}x {Rarity} Equipment`

### Zone Events

**Enter zone:**
`Entering: {Zone Name} ({Act}-{Zone})`

**Zone complete:**
`Zone Complete: {Zone Name}`

### Flavor / Humor Entries

> These appear between combat entries at a rate of roughly 1 per 8-12 combat ticks. They are narrated asides — Inter Italic, text-secondary, ~ icon.

**Idle / ambient (no combat context):**
- `{Name} adjusts their helmet. It doesn't fit any better.`
- `{Name} checks their inventory. Twice.`
- `The party stands around. Morale is acceptable.`
- `{Name} briefly considers a career change. The moment passes.`
- `Someone in the party whistles. No one admits to it.`
- `{Name} looks at the queue. The queue looks back.`

**Post-combat:**
- `{Enemy} had {Gold} gold and no explanation for it.`
- `{Name} wipes their weapon on the grass. The grass objects.`
- `The party agrees not to talk about that last fight.`
- `{Name} levels up and somehow looks the same.`

**Post-miss:**
- `{Name} blames the wind.`
- `{Enemy} didn't even flinch.`
- `That was a practice swing.`

**Post-crit:**
- `{Enemy} felt that one.`
- `Even the combat log is impressed.`
- `{Name} will remember this. So will {Enemy}, briefly.`

**Post-hero-death:**
- `It happens to the best of them. And also to {Name}.`
- `A learning experience. Reportedly.`

---

## Part 4: Game UI Copy

### Inventory Screen

**Header (Exo 2, Semi-Bold, uppercase):**
INVENTORY

**Capacity indicator:**
`{N}/{Max}` — e.g., `24/50`

**Capacity near full (90%+, orange):**
`47/50 — Getting heavy.`

**Capacity full (red):**
`50/50 — Full. New items will be auto-sold.`

**Empty state:**
Your inventory is empty. This is either very zen or very early.

**Filter labels:**
All | Weapons | Armor | Accessories

**Sort labels:**
Rarity | Power | Recent

**Item detail panel labels:**
| Label | Notes |
|-------|-------|
| Type | e.g., Weapon — Sword |
| Rarity | Color-coded by tier |
| Power | Stat bonus total |
| Stat bonuses | e.g., STR +4, VIT +2 |
| Flavor text | Inter Italic, text-secondary |

**Equip button:**
Equip

**Sell button:**
Sell ({Gold} Gold)

**Comparison indicator (when hovering item vs. equipped):**
- Better stat: `STR +4 → +7 (+3)` in green
- Worse stat: `VIT +5 → +3 (-2)` in red
- Same: dimmed, no indicator

**Auto-equip toggle label:**
Auto-equip upgrades

**Auto-equip tooltip:**
When enabled, your hero will equip any item that's a clear upgrade. They have decent judgment. Not perfect, but decent.

---

### Quest Tracker

**Header (Exo 2, Semi-Bold, uppercase):**
QUESTS

**Active quest label (Exo 2, Medium, uppercase):**
ACTIVE

**Available quests label:**
AVAILABLE

**Completed quests label:**
COMPLETED

**No active quest:**
No active quest. Your hero is freelancing.

**No available quests:**
No quests available right now. Check back soon — the queue always has more.

**No completed quests:**
No completed quests yet. Give it time.

**Quest card labels:**
| Field | Example |
|-------|---------|
| Title | Retrieve the Orb of Sufficient Importance |
| Description | The Orb is in the cave. The cave's current occupant has been notified and is, reportedly, "not thrilled." |
| Objective | Defeat 5 Cave Goblins |
| Progress | 3/5 |
| Time estimate | ~8 min |
| Rewards | 500 XP, 120 Gold |

**View All (completed section):**
View All

---

### Character Sheet

**Header (Exo 2, Semi-Bold, uppercase):**
CHARACTER

**Section headers:**
- CORE STATS
- EQUIPMENT
- DERIVED STATS

**Derived stat labels with tooltips:**

| Stat | Label | Tooltip |
|------|-------|---------|
| Max HP | Max HP | Total hit points before your hero starts having a bad day. |
| Damage | Damage | Average damage per hit. The enemy's problem, not yours. |
| Crit % | Crit Chance | Chance of a critical hit per attack. Courtesy of LCK. |
| Tick Rate | Tick Rate | How often your hero acts. SPD makes the clock move faster. |

**Empty equipment slot:**
Empty — {Slot Name}

**XP bar label:**
`Level {N} — {current}/{needed} XP`

---

### Settings Screen

**Header:**
SETTINGS

**Section labels:**
- DISPLAY
- NOTIFICATIONS
- ACCOUNT
- ABOUT

**About section copy:**
ChronoQueue — Version {N}
An idle RPG about waiting in line and the heroes who do it for you.

---

### Catch-Up Panel (Return After Absence)

**Header (Exo 2, Semi-Bold, uppercase):**
WHILE YOU WERE AWAY

**Duration line:**
`Gone for: {duration}`

**Summary lines:**
```
Quests completed: {N}
Enemies defeated: {N}
Items found: {N} ({breakdown by rarity})
XP earned: {N}
Gold earned: {N}
```

**Highlights header:**
HIGHLIGHTS

**Buttons:**
`View Full Log` | `Dismiss`

**Flavor line (Inter Italic, text-secondary, shown 30% of the time):**
- `They managed fine without you. Try not to read into that.`
- `Your party stayed busy. Impressively busy, actually.`
- `Everything's under control. Mostly.`
- `The queue moved. Your heroes moved with it.`

---

### Empty States

**No items in inventory:**
Your inventory is empty. This is either very zen or very early.

**No quests active:**
No active quest. Your hero is freelancing.

**No heroes in party (edge case):**
No heroes yet. The queue is waiting.

**No log entries (fresh start):**
The adventure begins. Or it will, any moment now.

**No notifications:**
Nothing to report. The queue is quiet.

**Search with no results:**
Nothing found. The Clerk checked twice.

---

### Navigation Labels

**Bottom bar (mobile) / sidebar (desktop):**
- Adventure
- Inventory
- Quests
- Characters
- Settings

---

### Notification / Toast Messages

**Save complete:**
Progress saved.

**Connection lost:**
Connection lost. Your heroes are still adventuring — we'll catch up when you're back.

**Connection restored:**
Connection restored. Syncing your heroes' adventures.

**New version available:**
Update available. The queue has been renovated.

---

## Part 3: Writing Style Sheet — Quick Reference

> For the Lead Programmer and anyone writing player-facing strings.

### The Voice in One Sentence

A competent, slightly amused narrator who takes the game systems seriously and the fiction not at all.

### Capitalization Rules

| Context | Rule | Example |
|---------|------|---------|
| Screen titles | ALL CAPS (Exo 2 renders them) | INVENTORY |
| Section headers | ALL CAPS | CORE STATS |
| Button labels | Title Case | Enter the Queue |
| Item names | Title Case | Iron Helmet of the Perpetually Surprised |
| Stat abbreviations | ALL CAPS | STR, VIT, INT, SPD, LCK |
| Stat full names | Title Case | Strength, Vitality |
| Quest names | Title Case | Retrieve the Orb of Sufficient Importance |
| Zone names | Title Case | The Back of the Line |
| Class names | Title Case | Chronoknight, Epoch Mage |
| Rarity tiers | Title Case | Common, Uncommon, Rare, Epic, Legendary, Mythic |
| Combat log text | Sentence case | Gerald attacks Goblin for 24 damage. |
| Error messages | Sentence case | Names must be at least 2 characters. |
| Tooltips | Sentence case | Total hit points before your hero starts having a bad day. |
| "LEVEL UP!" | ALL CAPS (Cinzel Moment) | LEVEL UP! |
| "CRITICAL!" | ALL CAPS (Exo 2, gold) | CRITICAL! |

### Punctuation Rules

| Rule | Details |
|------|---------|
| Periods | Always on full sentences. Never on labels, headers, or button text. |
| Exclamation marks | Reserved for LEVEL UP!, CRITICAL!, and rare celebratory moments. Never in error messages, tooltips, or descriptions. One per message maximum. |
| Ellipses | Sparingly. Only for trailing-off flavor text. Never in UI labels. |
| Em dashes | For asides in descriptions. No spaces around them: "solid damage—or at least, damage." |
| Oxford comma | Yes, always. |
| Quotes | Double quotes for in-world speech. Single quotes for emphasis or air-quotes. |

### Humor Guidelines by Context

| Context | Humor Level | What's Allowed | What's Not |
|---------|------------|----------------|------------|
| Class descriptions | 60-70% | Dry wit, understatement, affectionate ribbing | Puns, memes, sarcasm about the player |
| Stat tooltips | 30-40% | One wry observation per tooltip | Jokes that obscure the stat's function |
| Combat log (standard) | 0% | Straight reportage only | Any editorializing |
| Combat log (flavor) | 100% | Deadpan asides, narrator commentary | Loud humor, exclamation marks |
| Quest text | 70-80% | Dry quest descriptions, absurd premises played straight | "Lol random" nonsense |
| Error messages | 10-15% | A light touch after clarity is achieved | Humor that delays comprehension |
| Empty states | 40-50% | Gentle self-awareness | Self-deprecation about the game |
| System messages | 10-15% | Occasional parenthetical aside | Humor in critical alerts |
| Tooltips | 20-30% | One aside after the useful information | Replacing info with jokes |
| Catch-up panel | 20-30% | Optional flavor line at the bottom | Humor in the summary stats |

### Tone Do's and Don'ts

**Do:**
- Start with clarity, add humor as a bonus
- Let the system be dry — the situations are funny
- Use specificity ("47 swords" not "too many items")
- Understate ("not their finest moment" not "EPIC FAIL")
- Give the narrator a consistent voice: competent, patient, slightly amused
- Treat the heroes as real people who happen to be absurd
- Make every joke work on re-read

**Don't:**
- Use exclamation marks for emphasis (they're reserved for Moments)
- Explain the joke
- Break the fourth wall explicitly (the narrator is *in* this world)
- Use internet slang, memes, or references that will date
- Make the player the target of humor
- Sacrifice clarity for a laugh
- Use humor in the same entry as important information
- Stack jokes — one per entry maximum

### String Formatting Reference

**Numbers:** Always use comma separators for 1,000+. `1,240 XP` not `1240 XP`.

**Durations:** Use natural language. `6 hours, 23 minutes` not `6h 23m` (except in compact UI where space is limited).

**Lists in text:** Oxford comma. `500 XP, 120 Gold, and 1x Uncommon Equipment`.

**Item references in text:** Item name in rarity color, followed by [Rarity] tag. `Staff of Minor Flame [Rare]`.

**Stat references in text:** ALL CAPS abbreviation. `STR +3` not `Strength +3` (in compact contexts). Full name in descriptive text.

**Damage numbers:** Always integers. Never decimals. Round down.

**Gold and XP:** Prefixed with `+` when gained. No prefix when displaying totals.

---

## Appendix: Sample Quest Text

For reference — these demonstrate the target voice for quest descriptions.

**Quest: Retrieve the Orb of Sufficient Importance**
> Retrieve the Orb from the cave in Zone 1-3. The cave's current occupant has been notified and is, reportedly, "not thrilled." The Orb itself is unremarkable except for the part where everyone keeps fighting over it.
>
> *Objective: Defeat the Cave Guardian*
> *Rewards: 500 XP, 120 Gold, 1x Uncommon Equipment*

**Quest: Investigate the Suspicious Cave**
> A cave has been reported as "suspicious" by several independent sources, none of whom could articulate what exactly makes a cave suspicious versus merely inconvenient. Your hero has been assigned to investigate. Findings are expected to be violent.
>
> *Objective: Clear 8 enemies in the Suspicious Cave*
> *Rewards: 350 XP, 90 Gold*

**Quest: Deliver the Urgent Package**
> A package has been marked "urgent" for reasons no one can explain, since the queue operates outside normal time anyway. Regardless, your hero has been tasked with carrying it from Point A to Point B. Point B has monsters. The package is not heavy, but the irony might be.
>
> *Objective: Reach Zone 1-3 checkpoint*
> *Rewards: 200 XP, 60 Gold*

---

*This document is maintained by the Creative Director. All copy changes must be reviewed against the Tone Guide and Game Pillars before implementation. When in doubt, read it aloud. If it sounds like a person wrote it on purpose, it's probably right.*
