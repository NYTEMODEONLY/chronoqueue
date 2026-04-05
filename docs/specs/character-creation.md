# Character Creation System Specification v1.0

> **GDD Addendum** — Refines Section 4.1 (Character Creation) and Section 4.2 (Progression) of GDD-v1 for implementation readiness.
>
> **Source Task:** VOI-15 | **Parent:** VOI-1 | **Sprint:** S1

---

## 1. Overview

The character creation system is the player's first interaction with ChronoQueue. It establishes class identity, sets initial stat allocation, provides starting equipment, and feeds the player into Zone 1-1 within 30 seconds. This system produces a fully initialized character record that the combat, progression, and item systems consume from tick one.

---

## 2. Player Fantasy

"The player feels like they're **choosing their place in line** when they pick a class because each class represents a fundamentally different approach to waiting — and to fighting through the queue."

- **Chronoknight:** "I can handle anything."
- **Timestomper:** "I'll smash through before they can hit me."
- **Epoch Mage:** "Raw power solves everything."
- **Idlemaster:** "I win by not even trying."
- **Loot Gremlin:** "Every fight is a treasure chest."
- **Unflappable:** "They can't hurt me."

---

## 3. Detailed Rules

### 3.1 Character Creation Flow (State Machine)

```
[START] --> [NAME_INPUT] --> [CLASS_SELECT] --> [STAT_REVIEW] --> [CONFIRM] --> [GAME_START]
                ^                  ^                |
                |                  |                v
                +------------------+--- [BACK pressed]
```

**States:**

| State | Description | Transitions |
|-------|-------------|-------------|
| `NAME_INPUT` | Text field with placeholder "Adventurer". Player enters a name. | `NEXT` -> `CLASS_SELECT` |
| `CLASS_SELECT` | 6 class cards displayed. Player selects one. | `NEXT` -> `STAT_REVIEW`, `BACK` -> `NAME_INPUT` |
| `STAT_REVIEW` | Full stat breakdown, derived stats, starting equipment, class tip. Read-only. | `CONFIRM` -> `GAME_START`, `BACK` -> `CLASS_SELECT` |
| `GAME_START` | Character record created. Player enters Zone 1-1. First encounter after ENCOUNTER_DELAY (1 tick). | Terminal state. |

### 3.2 Name Input Rules

| Rule | Specification |
|------|---------------|
| Valid characters | `A-Z`, `a-z`, `0-9`, space, hyphen (`-`) |
| Regex | `^[A-Za-z0-9 \-]{1,20}$` (applied after trimming) |
| Min length | 1 character (after trimming whitespace) |
| Max length | 20 characters (after trimming whitespace) |
| Empty/whitespace-only | Auto-set to `"Adventurer"` — no error displayed |
| Exceeds max length | Truncate to 20 characters. Display: `"Name cannot exceed 20 characters."` |
| Invalid characters | Strip invalid characters silently. Display: `"Only letters, numbers, spaces, and hyphens are allowed."` |
| Leading/trailing whitespace | Trimmed silently. No error. |
| Consecutive spaces | Collapsed to single space silently. No error. |
| Display | Name is stored as-entered (preserving case). Displayed with original casing everywhere. |

**Error display:** Inline below the text field. Red text. Clears when the input becomes valid.

### 3.3 Class Selection Screen

Each class card displays:

| Element | Source | Visibility |
|---------|--------|------------|
| Class name | `classes[id].name` | Always visible |
| Archetype tag | `classes[id].archetype` | Always visible |
| Stat bar chart | `classes[id].base_stats` (5 bars, scale 1-10) | Always visible |
| 2-sentence description | `classes[id].description` | Always visible |

On selection (tap/click), the card expands or a detail panel shows:

| Element | Source | Visibility |
|---------|--------|------------|
| All 5 stat values | `classes[id].base_stats` | On selection |
| Starting HP | `VIT * HP_PER_VIT` | On selection |
| Tick speed | `BASE_TICK_INTERVAL / (1 + SPD/100)` formatted as `"X.XXs per action"` | On selection |
| Crit chance | `LCK / 200` formatted as `"X.X%"` | On selection |
| Class tip | `classes[id].tip` | On selection |

