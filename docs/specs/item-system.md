# Item System Spec

**Version:** 2.0 (extends GDD-v1 Sections 6 & 7)
**Author:** Lead Game Designer, VOID Studios
**Date:** 2026-04-04
**Status:** Draft -- Pending board review
**Loop Target:** Micro Loop (individual drops) + Short Loop (gear comparison at quest complete)
**Pillars Served:** Pillar 2 (Parody With Substance), Pillar 4 (Elegant Text, Rich World)

---

## 1. Overview

Items are the tangible reward heartbeat of ChronoQueue. They drop from enemies, follow a 6-tier rarity system, and provide stat bonuses when equipped. The item system produces a constant stream of small upgrades punctuated by occasional rare finds that create genuine excitement.

This spec extends the GDD-v1 item and inventory systems with two new subsystems: **item name generation** (turning stat blocks into memorable, Tone Guide-compliant item names) and **item proc effects** (gear-sourced combat modifications for Epic+ rarity items). All base formulas (drop rates, rarity weights, stat values, power scores, inventory management) remain as defined in GDD-v1 Sections 6-7.

---

## 2. Player Fantasy

"The player feels like they just found something with a name good enough to screenshot when a 'Slightly Bent Chrono-Blade of Adequate Menace' drops, because the name is funny, the stats are real, and the rarity color makes it feel like an actual event."

This serves the **Primary Fantasy** (discovery and surprise in the loot feed) and the **Secondary Fantasy** (evaluating whether this item improves the build).

---

## 3. Detailed Rules

### 3.1 Base Item System (unchanged from GDD-v1)

All rarity tiers, equipment slots, drop rates, LCK adjustments, stat generation, power scores, inventory management, auto-equip, and auto-sell remain as defined in GDD-v1 Sections 6-7. Key reference:

- 6 rarity tiers: Common (60%), Uncommon (25%), Rare (10%), Epic (4%), Legendary (0.9%), Mythic (0.1%)
- 7 equipment slots: Head, Chest, Legs, Weapon, Off-hand, Accessory 1, Accessory 2
- Drop rate: 25% per kill (100% from bosses, Rare+ floor)
- Auto-equip by power_score comparison; auto-sell at inventory cap

### 3.2 Item Name Generation

Every item has a generated name built from templates. The naming system produces names that are:
- **Functional first** (the player can tell what the item is and roughly how good it is from the name)
- **Funny second** (personality emerges from adjective/suffix combinations, not from the base structure)
- **Tone Guide compliant** ("Sword of Adequate Sharpness (+3, occasionally +4 when it feels like it)" -- crafted, not "lol random")

**Name Structure:**

```
[Prefix] [Material] [Base Type] [of Suffix]
```

- **Prefix:** Rarity-scaled adjective. Common items get mundane prefixes. Mythic items get absurd-but-impressive prefixes.
- **Material:** Zone-themed material. Each zone/act has a material pool.
- **Base Type:** Slot-specific item type (Sword, Helm, Cloak, etc.).
- **of Suffix:** Stat-themed descriptor. Derives from the item's primary stat bonus.

**Not all components are always present.** Name complexity scales with rarity:

| Rarity | Name Components | Example |
|--------|----------------|---------|
| Common | [Base Type] | "Iron Sword" |
| Uncommon | [Prefix] [Base Type] | "Dented Iron Sword" |
| Rare | [Prefix] [Material] [Base Type] | "Serviceable Chrono-Steel Sword" |
| Epic | [Prefix] [Material] [Base Type] of [Suffix] | "Polished Chrono-Steel Sword of Surprising Sharpness" |
| Legendary | [Prefix] [Material] [Base Type] of [Suffix] | "Immaculate Temporal Blade of Relentless Cleaving" |
| Mythic | Unique name + title | "Gerald's Retirement Plan, Chrono-Blade of the Final Queue" |

### 3.3 Name Component Pools

**Prefix Pools (by Rarity):**