**NOT shown during class selection:**
- Growth weights (percentages)
- Stat-per-level projections
- Milestone ability trees
- Starting equipment details (shown in Stat Review)

### 3.4 Stat Review Screen

Displays the complete character preview before confirmation:

| Section | Content |
|---------|---------|
| **Header** | Character name + class name + archetype tag |
| **Base Stats** | All 5 stats with numeric values and visual bars |
| **Derived Stats** | Max HP, Tick Speed (seconds), Crit Chance (%) |
| **Starting Equipment** | Weapon name + stats, Armor/accessory name + stats (see Section 3.6) |
| **Class Tip** | One-sentence play style guidance |

**Buttons:** `[Confirm]` (primary), `[Back]` (secondary, returns to CLASS_SELECT preserving selection)

### 3.5 Character Record (Created on Confirm)

On `CONFIRM`, the system creates the following record:

```
character = {
  name: string,                    // validated name
  class_id: string,                // e.g. "chronoknight"
  level: 1,
  xp: 0,
  stats: { STR, INT, VIT, SPD, LCK },  // from class base_stats
  current_hp: VIT * HP_PER_VIT,    // full HP
  max_hp: VIT * HP_PER_VIT,
  gold: 0,
  current_zone: "1-1",
  equipment: {                     // starting equipment (see 3.6)
    weapon: starter_weapon,
    [armor_slot]: starter_armor,
    // all other slots: null
  },
  inventory: [],                   // empty, 50 max slots
  quests: {
    active: [],                    // populated by quest system on zone entry
    completed: []
  },
  milestones: {},                  // empty until level 5
  last_online_timestamp: now(),
  created_at: now()
}
```

### 3.6 Starting Equipment

All starter items are **Common rarity**, unique (non-droppable, non-sellable), and replaced by the first zone drop in that slot. Starter items have a special `"starter"` tag that excludes them from sell calculations and inventory sorting.

| Class | Weapon | Slot | Type | WP | Bonus | Armor/Accessory | Slot | Bonus |
|-------|--------|------|------|----|-------|-----------------|------|-------|
| Chronoknight | Rusty Longsword | weapon | physical | 5 | STR +1 | Worn Chainmail | chest | VIT +2 |
| Timestomper | Cracked Greathammer | weapon | physical | 5 | STR +1 | Ripped Vest | legs | SPD +2 |
| Epoch Mage | Chipped Wand | weapon | magical | 5 | INT +1 | Threadbare Robe | chest | INT +2 |
| Idlemaster | Dull Dagger | weapon | physical | 5 | SPD +1 | Cozy Pajamas | chest | SPD +2 |
| Loot Gremlin | Bent Fork | weapon | physical | 5 | LCK +1 | Lucky Scarf | accessory_1 | LCK +2 |
| Unflappable | Battered Mace | weapon | physical | 5 | STR +1 | Dented Breastplate | chest | VIT +2 |

**Why weapon_power = 5 (not formula-generated):**

Starting weapons are hand-crafted, not generated from the item formula (`zone_level * ITEM_STAT_PER_LEVEL`). At zone level 1, the formula yields weapon_power = 2, which produces `floor(scaling_stat * 2 / 10) = 1` (MIN_DAMAGE) for most classes. This means every enemy in Zone 1-1 (30 HP) takes 30 ticks (90 seconds) to defeat — unacceptable for first-touch UX.

With weapon_power = 5:

| Class | Scaling Stat | Damage/Tick | Ticks to Kill (Zone 1-1, 30 HP) | Time to Kill |
|-------|-------------|-------------|----------------------------------|--------------|
| Chronoknight | STR 7+1=8 | floor(8*5/10) = 4 | ceil(30/4) = 8 | ~23s |
| Timestomper | STR 9+1=10 | floor(10*5/10) = 5 | ceil(30/5) = 6 | ~17s |
| Epoch Mage | INT 9+1=10 | floor(10*5/10) = 5 | ceil(30/5) = 6 | ~17s |
| Idlemaster | STR 4 | floor(4*5/10) = 2 | ceil(30/2) = 15 | ~42s |
| Loot Gremlin | STR 4 | floor(4*5/10) = 2 | ceil(30/2) = 15 | ~43s |
| Unflappable | STR 5+1=6 | floor(6*5/10) = 3 | ceil(30/3) = 10 | ~29s |

Note: Idlemaster and Loot Gremlin have intentionally slower kills. Their class fantasy is efficiency over time (idle) and item quality (luck), not raw damage. First zone drops (weapon_power 2-4) will not improve their kill speed much — their power spike comes from milestone abilities and item rarity scaling.

**Survivability Check at Zone 1-1:**

Zone 1-1 enemy_damage = ceil(2 * 2.0) = 4 per tick.

| Class | HP (with starter armor) | Ticks to Die | Survives Zone 1-1? |
|-------|------------------------|--------------|---------------------|
| Chronoknight | (7+2)*15 = 135 | ceil(135/4) = 34 | Yes (8 ticks to kill, 34 to die) |
| Timestomper | 4*15 = 60 | ceil(60/4) = 15 | Yes (6 to kill, 15 to die) |
| Epoch Mage | (4+2)*15 = 90 | ceil(90/4) = 23 | Yes (6 to kill, 23 to die) |
| Idlemaster | 4*15 = 60 | ceil(60/4) = 15 | Yes (15 to kill, 15 to die — tight) |
| Loot Gremlin | 5*15 = 75 | ceil(75/4) = 19 | Yes (15 to kill, 19 to die) |
| Unflappable | (9+2)*15 = 165 | ceil(165/4) = 42 | Yes (10 to kill, 42 to die) |

The Idlemaster has the tightest margin (15 ticks to kill, 15 ticks to die). This is intentional — the class trades combat strength for idle efficiency. A close call in the first zone communicates "you're fragile, lean into the idle playstyle." The SPD +2 from Cozy Pajamas gives a slight tick speed advantage (2.84s vs 2.80s base) that helps offset this over multiple encounters.

---

## 4. Formulas

### 4.1 Stat at Level N

```
stat(level, starting_stat, class_weight_pct) = starting_stat + floor((level - 1) * STAT_POINTS_PER_LEVEL * class_weight_pct / 100)
```

| Variable | Type | Valid Range |
|----------|------|-------------|
| `level` | integer | [1, 50] |
| `starting_stat` | integer | [2, 9] |
| `class_weight_pct` | integer | [5, 40], must sum to 100 across all 5 stats |
| `STAT_POINTS_PER_LEVEL` | constant | 3 |

**Worked Example — Chronoknight STR at Level 10:**
```
stat(10, 7, 30) = 7 + floor(9 * 3 * 30 / 100) = 7 + floor(8.1) = 7 + 8 = 15
```

**Worked Example — Loot Gremlin LCK at Level 50:**
```
stat(50, 9, 40) = 9 + floor(49 * 3 * 40 / 100) = 9 + floor(58.8) = 9 + 58 = 67
```

### 4.2 XP Required for Next Level

```
xp_to_next_level(n) = floor(BASE_XP * n ^ XP_EXPONENT)
```

| Variable | Type | Value |
|----------|------|-------|
| `BASE_XP` | constant | 50 |
| `XP_EXPONENT` | constant | 1.5 |
| `n` | integer | current level [1, 50] |

**Worked Example — Level 1:**
```
xp_to_next_level(1) = floor(50 * 1^1.5) = 50 XP
```

**Worked Example — Level 25:**
```
xp_to_next_level(25) = floor(50 * 25^1.5) = floor(50 * 125) = 6,250 XP
```

### 4.3 Derived Stats

```
max_hp = VIT * HP_PER_VIT                          // HP_PER_VIT = 15
effective_tick_interval = BASE_TICK_INTERVAL / (1 + SPD / 100)  // BASE_TICK_INTERVAL = 3.0
crit_chance = LCK / CRIT_DIVISOR                   // CRIT_DIVISOR = 200
```