Each pool is selected via weighted random. Pools are designed to scale in tone: Common prefixes are mundane and bureaucratic; each tier escalates toward the genuinely impressive (but always grounded in the game's voice).

**Common** (32 entries):
Rusty, Worn, Basic, Plain, Standard-Issue, Unremarkable, Forgettable, Adequate, Ordinary, Nondescript, Secondhand, Budget, Off-Brand, Surplus, Weathered, Faded, Dull, Modest, Regulation-Compliant, Entry-Level, Municipal, Third-Party, Baseline, Unassuming, Neglected, Requisitioned, Provisional, Utilitarian, Mass-Produced, Departmental, Unimpressive, Vaguely Functional

**Uncommon** (32 entries):
Dented, Sturdy, Decent, Serviceable, Slightly Used, Refurbished, Passable, Competent, Respectable, Above-Minimum, Nearly New, Presentable, Reasonably Maintained, Properly Filed, Reinforced, Approved, Functional, Adequate-Plus, Semi-Polished, Well-Enough-Made, Regulation-Exceeding, Updated, Moderately Impressive, Better-Than-Expected, Certifiable, Inspected, Pre-Owned, Practical, Workmanlike, Notarized, Tolerable, Genuine

**Rare** (31 entries):
Fine, Polished, Well-Forged, Reliable, Surprisingly Good, Above Average, Commendable, Noteworthy, Distinguished, Precision-Crafted, Exemplary, Meticulous, Sharp, Tempered, Thoroughbred, Select, Premium, Purposeful, Certified Excellent, Envied, Handsome, Tasteful, Deliberate, Honed, High-Grade, Quality-Assured, Refined, Coveted, Impressive, Well-Regarded, Properly Made

**Epic** (31 entries):
Masterwork, Gleaming, Formidable, Exceptional, Suspiciously Nice, Flawless, Devastating, Pristine, Awe-Inspiring, Peerless, Preposterous, Alarming, Unwarranted, Obscenely Well-Made, Unnecessarily Elegant, Uncomfortably Perfect, Terrifyingly Competent, Disturbingly Good, Overwrought, Unreasonably Fine, Absurdly Precise, Inexplicably Gorgeous, Improbably Lethal, Ludicrously Detailed, Ruthlessly Crafted, Aggressively Polished, Excessively Magnificent, Implausibly Well-Balanced, Gratuitously Ornate, Offensively Beautiful, Ominously Flawless

**Legendary** (31 entries):
Immaculate, Resplendent, Terrifying, Magnificent, Impossibly Sharp, World-Class, Apocalyptic, Incandescent, Unfathomable, Sublime, Cataclysmic, Perfected, Radiant, Transcendent, Epoch-Defining, Catastrophically Beautiful, Ruinously Elegant, Mercilessly Forged, Devastatingly Precise, Hauntingly Perfect, Preposterously Magnificent, Unfairly Effective, Monstrously Well-Made, Absurdly Resplendent, Tragically Beautiful, Disturbingly Immaculate, Outrageously Lethal, Bewilderingly Ornate, Unconscionably Fine, Rapturously Crafted, Unreasonably Majestic

**Mythic:** (Mythic items use unique names -- see Mythic Naming below)

**Material Pools (by Act/Zone Theme):**

Materials work as adjectives before a base type (e.g., "Laminated Sword", "Overtime Axe"). Each act's pool evokes its thematic identity.

**Act 1 — Bureaucratic / Queue** (17 entries):
Iron, Paper-Thin, Stamped, Clipboard, Regulation, Filing-Cabinet, Laminated, Rubber-Stamped, Triplicate, Memo-Grade, Notarized, Ledger-Bound, Carbon-Copy, Requisition, Waiting-Room, Red-Tape, Manila

**Act 2 — Temporal / Chrono** (18 entries):
Chrono-Steel, Temporal, Clockwork, Hourglass, Paradox, Schedule-Bound, Pendulum, Epoch-Forged, Sundial, Overtime, Timeslip, Calibrated, Deadline, Time-Stamped, Minute-Hand, Retrograde, Recursive, Meridian

**Act 3+:** (defined per act — expands with content)

**Base Type Pools (by Slot):**

| Slot | Base Types |
|------|-----------|
| Head | Helmet, Hood, Crown, Cap, Visor, Headband |
| Chest | Armor, Robes, Jacket, Vest, Tunic, Breastplate |
| Legs | Greaves, Pants, Boots, Leggings, Sabatons, Shin Guards |
| Weapon (physical) | Sword, Axe, Mace, Dagger, Halberd, Fist Wraps |
| Weapon (magical) | Staff, Wand, Tome, Orb, Scepter, Focus |
| Off-hand | Shield, Buckler, Parrying Dagger, Focus, Ward, Trinket |
| Accessory | Ring, Amulet, Charm, Brooch, Pendant, Badge |

**Suffix Pools (by Primary Stat):**

Suffixes appear on Epic+ items — the most memorable drops. Each stat has 15 entries. Suffixes use dry, euphemistic humor that implies the stat's effect without breaking character.

**STR** (15 entries):
of Brute Force, of Hitting Things, of Adequate Menace, of Unreasonable Strength, of the Heavy Hand, of Blunt Opinions, of the Clenched Fist, of Settling Arguments, of Excessive Force, of Structural Rearrangement, of the Short Conversation, of Percussive Maintenance, of the Final Word, of Applied Leverage, of the Firm Handshake

**INT** (15 entries):
of Mild Enlightenment, of Knowing Better, of Unsolicited Wisdom, of the Overthinking, of Arcane Competence, of Pedantic Precision, of the Raised Eyebrow, of Quiet Superiority, of the Correct Answer, of Technical Accuracy, of Uncomfortable Insight, of the Fine Print, of Better Judgment, of Measured Condescension, of the Long Explanation

**VIT** (15 entries):
of Endurance, of Stubbornness, of Refusing to Die, of Suspicious Resilience, of the Immovable, of Spite-Fueled Survival, of the Long Shift, of Persistent Inconvenience, of Outlasting the Problem, of Sheer Obstinacy, of Not Going Anywhere, of the Thankless Vigil, of Unreasonable Durability, of Waiting It Out, of the Unimpressed

**SPD** (15 entries):
of Haste, of the Impatient, of Queue Skipping, of Unwelcome Urgency, of Getting There Faster, of the Early Arrival, of Cutting Corners, of the Quick Exit, of Unscheduled Departure, of the Running Start, of Premature Optimization, of the Short Route, of Being Elsewhere, of the Hasty Conclusion, of Skipped Formalities

**LCK** (15 entries):
of Finding Things, of Suspicious Fortune, of the Golden Touch, of Unlikely Outcomes, of the Blessed Rummager, of Convenient Timing, of the Happy Accident, of Implausible Coincidence, of the Right Place, of Unearned Success, of the Loaded Die, of Fortuitous Circumstances, of the Second Chance, of the Windfall, of Falling Upward

### 3.4 Mythic Item Naming

Mythic items (0.1% drop rate) get unique, hand-crafted-feeling names. Because Mythic drops are so rare, each one should feel like a discovery.

**Mythic Name Structure:** `[Unique Name], [Title]`

Mythic names are generated from a curated pool per slot category (Weapon, Armor, Off-hand, Accessory). Pre-prod target: 15+ per category. Launch target: 50 per category. Each name is used only once per character (if a duplicate would generate, reroll).

**Mythic Name Pool — Weapons** (16 entries):

| Name | Flavor |
|------|--------|
| "Gerald's Retirement Plan, Chrono-Blade of the Final Queue" | A sword that's been waiting longer than anyone. |
| "The Penultimate Argument, Temporal Axe of Settled Disputes" | For when words have failed and patience has expired. |
| "Bureaucracy's Bane, Paper-Cutter of a Thousand Forms" | Cuts through red tape. Also: other things. |
| "The Overdue Notice, Staff of Accumulated Interest" | The longer you wait, the worse it gets. For them. |
| "Form 27-B/6, Dagger of Required Documentation" | Do you have one? ...You do now. |
| "The Quarterly Review, Mace of Performance Metrics" | Your performance has been noted. So has your skull. |
| "The Exit Interview, Halberd of Involuntary Transition" | This concludes your time with us. |
| "The Minutes of the Last Meeting, Tome of Binding Resolutions" | No one read them. Everyone is bound by them. |
| "Patience Weaponized, Wand of Accumulated Frustration" | Years of waiting, concentrated into a point. |
| "The Suggestion Box, Fist Wraps of Constructive Feedback" | Your input has been received. |
| "The Final Revision, Orb of Accepted Changes" | Track changes: all accepted. No survivors. |
| "Yesterday's Edge, Sword of the Missed Deadline" | It was due last Tuesday. It arrived now. Violently. |
| "The Arbitrator, Scepter of Non-Negotiable Terms" | This is not a discussion. |
| "Clocking Out, Axe of the End of Shift" | It's quitting time. For everyone in range. |
| "The Memorandum, Staff of Official Record" | Per my previous correspondence. Per this staff. |
| "Ticket Number Zero, Focus of First Priority" | Someone was first in line. This is what they found. |

**Mythic Name Pool — Armor (Head, Chest, Legs)** (15 entries):

| Name | Flavor |
|------|--------|
| "The Middle Manager's Aegis, Breastplate of Delegation" | Damage is someone else's problem. |
| "Patience Incarnate, Helm of the Eternal Wait" | You've been here so long the helmet grew. |
| "The Benefits Package, Greaves of Comprehensive Coverage" | Covers legs, ankles, and dental. |
| "The Org Chart, Helm of Hierarchical Protection" | Damage flows downward. |
| "The Safety Briefing, Breastplate of Required Compliance" | You were warned. This is proof. |
| "Terms and Conditions, Leggings of the Unread Agreement" | By wearing these, you agree to everything. |
| "The Open-Plan Office, Helm of Involuntary Awareness" | You can hear everything. Everything can hear you. |
| "The Tenure Shield, Breastplate of Untouchable Mediocrity" | Can't be fired. Can't be harmed. Won't be moved. |
| "The Standing Desk, Greaves of Enforced Ergonomics" | You will stand. You will endure. Your posture will improve. |
| "The Corner Office, Crown of Earned Seclusion" | The view is excellent. The walls are thick. |
| "The Non-Disclosure, Vest of Classified Protection" | What's under here is on a need-to-know basis. |
| "The Pension Plan, Breastplate of Long-Term Security" | You'll get there eventually. It'll be worth it. |
| "The Morning Commute, Boots of Unavoidable Routine" | Same path. Every day. Unstoppable. |
| "The Team-Building Exercise, Jacket of Forced Camaraderie" | You will bond. Resistance is futile. |
| "The Two-Week Notice, Hood of the Inevitable Departure" | Everyone knows it's coming. No one can stop it. |

**Mythic Name Pool — Off-hand** (15 entries):

| Name | Flavor |
|------|--------|
| "The Talking Points, Shield of Prepared Responses" | Every objection has been anticipated. |
| "The Emergency Meeting, Buckler of Sudden Priority" | Everything else can wait. This can't. |
| "The Risk Assessment, Ward of Calculated Outcomes" | The risks were assessed. They were found acceptable. |
| "The Action Items, Focus of Distributed Responsibility" | Someone will do something about this. Probably. |
| "The Approval Chain, Shield of Sequential Authorization" | You can't get through unless everyone signs off. |
| "The Placeholder, Buckler of Temporary Permanence" | It was supposed to be replaced. It never was. |
| "The Escalation Path, Parrying Dagger of Higher Authority" | You thought this was settled. It has been escalated. |
| "The Rubber Stamp, Trinket of Unquestioned Approval" | Approved. Without reading. As is tradition. |
| "The Backup Plan, Shield of Contingent Optimism" | In case everything goes as expected: it won't. |
| "The Reply-All, Ward of Indiscriminate Coverage" | Everyone is protected. Everyone is also informed. |
| "The Fine Print, Parrying Dagger of Hidden Clauses" | You agreed to this. Page 47, subsection C. |
| "The Inbox Zero, Focus of Impossible Completion" | Empty. For now. It won't last. |
| "The Conference Call, Buckler of Distant Protection" | You're here, but also somehow not here. |
| "The Policy Manual, Shield of Precedent" | This has happened before. The response is documented. |
| "The Out-of-Office, Ward of Sanctioned Absence" | Currently unavailable. Damage redirected. |

**Mythic Name Pool — Accessory** (15 entries):

| Name | Flavor |
|------|--------|
| "The Employee of the Month, Badge of Modest Distinction" | One month. That's all they promised. |
| "The Networking Event, Charm of Mutual Benefit" | Everyone here wants something. You want something more. |
| "The Severance Package, Pendant of Comfortable Endings" | Generous, considering. |
| "The NDA, Ring of What You Didn't See" | You saw nothing. Officially. |
| "The Corner Desk, Brooch of Territorial Claim" | This space is yours. You earned it. Guard it. |
| "The Performance Review, Amulet of Annual Judgment" | Your contributions have been measured. Results pending. |
| "The Lanyard, Badge of Verified Existence" | Proof that you are here. Proof that you belong. Proof. |
| "The Golden Parachute, Pendant of Executive Survival" | Falls from any height. Lands comfortably. |
| "The Coffee Mug, Charm of Reliable Sustenance" | Says 'World's Best Adventurer.' Never been washed. |
| "The Business Card, Brooch of Professional Identity" | Embossed. Off-white. Tasteful thickness. |
| "The Overtime Slip, Ring of Accumulated Hours" | The hours add up. So does whatever this ring does. |
| "The Promotion, Amulet of Upward Mobility" | New title. New responsibilities. Same desk. |
| "The PTO Balance, Charm of Hoarded Freedom" | 347 hours banked. You'll use them. Someday. |
| "The Retirement Clock, Pendant of Countdown" | Ticks toward something. Not faster. Not slower. Just toward. |
| "The Reference Letter, Badge of Past Accomplishments" | 'A dedicated professional.' We've all seen the template. |

### 3.5 Flavor Text

Items of Rare rarity and above include a one-line flavor text below the stat block. Flavor text is generated from templates per rarity tier and slot.

**Flavor Text Rules:**
- Maximum 80 characters.
- Tone: dry, observational, rewards re-reading (per Tone Guide writing principles).
- No explaining the joke. No "get it?" moments.
- Functional items (Common/Uncommon) do NOT have flavor text. They're just items.

**Flavor Text Pools:**

All entries are max 80 characters. Tone: dry, observational, rewards re-reading. No explaining the joke.

*Weapon flavor (27 entries):*
- "Has been sharpened exactly the recommended number of times."
- "Previous owner's name has been carefully scratched out."
- "The blade hums a tune it won't teach you."
- "Effective against most things. Decorative against the rest."
- "Comes with a warranty that has already expired."
- "Technically classified as a conversation-ender."
- "The balance is perfect. The smell is not."
- "Won an award once. The plaque was lost."
- "Points in the direction of the problem."
- "The manufacturer denies all knowledge of this item."
- "Handle with care. Or don't. It's not picky."
- "Last serviced on a date that hasn't happened yet."
- "Makes a sound when swung that experts call 'foreboding.'"
- "The edge remembers everyone it has met."
- "Certified for use in up to three dimensions."
- "Not recommended for formal occasions."
- "The instruction manual is in a language that doesn't exist."
- "Emits a faint sigh when drawn from the sheath."
- "Previous owner achieved retirement. Involuntarily."
- "It's not what you wanted. It's what was left."
- "Performs best when the wielder has low expectations."
- "The enchantment is intact. The return policy is not."
- "Slightly warm to the touch. No one can explain why."
- "Will not start a fight. Finishes them reliably."
- "The inscription reads: 'This end toward enemy.'"
- "Banned in two kingdoms and one particularly strict tavern."
- "The pommel unscrews but everyone agrees you shouldn't."

*Armor flavor (27 entries):*
- "Fits surprisingly well for something found on the ground."
- "The dents are cosmetic. Probably."
- "Warm in winter. Regrettable in summer."
- "Previously worn by someone who no longer needed it."
- "Smells faintly of determination and poor decisions."
- "One size fits most. 'Most' is doing heavy lifting here."
- "The previous owner left in a hurry. And without this."
- "Provides protection and a false sense of security."
- "The bloodstains have been professionally addressed."
- "Looks better from a distance. Works better up close."
- "Rated for impacts up to 'considerable.'"
- "The straps are new. Everything else is a conversation."
- "Comes pre-dented for that seasoned veteran look."
- "Certified to withstand at least one regret."
- "The inner lining was added by someone who cared."
- "Heavier than expected. Better than nothing."
- "The padding has opinions about your posture."
- "Discontinued by the manufacturer. Still works, though."
- "Slightly haunted. Not enough to mention on the listing."
- "The polish hides most of the history."
- "Worn in all the right places and several wrong ones."
- "Keeps rain out. Keeps regret in."
- "The sizing chart was optimistic."
- "Suspiciously comfortable for something made of metal."
- "Found in a barrel. Don't ask which barrel."
- "The enchantment adds protection. The color adds nothing."
- "Whoever made this expected the worst. Good instincts."

*Accessory flavor (27 entries):*
- "Glows when you're near danger. Also near breakfast."
- "The previous owner said it was lucky. We found it next to them."
- "Hums at a frequency only the optimistic can hear."
- "Inscription reads: 'If found, keep.'"
- "Does what it says. Says very little."
- "Warm to the touch. Cold to the touch. Pick one and commit."
- "The gem is either enchanted or just very enthusiastic."
- "Tingles when something important is about to not happen."
- "The appraiser squinted at it for a long time and said 'sure.'"
- "Claims to grant wishes. Has not been tested thoroughly."
- "The clasp works on the third try. Every time."
- "Complements any outfit. Compliments none."
- "Emits confidence. Or radiation. Hard to tell the difference."
- "The previous owner swore by it. Then swore at it."
- "Attunes to its wearer within minutes. Judges within seconds."
- "The gem changes color with your mood. It's always concerned."
- "One of a kind. Several of them exist."
- "The chain is decorative. The power is not."
- "Found at the bottom of a well. Probably unrelated to the wish."
- "Functions as intended. Intended function unclear."
- "Made from something rare. 'Something' is the official term."
- "Reacts to magic, sudden movements, and loud noises."
- "The setting is exquisite. The stone is trying its best."
- "Grants the wearer a faint sense of importance."
- "Previously classified. Now merely suspicious."
- "The engraving says 'prototype.' The prototype works."
- "Detects lies. Has trust issues."

**Flavor Text Selection:**
- Each item rolls randomly from the slot-appropriate flavor pool.
- Recency protection: same flavor text cannot appear on two consecutive items of the same slot.
- Mythic items have dedicated flavor text included in their curated name entries (not random).

### 3.6 Item Proc Effects (Epic+ Rarity)

Items of Epic rarity or above can roll a proc effect -- a chance-based combat modifier triggered by combat events. This connects the item system to the status effect system defined in the Combat System Spec.

**Proc Effect Availability:**

| Rarity | Proc Chance on Generation | Notes |
|--------|--------------------------|-------|
| Common | 0% | Never has procs |
| Uncommon | 0% | Never has procs |
| Rare | 0% | Never has procs |
| Epic | 30% | ~1 in 3 Epic items has a proc |
| Legendary | 60% | More than half |
| Mythic | 100% | Always has a proc |

**Proc Effect Pool:**

| Proc | Trigger | Effect | Proc Rate (per trigger) | Classification |
|------|---------|--------|------------------------|----------------|
| Ignite | On player attack | Apply Burning to enemy | 8% | Offensive |
| Frostbite | On player attack | Apply Chilled to enemy | 8% | Offensive |
| Inspiration | On player crit | Apply Inspired to player | 15% | Offensive |
| Haste Proc | On player crit | Apply Haste to player | 12% | Offensive |
| Hexbane | On taking damage | Apply Cursed to attacker | 10% | Defensive |
| Lifesteal | On player attack | Heal player for 10% of damage dealt | 12% | Defensive |
| Reflect | On taking damage | Return 15% of damage taken to attacker | 10% | Defensive |

**Proc Selection:**
- When an item generates with a proc, roll from the proc pool using slot-based weighting.
- Weapons prefer offensive procs (Ignite, Frostbite, Inspiration, Haste Proc): 70% weight. Defensive procs (Hexbane, Lifesteal, Reflect): 30% weight.
- Armor prefers defensive procs (Hexbane, Lifesteal, Reflect): 70% weight. Offensive procs (Ignite, Frostbite, Inspiration, Haste Proc): 30% weight.
- Accessories are uniform across all 7 procs.

**Proc Display:**
- Items with procs show the proc as an additional line in the item tooltip:
  - "Proc: 8% chance on hit to Ignite enemy (3 ticks)"
  - "Proc: 12% chance on crit to gain Haste (4 ticks)"
  - "Proc: 10% chance when hit to Reflect 15% damage"
- The proc name and effect are clearly stated. No hidden mechanics.

---

## 4. Formulas

### 4.1 Base Item Formulas (unchanged from GDD-v1)

See GDD-v1 Sections 6.4 and 7.4. Key reference:
- `stat_value = floor(zone_level * 2 * rarity_multiplier * (1 + random(-0.10, 0.10)))`
- `power_score = sum_of_all_stat_bonuses * RARITY_POWER_FACTOR`
- `sell_price = floor(power_score * SELL_MULTIPLIER)`

### 4.2 Name Generation

```
prefix = weighted_random(prefix_pool[rarity])
material = random(material_pool[act])
base_type = random(base_type_pool[slot])
suffix = random(suffix_pool[primary_stat])

if rarity == Common: name = "{material} {base_type}"
if rarity == Uncommon: name = "{prefix} {material} {base_type}"
if rarity == Rare: name = "{prefix} {material} {base_type}"
if rarity == Epic: name = "{prefix} {material} {base_type} {suffix}"
if rarity == Legendary: name = "{prefix} {material} {base_type} {suffix}"
if rarity == Mythic: name = mythic_pool[slot].pop_unique()
```

**Worked example (Epic Physical Weapon, Zone 2-2, primary stat STR):**
- prefix = "Formidable" (from Epic pool)
- material = "Chrono-Steel" (from Act 2 pool)
- base_type = "Axe" (from weapon physical pool)
- suffix = "of Hitting Things" (from STR suffix pool)
- **Result: "Formidable Chrono-Steel Axe of Hitting Things"**

**Worked example (Common Head, Zone 1-1):**
- material = "Iron" (from Act 1 pool)
- base_type = "Helmet" (from head pool)
- **Result: "Iron Helmet"**

**Worked example (Rare Accessory, Zone 1-3, primary stat LCK):**
- prefix = "Surprisingly Good" (from Rare pool)
- material = "Stamped" (from Act 1 pool)
- base_type = "Ring" (from accessory pool)
- **Result: "Surprisingly Good Stamped Ring"** (Rare items don't get suffixes)

### 4.3 Flavor Text Assignment

```
if rarity >= Rare AND rarity < Mythic:
    flavor_pool = flavor_templates[slot_category]
    available = flavor_pool.filter(f => f.id != last_flavor_id[slot_category])
    flavor_text = random(available)
    last_flavor_id[slot_category] = flavor_text.id
else if rarity == Mythic:
    flavor_text = mythic_entry.flavor
else:
    flavor_text = null
```

### 4.4 Proc Effect Roll

```
proc_roll = random(0, 1)
has_proc = proc_roll < PROC_CHANCE[rarity]

if has_proc:
    if slot == "weapon":
        proc = weighted_random(offensive_procs: 70%, defensive_procs: 30%)
    else if slot in ["head", "chest", "legs"]:
        proc = weighted_random(offensive_procs: 30%, defensive_procs: 70%)
    else:
        proc = uniform_random(all_procs)
```

| Constant | Value |
|----------|-------|
| PROC_CHANCE_EPIC | 0.30 |
| PROC_CHANCE_LEGENDARY | 0.60 |
| PROC_CHANCE_MYTHIC | 1.00 |

**Worked example (Epic Weapon):**
- proc_roll = 0.22 (< 0.30, has proc)
- Weapon favors offensive: 70% chance of [Ignite, Frostbite, Inspiration, Haste Proc], 30% chance of [Hexbane, Lifesteal, Reflect]
- Roll: Ignite
- **Result: item has "8% chance on hit to Ignite enemy"**

**Worked example (Legendary Chest Armor):**
- proc_roll = 0.45 (< 0.60, has proc)
- Armor favors defensive: 70% chance of [Hexbane, Lifesteal, Reflect], 30% chance of [Ignite, Frostbite, Inspiration, Haste Proc]
- Roll: Reflect
- **Result: item has "10% chance when hit to Reflect 15% damage"**

### 4.5 Reflect Damage

```
reflect_damage = floor(damage_taken * REFLECT_PERCENT / 100)
```

| Constant | Value |
|----------|-------|
| REFLECT_PERCENT | 15 |

**Worked example (Player takes 31 damage from Overtime Ogre, Reflect triggers):**
- reflect_damage = floor(31 * 0.15) = floor(4.65) = 4
- The ogre takes 4 damage back. Not enough to kill, but it adds up over a fight.
- Over a 7-tick fight with 10% proc rate: expected ~0.7 triggers, ~2.8 reflected damage. A small but satisfying bonus.

**Reflect does NOT trigger other on-hit effects.** Reflected damage is a separate damage event that cannot proc Burning, cannot crit, and cannot trigger the enemy's own on-hit abilities. This prevents infinite reflect loops.

---

## 5. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Name generation produces a duplicate of an item already in inventory | Allowed. Items can have identical names but different stats. Power_score and stats differentiate them. |
| Mythic name pool exhausted for a slot | If all ~50 unique Mythic names for a slot have been used, wrap around and allow duplicates with a " II", " III" suffix. |
| Flavor text pool exhausted | Clear recency protection and allow repeats. Pool has 27 entries per slot category, so this is unlikely. |
| Proc effect on a weapon that player doesn't use for combat | Proc only triggers when the item is equipped in the weapon slot. Off-hand procs trigger on "taking damage" events, not attacks. |
| Two equipped items both have procs | Both proc independently each tick. A weapon with Ignite and armor with Reflect both roll separately. |
| Proc triggers effect but max active effects (2) reached | Oldest effect is replaced per Combat System Spec rules. |
| Item has proc + milestone ability proc on same tick | Both resolve independently. Order: milestone ability proc resolves first, then item proc. |
| Auto-equip compares items with procs | Power_score comparison ignores procs. Procs are a bonus, not factored into auto-equip decisions. This means auto-equip might replace a proc item with a higher-stat non-proc item. Intentional: manual curation is the Engaged player's advantage. |
| Reflect triggers when player takes DOT | Yes. Burning ticks on the player can trigger Reflect if the player has a Reflect proc equipped. Each burn tick is a "taking damage" event. The reflected damage targets the effect's source enemy. |
| Reflect would kill the enemy | Reflected damage can kill. If reflect_damage reduces enemy HP to 0, VICTORY triggers normally. |
| Haste Proc triggers but player already Hasted | Duration refreshes per status effect stacking rules. Speed bonus does not stack. |
| Offline simulation with proc items | Offline uses expected value of procs (e.g., 8% Ignite = 0.08 * burn_damage added to average damage, 10% Reflect = 0.10 * 0.15 * avg_damage_taken as bonus damage). Simplified but conservative. |
| Item name exceeds display width | Truncate at 60 characters with "..." for UI display. Full name visible in tooltip/detail view. |

---

## 6. Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Item | <-- | Combat | Enemy kills trigger drop rolls |
| Item | --> | Combat | Equipped items provide weapon_power, stat bonuses, and proc effects |
| Item | --> | Combat (Status Effects) | Item procs apply status effects during combat |
| Item | <-- | Progression | Player level determines zone, which determines item stat ranges |
| Item | <-- | Character Creation | LCK stat affects rarity distribution |
| Item | --> | Inventory | Dropped items enter inventory for auto-equip/auto-sell |
| Item | <-- | First 2 Acts | Zone level and act theme determine item stats and material names |
| Item (naming) | <-- | Tone Guide | All names, prefixes, suffixes, and flavor text comply with voice guidelines |
| Item (procs) | --> | Combat (Status Effects) | Procs are a source of status effect application (Burning, Chilled, Inspired, Haste) |
| Item (procs) | --> | Combat (Damage) | Reflect proc deals direct damage back to attacker (no status effect involved) |

---

## 7. Tuning Knobs

### Base Item (unchanged from GDD-v1)

| Parameter | Default | Safe Range | Category |
|-----------|---------|------------|----------|
| `ITEM_DROP_CHANCE` | 0.25 | 0.10-0.50 | **feel** |
| `LCK_RARITY_BONUS` | 0.01 | 0.005-0.03 | **curve** |
| `ITEM_STAT_PER_LEVEL` | 2 | 1-4 | **curve** |
| `ITEM_VARIANCE` | 0.10 | 0.05-0.25 | **feel** |
| `INVENTORY_MAX_SLOTS` | 50 | 20-100 | **gate** |

### Naming (new)

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `NAME_MAX_DISPLAY_LENGTH` | 60 | 40-80 | **feel** | Characters before truncation in UI |
| `FLAVOR_TEXT_MAX_LENGTH` | 80 | 60-120 | **feel** | Characters per flavor text line |
| `MYTHIC_UNIQUE_POOL_SIZE` | 50 | 15-100 | **gate** | Unique names per slot category for Mythic items (pre-prod: 15+) |

### Proc Effects (new)

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `PROC_CHANCE_EPIC` | 0.30 | 0.15-0.50 | **feel** | Chance an Epic item generates with a proc |
| `PROC_CHANCE_LEGENDARY` | 0.60 | 0.40-0.80 | **feel** | Chance a Legendary item has a proc |
| `PROC_CHANCE_MYTHIC` | 1.00 | 1.00 | **gate** | Mythic always has a proc. Not tunable. |
| `IGNITE_PROC_RATE` | 0.08 | 0.03-0.15 | **feel** | Per-attack chance to apply Burning |
| `FROSTBITE_PROC_RATE` | 0.08 | 0.03-0.15 | **feel** | Per-attack chance to apply Chilled |
| `INSPIRATION_PROC_RATE` | 0.15 | 0.05-0.25 | **feel** | Per-crit chance to apply Inspired |
| `HEXBANE_PROC_RATE` | 0.10 | 0.05-0.20 | **feel** | Per-hit-taken chance to Curse attacker |
| `LIFESTEAL_PROC_RATE` | 0.12 | 0.05-0.20 | **feel** | Per-attack chance to heal 10% of damage |
| `LIFESTEAL_PERCENT` | 10 | 5-25 | **curve** | % of damage healed on Lifesteal proc |
| `HASTE_PROC_RATE` | 0.12 | 0.05-0.20 | **feel** | Per-crit chance to apply Haste to player |
| `REFLECT_PROC_RATE` | 0.10 | 0.05-0.20 | **feel** | Per-hit-taken chance to reflect damage |
| `REFLECT_PERCENT` | 15 | 5-30 | **curve** | % of damage taken reflected to attacker |

---

## 8. Acceptance Criteria

### Base Item (unchanged from GDD-v1)

See GDD-v1 Section 6.8 (IT-01 through IT-07) and 7.8 (IN-01 through IN-07). All still apply.

### Naming (new)

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| IT-10 | Common items have correct name structure | Common item in Zone 1-1 generates name like "Iron Sword" (material + base type, no prefix/suffix) |
| IT-11 | Epic items have full name structure | Epic item generates name with prefix + material + base type + suffix |
| IT-12 | Mythic items have unique names | Two Mythic weapons generated for the same character have different names |
| IT-13 | Name length within bounds | No generated name exceeds 60 characters before truncation |
| IT-14 | Material matches act theme | Item dropped in Act 2 uses Act 2 material pool (Chrono-Steel, Temporal, etc.), not Act 1 |
| IT-15 | Suffix matches primary stat | Item with STR as primary stat uses STR suffix pool ("of Brute Force", etc.) |

### Flavor Text (new)

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| IT-16 | Rare+ items have flavor text | All items with rarity >= Rare (except Mythic, which has dedicated flavor) include a flavor text line |
| IT-17 | Common/Uncommon items lack flavor text | Items below Rare rarity have no flavor text field |
| IT-18 | Flavor text within length limit | No flavor text exceeds 80 characters |
| IT-19 | Recency protection works | Two consecutive Rare items of the same slot have different flavor text |

### Proc Effects (new)

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| IT-20 | Epic proc chance matches config | Over 1000 generated Epic items, 30% +/- 5% have a proc effect |
| IT-21 | Mythic always has proc | 100 generated Mythic items all have proc effects |
| IT-22 | Weapon procs favor offensive | Over 1000 weapon procs, ~70% are offensive (Ignite/Frostbite/Inspiration/Haste Proc) |
| IT-23 | Proc fires at correct rate | Ignite proc (8%) fires 8% +/- 2% over 1000 attack ticks |
| IT-24 | Proc applies status effect | Ignite proc triggers Burning on enemy per Combat System Spec rules |
| IT-25 | Auto-equip ignores procs | Item with power_score 20 + proc is not auto-equipped over item with power_score 25 + no proc |
| IT-26 | Haste Proc fires at correct rate | Haste Proc (12%) fires 12% +/- 3% over 1000 player crit events |
| IT-27 | Haste Proc applies Haste | Haste Proc triggers Haste on player per Combat System Spec rules (25% speed boost, 4 ticks) |
| IT-28 | Reflect fires at correct rate | Reflect (10%) fires 10% +/- 2% over 1000 damage-taken events |
| IT-29 | Reflect deals correct damage | Reflect returns floor(damage_taken * 0.15) to attacker. Player takes 31 damage, attacker takes 4 |
| IT-30 | Reflect does not chain | Reflected damage does not trigger procs, crits, or on-hit effects on the enemy |
| IT-31 | Weapon procs include Haste Proc in offensive pool | Over 1000 weapon procs, Haste Proc appears proportionally within the offensive 70% weight |
| IT-32 | Armor procs include Reflect in defensive pool | Over 1000 armor procs, Reflect appears proportionally within the defensive 70% weight |

---

## Design Options for Board Review

### Naming System

**Option A: Template-Based Generation (Recommended, Specified Above)**

Structured `[Prefix] [Material] [Base Type] [of Suffix]` with pools per component.

**Pros:** Consistent quality. Easy to expand (add pools per act). Predictable length. Players can parse item names quickly.
**Cons:** Patterns become recognizable over time. Limited by pool size.

**Option B: AI-Generated Names**

Use a language model to generate unique item names on the fly.

**Pros:** Infinite variety. Every name is unique.
**Cons:** Quality variance. Generation latency. Offline simulation complexity. Tone Guide compliance is probabilistic, not guaranteed. Overkill for MVP.

**Option C: Purely Random Word Combination**

Pull random words from dictionaries and combine them.

**Pros:** Huge variety.
**Cons:** Most combinations are nonsensical. "Turgid Perambulating Sword of Cadastral Resonance" is not funny -- it's gibberish. Violates Tone Guide's craft requirement.

**Recommendation:** Option A. Template-based naming gives us predictable quality, Tone Guide compliance, and easy expansion. We can grow the pools over time. Each pool should have 15-20 entries per category to start, expanded as new acts ship.

### Proc Effects

**Option A: Tier-Gated Procs (Recommended, Specified Above)**

Procs only on Epic+ items. 7 proc types (4 offensive, 3 defensive). Simple, clear, connects to status effect system.

**Pros:** Clean. Players know what to look for (rarity color = potential proc). Connects item excitement to combat variety.
**Cons:** Common-Rare items are stat-only. Less variety in the early game.

**Option B: Procs at All Rarities (lower rates for lower tiers)**

Even Common items have a 1% proc chance. Uncommon 3%, etc.

**Pros:** Surprise factor at all tiers. More early-game variety.
**Cons:** Inflates the number of items players need to evaluate. Auto-equip decisions become more complex. Muddles the rarity tier's meaning.

**Recommendation:** Option A. Reserving procs for Epic+ makes rarity tiers more meaningful and creates a clear "something special happened" moment when an Epic drops. It also keeps the early game simple while introducing procs as a "new thing" when players start finding Epic gear.