### 4.4 Starting Damage with Starter Weapon

```
scaling_stat = STR + weapon_bonus_STR   (if weapon_type == "physical")
             = INT + weapon_bonus_INT   (if weapon_type == "magical")
damage_per_tick = max(MIN_DAMAGE, floor(scaling_stat * STARTER_WEAPON_POWER / 10))
```

Where `STARTER_WEAPON_POWER = 5` and `MIN_DAMAGE = 1`.

---

## 5. Edge Cases

| # | Edge Case | Exact Behavior |
|---|-----------|----------------|
| 1 | Name is empty string or whitespace-only after trim | Set name to `"Adventurer"`. No error displayed. Proceed normally. |
| 2 | Name contains only hyphens (e.g. `"---"`) | Valid. Store as-is. Unusual but permitted. |
| 3 | Name is exactly 20 characters | Valid. No truncation. |
| 4 | Name is 21+ characters | Truncate to 20. Show inline error. Input field enforces maxlength=20 as a hard cap. |
| 5 | Name contains emoji or unicode | Strip non-matching characters. If result is empty after strip, default to `"Adventurer"`. Show error only if characters were stripped. |
| 6 | Player presses Back from Stat Review | Return to CLASS_SELECT. Previous class selection is preserved (highlighted). Name is preserved. |
| 7 | Player presses Back from Class Select | Return to NAME_INPUT. Previously entered name is preserved in the field. |
| 8 | Player confirms with no class selected | `CONFIRM` button is disabled until a class is selected. Not reachable. |
| 9 | Duplicate character names | Allowed. Names are display-only, not unique identifiers. Character ID is a UUID. |
| 10 | Idlemaster dies in Zone 1-1 | Possible if unlucky (exactly 15 ticks to kill, 15 ticks to die). On defeat: character respawns at same zone with full HP. No XP/gold penalty. No death penalty at Level 1 (first zone grace). |
| 11 | Player creates character and immediately goes offline | Offline system activates. `last_online_timestamp` is set at creation. Next login triggers offline calculation from Zone 1-1 with starting stats. |
| 12 | Starter equipment and inventory full | Starter equipment occupies equipment slots, not inventory. Inventory starts empty (0/50). Not possible to have full inventory at creation. |
| 13 | Starter item sell attempt | Starter items (tagged `"starter"`) cannot be sold or dropped. They can only be replaced by equipping another item in the same slot, at which point the starter item is destroyed (not moved to inventory). |

---

## 6. Dependencies

### This System Depends On:

| System | Dependency | Direction |
|--------|------------|-----------|
| **Progression System** | XP curve formula, level cap, stat growth formula | Character creation initializes level=1 and xp=0; progression system consumes these values |
| **Combat System** | Damage formula, HP formula, tick speed formula | Character creation produces the stats that combat consumes from tick one |
| **Item System** | Equipment slot definitions, item stat structure | Starting equipment must conform to item system schema |

### Other Systems Depend On This:

| System | Dependency | Direction |
|--------|------------|-----------|
| **Combat System** | Needs a valid character record with stats and equipment to calculate damage/HP/speed | Combat cannot start without character creation output |
| **Quest System** | Needs `current_zone` and `level` to generate initial quest pool | First quest generation triggers on Zone 1-1 entry |
| **Idle System** | Needs `last_online_timestamp`, stats, zone, and equipment to calculate offline progress | Idle system is dormant until player's first session ends |
| **Progression System** | Needs `class_id` to look up growth weights for stat gains on level-up | Level-up stat allocation uses class growth weights from this spec |

---

## 7. Tuning Knobs

| Parameter | Current Value | Safe Range | Category | Notes |
|-----------|--------------|------------|----------|-------|
| `STARTING_STAT_BUDGET` | 25 | [20, 30] | **gate** | Changing this requires rebalancing all 6 class stat allocations. Ripples into combat balance at all levels. |
| `STAT_POINTS_PER_LEVEL` | 3 | [2, 5] | **curve** | Higher = faster power growth = shorter content lifespan. 3 produces ~170 total stats at level 50. |
| `STARTER_WEAPON_POWER` | 5 | [3, 8] | **feel** | Directly controls "time to first kill." Below 3, most classes deal MIN_DAMAGE. Above 8, Zone 1 becomes trivial for all classes. |
| `NAME_MAX_LENGTH` | 20 | [10, 30] | **feel** | UI layout concern. Longer names may overflow stat review screen. |
| `NAME_DEFAULT` | "Adventurer" | any string | **feel** | Displayed when name is empty. Should be thematic. |
| Individual class `base_stats` | varies | each stat [1, 12], total must equal budget | **gate** | Changing one class's stats requires re-verifying Zone 1-1 survivability and combat pacing. |
| Individual class `growth_weights` | varies | each [5, 50], must sum to 100 | **curve** | Affects entire power curve. Changes compound over 49 levels — even 5% shift is significant at level 50. |
| Starter armor `bonus_value` | 2 | [0, 4] | **feel** | Affects first-zone survivability margin. At 0, Idlemaster cannot survive Zone 1-1 without luck. |

---

## 8. Acceptance Criteria

### Name Validation

| # | Test | Input | Expected Output | Pass/Fail Criteria |
|---|------|-------|-----------------|-------------------|
| N1 | Valid name | `"TimeKnight"` | Stored as `"TimeKnight"` | Name field == "TimeKnight" |
| N2 | Empty input | `""` | Stored as `"Adventurer"` | Name field == "Adventurer", no error displayed |
| N3 | Whitespace only | `"   "` | Stored as `"Adventurer"` | Name field == "Adventurer", no error displayed |
| N4 | Max length | `"ABCDEFGHIJKLMNOPQRST"` (20 chars) | Stored as-is | Name field length == 20, no error |
| N5 | Over max length | `"ABCDEFGHIJKLMNOPQRSTU"` (21 chars) | Truncated to 20 | Name field == first 20 chars, error message displayed |
| N6 | Invalid characters | `"Hero@#$Name"` | Stripped to `"HeroName"` | Name field == "HeroName", error message displayed |
| N7 | Hyphens and spaces | `"Time-Knight One"` | Stored as `"Time-Knight One"` | Name field == "Time-Knight One", no error |
| N8 | All invalid chars | `"@#$%"` | Stored as `"Adventurer"` | Name field == "Adventurer" |

### Class Selection

| # | Test | Expected | Pass/Fail Criteria |
|---|------|----------|-------------------|
| C1 | All 6 classes displayed | 6 class cards visible | Count of visible class cards == 6 |
| C2 | Each class shows name, archetype, stat bars, description | All 4 elements present per card | Visual inspection of each card element |
| C3 | Selecting a class shows expanded stats | HP, tick speed, crit chance displayed | Values match formula output within 0.1% |
| C4 | Next button disabled without selection | Button is not clickable | Tap/click does nothing |
| C5 | Back button returns to name input | Name field visible with prior value | Name field value == previously entered name |

### Stat Verification

| # | Test | Class | Expected | Pass/Fail Criteria |
|---|------|-------|----------|-------------------|
| S1 | All classes total 25 base stats | All 6 | Sum == 25 | `STR+INT+VIT+SPD+LCK == 25` for each class |
| S2 | All classes growth weights total 100% | All 6 | Sum == 100 | Growth percentages sum to 100 for each class |
| S3 | Chronoknight HP at level 1 | Chronoknight | 105 (7 VIT * 15) | `max_hp == 105` |
| S4 | Timestomper HP at level 1 | Timestomper | 60 (4 VIT * 15) | `max_hp == 60` |
| S5 | Loot Gremlin crit at level 1 | Loot Gremlin | 4.5% (9 LCK / 200) | `crit_chance == 0.045` |
| S6 | Chronoknight STR at level 10 | Chronoknight | 15 | `stat == 7 + floor(9*3*0.30) == 15` |
| S7 | Epoch Mage INT at level 50 | Epoch Mage | 67 | `stat == 9 + floor(49*3*0.40) == 67` |
| S8 | Idlemaster total stats at level 50 | Idlemaster | 171 | Sum of all stats == 171 |

### XP Curve

| # | Test | Level | Expected XP to Next | Pass/Fail Criteria |
|---|------|-------|--------------------|--------------------|
| X1 | Level 1 XP | 1 | 50 | `floor(50 * 1^1.5) == 50` |
| X2 | Level 10 XP | 10 | 1,581 | `floor(50 * 10^1.5) == 1581` |
| X3 | Level 25 XP | 25 | 6,250 | `floor(50 * 25^1.5) == 6250` |
| X4 | Level 50 XP | 50 | 17,677 | `floor(50 * 50^1.5) == 17677` |
| X5 | Cumulative at level 10 | 10 | 5,550 | Sum of levels 1-9 == 5550 |
| X6 | Cumulative at level 50 | 50 | 344,738 | Sum of levels 1-49 == 344738 |

### Starting Equipment

| # | Test | Expected | Pass/Fail Criteria |
|---|------|----------|-------------------|
| E1 | Each class starts with exactly 2 items equipped | 1 weapon + 1 armor/accessory | Equipment slot count == 2, inventory empty |
| E2 | All starter weapons have weapon_power = 5 | WP == 5 | `weapon.weapon_power == 5` for all classes |
| E3 | Epoch Mage weapon is magical type | `weapon_type == "magical"` | Damage scales from INT, not STR |
| E4 | All other class weapons are physical type | `weapon_type == "physical"` | Damage scales from STR |
| E5 | Starter items cannot be sold | Sell button disabled or absent | Attempting sell returns error or is not available |
| E6 | Starter items replaced on equip | Equipping a drop in same slot destroys starter | Starter item not in inventory after replacement |
| E7 | Chronoknight first-hit damage | 4 per tick | `floor((7+1)*5/10) == 4` |
| E8 | Idlemaster first-hit damage | 2 per tick | `floor(4*5/10) == 2` |

### Zone 1-1 Survivability

| # | Test | Class | Survives? | Pass/Fail Criteria |
|---|------|-------|-----------|--------------------|
| Z1 | Chronoknight vs Zone 1-1 | Chronoknight | Yes (8 ticks kill, 34 ticks die) | Player wins encounter |
| Z2 | Timestomper vs Zone 1-1 | Timestomper | Yes (6 ticks kill, 15 ticks die) | Player wins encounter |
| Z3 | Epoch Mage vs Zone 1-1 | Epoch Mage | Yes (6 ticks kill, 23 ticks die) | Player wins encounter |
| Z4 | Idlemaster vs Zone 1-1 | Idlemaster | Yes, marginal (15 kill, 15 die) | Player wins or ties (tie = win) |
| Z5 | Loot Gremlin vs Zone 1-1 | Loot Gremlin | Yes (15 ticks kill, 19 ticks die) | Player wins encounter |
| Z6 | Unflappable vs Zone 1-1 | Unflappable | Yes (10 ticks kill, 42 ticks die) | Player wins encounter |

---

## Appendix A: Complete XP Curve Table (Levels 1-50)

| Level | XP to Next Level | Cumulative XP |
|-------|-----------------|---------------|
| 1 | 50 | 0 |
| 2 | 141 | 50 |
| 3 | 259 | 191 |
| 4 | 400 | 450 |
| 5 | 559 | 850 |
| 6 | 734 | 1,409 |
| 7 | 926 | 2,143 |
| 8 | 1,131 | 3,069 |
| 9 | 1,350 | 4,200 |
| 10 | 1,581 | 5,550 |
| 11 | 1,824 | 7,131 |
| 12 | 2,078 | 8,955 |
| 13 | 2,343 | 11,033 |
| 14 | 2,619 | 13,376 |
| 15 | 2,904 | 15,995 |
| 16 | 3,200 | 18,899 |
| 17 | 3,504 | 22,099 |
| 18 | 3,818 | 25,603 |
| 19 | 4,140 | 29,421 |
| 20 | 4,472 | 33,561 |
| 21 | 4,811 | 38,033 |
| 22 | 5,159 | 42,844 |
| 23 | 5,515 | 48,003 |
| 24 | 5,878 | 53,518 |
| 25 | 6,250 | 59,396 |
| 26 | 6,628 | 65,646 |
| 27 | 7,014 | 72,274 |
| 28 | 7,408 | 79,288 |
| 29 | 7,808 | 86,696 |
| 30 | 8,215 | 94,504 |
| 31 | 8,630 | 102,719 |
| 32 | 9,050 | 111,349 |
| 33 | 9,478 | 120,399 |
| 34 | 9,912 | 129,877 |
| 35 | 10,353 | 139,789 |
| 36 | 10,800 | 150,142 |
| 37 | 11,253 | 160,942 |
| 38 | 11,712 | 172,195 |
| 39 | 12,177 | 183,907 |
| 40 | 12,649 | 196,084 |
| 41 | 13,126 | 208,733 |
| 42 | 13,609 | 221,859 |
| 43 | 14,098 | 235,468 |
| 44 | 14,593 | 249,566 |
| 45 | 15,093 | 264,159 |
| 46 | 15,599 | 279,252 |
| 47 | 16,110 | 294,851 |
| 48 | 16,627 | 310,961 |
| 49 | 17,150 | 327,588 |
| 50 | 17,677 | 344,738 |

---

## Appendix B: Stat Growth Summary (Key Levels)

### Chronoknight (Balanced STR/VIT)

| Lv | STR | INT | VIT | SPD | LCK | Total | HP | Tick (s) | Crit% |
|----|-----|-----|-----|-----|-----|-------|----|----------|-------|
| 1 | 7 | 3 | 7 | 4 | 4 | 25 | 105 | 2.885 | 2.0 |
| 5 | 10 | 4 | 10 | 5 | 5 | 34 | 150 | 2.857 | 2.5 |
| 10 | 15 | 5 | 15 | 8 | 8 | 51 | 225 | 2.778 | 4.0 |
| 20 | 24 | 8 | 24 | 12 | 12 | 80 | 360 | 2.679 | 6.0 |
| 30 | 33 | 11 | 33 | 17 | 17 | 111 | 495 | 2.564 | 8.5 |
| 40 | 42 | 14 | 42 | 21 | 21 | 140 | 630 | 2.479 | 10.5 |
| 50 | 51 | 17 | 51 | 26 | 26 | 171 | 765 | 2.381 | 13.0 |

### Timestomper (Glass Cannon STR/SPD)

| Lv | STR | INT | VIT | SPD | LCK | Total | HP | Tick (s) | Crit% |
|----|-----|-----|-----|-----|-----|-------|----|----------|-------|
| 1 | 9 | 2 | 4 | 6 | 4 | 25 | 60 | 2.830 | 2.0 |
| 5 | 13 | 2 | 5 | 9 | 5 | 34 | 75 | 2.752 | 2.5 |
| 10 | 19 | 3 | 8 | 12 | 8 | 50 | 120 | 2.679 | 4.0 |
| 20 | 31 | 4 | 12 | 20 | 12 | 79 | 180 | 2.500 | 6.0 |
| 30 | 43 | 6 | 17 | 27 | 17 | 110 | 255 | 2.362 | 8.5 |
| 40 | 55 | 7 | 21 | 35 | 21 | 139 | 315 | 2.222 | 10.5 |
| 50 | 67 | 9 | 26 | 42 | 26 | 170 | 390 | 2.113 | 13.0 |

### Epoch Mage (Magic INT/SPD)

| Lv | STR | INT | VIT | SPD | LCK | Total | HP | Tick (s) | Crit% |
|----|-----|-----|-----|-----|-----|-------|----|----------|-------|
| 1 | 2 | 9 | 4 | 5 | 5 | 25 | 60 | 2.857 | 2.5 |
| 5 | 2 | 13 | 5 | 7 | 7 | 34 | 75 | 2.804 | 3.5 |
| 10 | 3 | 19 | 8 | 10 | 10 | 50 | 120 | 2.727 | 5.0 |
| 20 | 4 | 31 | 12 | 16 | 16 | 79 | 180 | 2.586 | 8.0 |
| 30 | 6 | 43 | 17 | 22 | 22 | 110 | 255 | 2.459 | 11.0 |
| 40 | 7 | 55 | 21 | 28 | 28 | 139 | 315 | 2.344 | 14.0 |
| 50 | 9 | 67 | 26 | 34 | 34 | 170 | 390 | 2.239 | 17.0 |

### Idlemaster (Idle SPD/LCK)

| Lv | STR | INT | VIT | SPD | LCK | Total | HP | Tick (s) | Crit% |
|----|-----|-----|-----|-----|-----|-------|----|----------|-------|
| 1 | 4 | 4 | 4 | 7 | 6 | 25 | 60 | 2.804 | 3.0 |
| 5 | 5 | 5 | 5 | 10 | 9 | 34 | 75 | 2.727 | 4.5 |
| 10 | 8 | 8 | 8 | 15 | 12 | 51 | 120 | 2.609 | 6.0 |
| 20 | 12 | 12 | 12 | 24 | 20 | 80 | 180 | 2.419 | 10.0 |
| 30 | 17 | 17 | 17 | 33 | 27 | 111 | 255 | 2.256 | 13.5 |
| 40 | 21 | 21 | 21 | 42 | 35 | 140 | 315 | 2.113 | 17.5 |
| 50 | 26 | 26 | 26 | 51 | 42 | 171 | 390 | 1.987 | 21.0 |

### Loot Gremlin (Item LCK/VIT)

| Lv | STR | INT | VIT | SPD | LCK | Total | HP | Tick (s) | Crit% |
|----|-----|-----|-----|-----|-----|-------|----|----------|-------|
| 1 | 4 | 3 | 5 | 4 | 9 | 25 | 75 | 2.885 | 4.5 |
| 5 | 5 | 4 | 7 | 5 | 13 | 34 | 105 | 2.857 | 6.5 |
| 10 | 8 | 5 | 10 | 8 | 19 | 50 | 150 | 2.778 | 9.5 |
| 20 | 12 | 8 | 16 | 12 | 31 | 79 | 240 | 2.679 | 15.5 |
| 30 | 17 | 11 | 22 | 17 | 43 | 110 | 330 | 2.564 | 21.5 |
| 40 | 21 | 14 | 28 | 21 | 55 | 139 | 420 | 2.479 | 27.5 |
| 50 | 26 | 17 | 34 | 26 | 67 | 170 | 510 | 2.381 | 33.5 |

### Unflappable (Tank VIT/STR)

| Lv | STR | INT | VIT | SPD | LCK | Total | HP | Tick (s) | Crit% |
|----|-----|-----|-----|-----|-----|-------|----|----------|-------|
| 1 | 5 | 3 | 9 | 4 | 4 | 25 | 135 | 2.885 | 2.0 |
| 5 | 7 | 4 | 13 | 5 | 5 | 34 | 195 | 2.857 | 2.5 |
| 10 | 10 | 5 | 19 | 8 | 8 | 50 | 285 | 2.778 | 4.0 |
| 20 | 16 | 8 | 31 | 12 | 12 | 79 | 465 | 2.679 | 6.0 |
| 30 | 22 | 11 | 43 | 17 | 17 | 110 | 645 | 2.564 | 8.5 |
| 40 | 28 | 14 | 55 | 21 | 21 | 139 | 825 | 2.479 | 10.5 |
| 50 | 34 | 17 | 67 | 26 | 26 | 170 | 1005 | 2.381 | 13.0 |

---

## Appendix C: Data File Reference

Machine-readable data for all tables in this spec is available at:

```
docs/data/character-creation.json
```

This JSON file contains:
- All class definitions with base stats, growth weights, descriptions, and tips
- Pre-computed stat tables for all 6 classes at levels 1-50 (with derived stats)
- Complete XP curve (levels 1-50) with cumulative totals
- Starting equipment definitions with item IDs, slot assignments, and stat bonuses
- All constants referenced in this spec

The programmer can import this file directly. The stat tables are pre-computed using the formulas in Section 4 and verified against the worked examples.
