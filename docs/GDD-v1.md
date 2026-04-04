# ChronoQueue -- Game Design Document v1

**Version:** 1.0
**Author:** Lead Game Designer, VOID Studios
**Date:** 2026-04-04
**Status:** Draft -- Pending Creative Director alignment and board review

---

## Table of Contents

1. [Game Overview](#1-game-overview)
2. [Core Stats Reference](#2-core-stats-reference)
3. [Character Creation System](#3-character-creation-system)
4. [Combat System](#4-combat-system)
5. [Progression System](#5-progression-system)
6. [Item & Rarity System](#6-item--rarity-system)
7. [Inventory System](#7-inventory-system)
8. [First 2 Acts](#8-first-2-acts)
9. [Idle Mechanics](#9-idle-mechanics)

---

## 1. Game Overview

ChronoQueue is an idle RPG where the game plays itself. The player creates a character, and that character automatically battles enemies, collects loot, gains levels, and progresses through a queued series of quests and zones. Player input is optional -- they can intervene at any time to make strategic choices (equip items, allocate stats, choose quest paths), or they can walk away for 30 days and return to find meaningful progress.

**Spiritual lineage:** Progress Quest (auto-play), but with real systems that reward attention without punishing absence.

**Tone:** Parody meets substance. The writing is funny, the numbers are real.

**Design pillars (pending Creative Director finalization):**
- *Idle-first:* Every system must work without player input.
- *Attention rewarded, absence forgiven:* Active players progress faster but AFK players never feel punished.
- *Numbers go up (and it matters):* Progression is visible, constant, and connected to real power growth.
- *Parody with teeth:* Humor in the writing, genuine depth in the mechanics.

---

## 2. Core Stats Reference

Five stats govern all systems. Every formula in this document references these.

| Stat | Abbrev | Role |
|------|--------|------|
| Strength | STR | Physical damage scaling |
| Intelligence | INT | Magic damage scaling |
| Vitality | VIT | Hit points, survivability |
| Speed | SPD | Action speed modifier, encounter rate |
| Luck | LCK | Critical hit chance, drop quality |

All stats are positive integers. Minimum value: 1. No stat can be reduced below 1 by any effect.

---

## 3. Character Creation System

### 3.1 Overview

Character creation is the player's first and most meaningful upfront decision. They choose a name and one of six classes. Each class defines starting stat distribution and long-term stat growth weights, making the choice strategically meaningful across the entire playthrough.

### 3.2 Player Fantasy

"The player feels like they are choosing their destiny when they pick a class, because each archetype promises a fundamentally different way to experience the queue -- fast and fragile, slow and unstoppable, lucky and loot-rich, or magically powerful."

### 3.3 Detailed Rules

**Name Input:**
- Player enters a character name.
- Valid characters: A-Z, a-z, 0-9, spaces, hyphens.
- Length: 1-20 characters after trimming leading/trailing whitespace.
- If the player submits an empty or whitespace-only name, assign "Adventurer".
- Display name preserves original casing.

**Class Selection:**
- Player selects one of 6 classes from a list.
- Each class displays: name, flavor text, starting stats, and a one-line playstyle summary.
- Selection is final (no respec in MVP). Respec is a post-MVP feature.

**Six Classes:**

| Class | Flavor | Playstyle | Primary Stats |
|-------|--------|-----------|--------------|
| Chronoknight | "Time is a blade, and I am its edge." | Balanced melee fighter. Steady, reliable progression. | STR / VIT |
| Timestomper | "Why wait? Hit harder." | Glass cannon melee. Kills fast, dies sometimes. | STR / SPD |
| Epoch Mage | "The queue bends to my will." | Magic damage dealer. High burst, squishy. | INT / SPD |
| Idlemaster | "I progress while I sleep." | Idle optimization specialist. Best AFK performance. | SPD / LCK |
| Loot Gremlin | "If it's shiny, it's mine." | Item hunter. Better drop quality, slower kills. | LCK / VIT |
| Unflappable | "I have all the time in the world." | Tank. Survives harder content earlier. | VIT / STR |

**Starting Stats (total: 25 per class):**

| Class | STR | INT | VIT | SPD | LCK |
|-------|-----|-----|-----|-----|-----|
| Chronoknight | 7 | 3 | 7 | 4 | 4 |
| Timestomper | 9 | 2 | 4 | 6 | 4 |
| Epoch Mage | 2 | 9 | 4 | 5 | 5 |
| Idlemaster | 4 | 4 | 4 | 7 | 6 |
| Loot Gremlin | 4 | 3 | 5 | 4 | 9 |
| Unflappable | 5 | 3 | 9 | 4 | 4 |

After selecting a class, the character is created and immediately enters the first zone of Act 1. No additional setup required.

### 3.4 Formulas

**Name validation:**

```
valid_name = trim(input)
if length(valid_name) == 0: valid_name = "Adventurer"
if length(valid_name) > 20: valid_name = valid_name[0:20]
valid_name = regex_replace(valid_name, /[^A-Za-z0-9 -]/, "")
if length(valid_name) == 0: valid_name = "Adventurer"
```

**Worked example:**
- Input: "  xX_Chrono_Lord_Xx!!  "
- After trim: "xX_Chrono_Lord_Xx!!"
- After regex: "xXChronoLordXx"
- Length 14, valid. Final name: "xXChronoLordXx"

**Starting stat verification:**
- Sum of all starting stats for any class = 25.
- Chronoknight: 7+3+7+4+4 = 25.

### 3.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Empty name input | Set name to "Adventurer" |
| Name is only special characters | After regex strip, becomes empty -> set to "Adventurer" |
| Name is exactly 20 characters | Accept as-is |
| Name is 21+ characters | Truncate to first 20 characters, then apply regex |
| Name is all spaces | Trim reduces to empty -> "Adventurer" |
| Player does not select a class | UI requires selection before proceeding. No default class. |
| Name contains emoji | Regex strips non-alphanumeric/space/hyphen characters |

### 3.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Character Creation | --> | Progression | Starting stats feed into the progression growth formula |
| Character Creation | --> | Combat | STR/INT determine starting damage; VIT determines starting HP |
| Character Creation | --> | Idle Mechanics | Idlemaster class has SPD/LCK focus which affects idle efficiency |
| Character Creation | --> | Item & Rarity | LCK stat affects drop quality from the first kill |

### 3.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `STARTING_STAT_BUDGET` | 25 | 20-35 | **curve** | Total stat points distributed at character creation |
| `NAME_MAX_LENGTH` | 20 | 10-40 | **feel** | Display/UI constraint |
| `CLASS_COUNT` | 6 | 4-8 | **gate** | Number of available classes |

### 3.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| CC-01 | All 6 classes are selectable | Each class appears in the selection UI and can be chosen |
| CC-02 | Starting stats sum to STARTING_STAT_BUDGET | For every class, sum(STR,INT,VIT,SPD,LCK) == 25 |
| CC-03 | Name validation works | Empty input yields "Adventurer"; 21-char input yields 20-char result; special chars are stripped |
| CC-04 | Character enters Act 1 Zone 1 after creation | After confirming class, character state is zone="back_of_the_line", act=1, level=1 |
| CC-05 | Class stats match table | Each class's starting stat array matches the values in section 3.3 |

---

## 4. Combat System

### 4.1 Overview

Combat is the engine that drives progression. It is fully automatic -- the player never needs to press "attack." Every tick, the player's character and the current enemy exchange blows until one falls. Combat produces XP, gold, and item drops, feeding every other system.

### 4.2 Player Fantasy

"The player feels like a warrior steadily cutting through a queue of monsters when they watch their damage numbers tick up and enemies fall, because every kill visibly rewards them with XP, gold, and occasionally exciting loot."

### 4.3 Detailed Rules

**Combat States:**

```
IDLE --> ENCOUNTER --> IN_COMBAT --> VICTORY --> LOOT --> IDLE
                          |
                          v
                        DEFEAT --> RESPAWN --> IDLE
```

- **IDLE:** No enemy present. After `ENCOUNTER_DELAY` ticks, transition to ENCOUNTER.
- **ENCOUNTER:** Enemy spawns from current zone's enemy table. Transition to IN_COMBAT.
- **IN_COMBAT:** Each tick, player attacks enemy, then enemy attacks player (if alive).
- **VICTORY:** Enemy HP reaches 0. Award XP and gold. Transition to LOOT.
- **LOOT:** Roll for item drop. If drop, add to inventory. Transition to IDLE.
- **DEFEAT:** Player HP reaches 0. Player respawns at current zone with full HP. No XP or gold penalty. Death counter increments by 1.
- **RESPAWN:** Player HP restored to max. Resume from IDLE state.

**Damage Calculation (per tick):**
- Weapons have a `weapon_type`: `physical` or `magical`.
- Physical weapons scale off STR; magical weapons scale off INT.

**Enemy Behavior:**
- Enemies have: HP, damage, XP reward, gold reward.
- Enemies attack once per tick for flat damage.
- No enemy special abilities in MVP. Bosses are stat-scaled only.

### 4.4 Formulas

**Player Damage Per Tick:**

```
scaling_stat = STR if weapon_type == "physical" else INT
base_damage = (scaling_stat * weapon_power) / 10
crit_roll = random(0, 1)
crit_threshold = LCK / 200
is_crit = crit_roll < crit_threshold
damage = max(MIN_DAMAGE, floor(base_damage * (CRIT_MULTIPLIER if is_crit else 1.0)))
```

| Constant | Value |
|----------|-------|
| MIN_DAMAGE | 1 |

Every attack deals at least `MIN_DAMAGE`. This prevents 0-damage stalls with bare hands or very low stats.

**Worked example (Chronoknight, Level 5):**
- STR: 12 (starting 7 + 4 levels of growth)
- Weapon: "Rusty Chrono-Blade", physical, weapon_power = 8
- LCK: 5
- base_damage = (12 * 8) / 10 = 9.6
- crit_threshold = 5 / 200 = 0.025 (2.5% crit chance)
- Non-crit: damage = max(1, floor(9.6)) = 9
- Crit: damage = max(1, floor(9.6 * 1.5)) = 14

**Worked example (Bare hands, Chronoknight, Level 1):**
- STR: 7, weapon_power: 1 (bare hands), LCK: 4
- base_damage = (7 * 1) / 10 = 0.7
- damage = max(1, floor(0.7)) = max(1, 0) = 1
- Zone 1-1 enemy HP = 2 * 15 = 30, ticks_to_kill = 30
- Slow but functional. Player upgrades weapon within first few kills.

**Player Max HP:**

```
max_hp = VIT * HP_PER_VIT
```

- HP_PER_VIT = 15

**Worked example:** VIT 7 -> max_hp = 105

**Player Effective Tick Speed:**

```
effective_ticks_per_second = BASE_TICK_RATE * (1 + SPD / 100)
```

- BASE_TICK_RATE = 1/3 (one tick per 3 seconds)

**Worked example:** SPD 7 -> effective rate = 0.333 * 1.07 = 0.357 ticks/sec (2.8 sec per tick instead of 3.0)

**Enemy Stats (by zone level):**

```
enemy_hp = ZONE_LEVEL * ENEMY_HP_PER_LEVEL
enemy_damage = ceil(ZONE_LEVEL * ENEMY_DMG_PER_LEVEL)
enemy_xp = ENEMY_BASE_XP + (ZONE_LEVEL * ENEMY_XP_PER_LEVEL)
enemy_gold = ENEMY_BASE_GOLD + (ZONE_LEVEL * ENEMY_GOLD_PER_LEVEL)
```

| Constant | Value |
|----------|-------|
| ENEMY_HP_PER_LEVEL | 15 |
| ENEMY_DMG_PER_LEVEL | 2.0 |
| ENEMY_BASE_XP | 10 |
| ENEMY_XP_PER_LEVEL | 5 |
| ENEMY_BASE_GOLD | 5 |
| ENEMY_GOLD_PER_LEVEL | 3 |

**Worked example (Zone Level 5):**
- enemy_hp = 5 * 15 = 75
- enemy_damage = ceil(5 * 2.0) = 10
- enemy_xp = 10 + (5 * 5) = 35
- enemy_gold = 5 + (5 * 3) = 20

**Ticks to Kill (no crits):**

```
ticks_to_kill = ceil(enemy_hp / player_damage_per_tick)
```

**Worked example:** 75 / 9 = 8.33 -> ceil = 9 ticks (27 seconds at base tick rate)

**Player Survival Check:**

```
player_ticks_to_die = ceil(max_hp / enemy_damage)
```

**Worked example:** 105 / 10 = 10.5 -> ceil = 11 ticks.
- Player kills in 9 ticks, dies in 11 ticks -> Player survives with HP to spare. Comfortable progression.
- With VIT 4 (Timestomper): 60 / 10 = 6 ticks. Kills in 9, dies in 6 -> Glass cannon dies. Needs better gear or levels.

**Boss Stats:**

```
boss_hp = enemy_hp * BOSS_HP_MULTIPLIER
boss_damage = enemy_damage * BOSS_DMG_MULTIPLIER
boss_xp = enemy_xp * BOSS_XP_MULTIPLIER
boss_gold = enemy_gold * BOSS_GOLD_MULTIPLIER
```

| Constant | Value |
|----------|-------|
| BOSS_HP_MULTIPLIER | 3 |
| BOSS_DMG_MULTIPLIER | 1.5 |
| BOSS_XP_MULTIPLIER | 10 |
| BOSS_GOLD_MULTIPLIER | 10 |

**Worked example (Zone 5 Boss):**
- boss_hp = 75 * 3 = 225
- boss_damage = ceil(10 * 1.5) = 15
- boss_xp = 35 * 10 = 350
- boss_gold = 20 * 10 = 200

### 4.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Player and enemy kill each other on same tick | Player wins. Victory takes priority over defeat on simultaneous-death ticks. |
| Player has no weapon equipped | Use `bare_hands` default: weapon_power = 1, weapon_type = "physical". MIN_DAMAGE floor ensures at least 1 damage per tick. |
| Enemy damage exceeds player HP by large margin | Player dies in 1 tick. Respawn immediately, no partial damage carry-over. |
| Player one-shots enemy | Victory on first combat tick. Loot rolls proceed normally. |
| Boss encounter with under-leveled player | Player dies, respawns, re-encounters the boss. No lockout. Player will eventually out-level through earlier zone enemies. |
| Combat during offline calculation | Use averaged damage (no crit rolls) for offline simulation. See Idle Mechanics. |

### 4.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Combat | <-- | Character Creation | Stats determine damage and HP |
| Combat | <-- | Progression | Level-up increases stats, increasing damage/HP |
| Combat | <-- | Item & Rarity | Equipped items provide weapon_power and stat bonuses |
| Combat | --> | Progression | Kills award XP and gold |
| Combat | --> | Item & Rarity | Kills trigger drop rolls |
| Combat | --> | First 2 Acts | Combat resolves encounters within act zones |
| Combat | <-> | Idle Mechanics | Combat runs automatically; offline uses simplified combat math |

### 4.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `HP_PER_VIT` | 15 | 10-25 | **feel** | How tanky each point of VIT feels |
| `MIN_DAMAGE` | 1 | 1-3 | **feel** | Minimum damage per attack. Prevents 0-damage stalls. |
| `CRIT_MULTIPLIER` | 1.5 | 1.25-3.0 | **feel** | Crit damage spike visibility |
| `ENEMY_HP_PER_LEVEL` | 15 | 10-25 | **curve** | Controls time-to-kill per zone |
| `ENEMY_DMG_PER_LEVEL` | 2.0 | 1.0-4.0 | **curve** | Controls survivability pressure |
| `ENCOUNTER_DELAY` | 1 tick | 0-3 ticks | **feel** | Breathing room between fights |
| `BOSS_HP_MULTIPLIER` | 3 | 2-5 | **gate** | How much harder bosses are than normal enemies |
| `BOSS_DMG_MULTIPLIER` | 1.5 | 1.25-3 | **gate** | Boss danger level |
| `BOSS_SPAWN_RATE` | 0.20 | 0.10-0.50 | **gate** | Chance that an encounter in a boss zone is the boss (when boss quest is active) |

### 4.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| CB-01 | Damage formula matches spec | Player with STR 12, weapon_power 8, physical weapon deals floor((12*8)/10) = 9 damage per non-crit tick |
| CB-02 | Crit chance matches LCK formula | Over 10,000 combat ticks with LCK 20, crit rate is 10% +/- 1.5% |
| CB-03 | Enemy HP scales correctly | Zone level 10 enemy has exactly 150 HP |
| CB-04 | Death/respawn works | When player HP hits 0, player respawns at current zone with full HP within 1 tick |
| CB-05 | Boss stats are multiplied correctly | Zone 10 boss has 450 HP (150*3) and ceil(20*1.5)=30 damage |
| CB-06 | No weapon defaults to bare hands | Unequipped player deals max(1, floor((STR*1)/10)) = 1 damage minimum |
| CB-07 | Simultaneous death resolves as player victory | Player and enemy reaching 0 HP on same tick awards XP/gold/loot |

---

## 5. Progression System

### 5.1 Overview

The progression system converts combat rewards (XP) into permanent power growth (levels and stats). It is the primary feedback loop that makes the player feel forward momentum. Leveling is deterministic, automatic, and always positive -- the player never loses progress.

### 5.2 Player Fantasy

"The player feels like they are getting relentlessly stronger when they see levels tick up and stats climb, because every level tangibly increases their damage, HP, and ability to push into harder zones."

### 5.3 Detailed Rules

**Leveling:**
- XP accumulates from enemy kills.
- When `current_xp >= xp_to_next_level`, the character levels up.
- Level-up is instant: stats increase, HP is fully restored, excess XP carries over.
- Multiple level-ups can occur in a single tick if XP is sufficient (e.g., boss kill).

**Stat Growth:**
- Each level grants 3 stat points, distributed deterministically by class growth weights.
- No manual stat allocation in MVP. Growth is automatic based on class identity.
- This keeps the idle loop clean -- no decision backlog accumulates while AFK.

**Class Growth Weights (percentage of stat points allocated to each stat):**

| Class | STR | INT | VIT | SPD | LCK |
|-------|-----|-----|-----|-----|-----|
| Chronoknight | 30% | 10% | 30% | 15% | 15% |
| Timestomper | 40% | 5% | 15% | 25% | 15% |
| Epoch Mage | 5% | 40% | 15% | 20% | 20% |
| Idlemaster | 15% | 15% | 15% | 30% | 25% |
| Loot Gremlin | 15% | 10% | 20% | 15% | 40% |
| Unflappable | 20% | 10% | 40% | 15% | 15% |

**Level Cap:** 50 (MVP). At level 50, XP continues to accumulate but no further level-ups occur. This cap can be raised when new acts are added.

**Prestige/Rebirth:** Not in MVP scope. Designed as a post-level-cap system for future acts.

### 5.4 Formulas

**XP Required for Next Level:**

```
xp_to_next_level(n) = floor(BASE_XP * n ^ XP_EXPONENT)
```

| Constant | Value |
|----------|-------|
| BASE_XP | 50 |
| XP_EXPONENT | 1.5 |

**XP Curve Table (selected levels):**

| Level | XP to Next Level |
|-------|-----------------|
| 1 | 50 |
| 2 | 141 |
| 3 | 259 |
| 5 | 559 |
| 10 | 1,581 |
| 15 | 2,904 |
| 20 | 4,472 |
| 30 | 8,215 |
| 40 | 12,649 |
| 50 | 17,677 |

Cumulative XP is computed at runtime by summing `xp_to_next_level(n)` for n = 1 to target level - 1. Approximate totals: ~7,100 to reach level 10, ~38,000 to reach level 20, ~362,000 to reach level 50.

**Stat at Level N:**

```
stat(level) = starting_stat + floor((level - 1) * STAT_POINTS_PER_LEVEL * class_weight / 100)
```

| Constant | Value |
|----------|-------|
| STAT_POINTS_PER_LEVEL | 3 |

**Worked example (Chronoknight STR at Level 10):**
- starting_STR = 7
- class_weight_STR = 30%
- stat(10) = 7 + floor(9 * 3 * 0.30) = 7 + floor(8.1) = 7 + 8 = 15

**Worked example (Loot Gremlin LCK at Level 20):**
- starting_LCK = 9
- class_weight_LCK = 40%
- stat(20) = 9 + floor(19 * 3 * 0.40) = 9 + floor(22.8) = 9 + 22 = 31

**Stat verification -- total stat points at Level 20 (any class):**
- Starting budget: 25
- Growth: floor(19 * 3 * w/100) summed over all stats
- For Chronoknight: floor(19*0.9) + floor(19*0.3) + floor(19*0.9) + floor(19*0.45) + floor(19*0.45)
  = 17 + 5 + 17 + 8 + 8 = 55
- Total stats at level 20: 25 + 55 = 80

Note: Due to floor operations, some classes may end up with 1-2 fewer total points than the theoretical (25 + 57 = 82). This is acceptable variance -- the floor prevents fractional stats.

### 5.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Boss kill grants enough XP for multiple level-ups | Process all level-ups sequentially in a single tick. Stats update after each level. |
| Player reaches level 50 | XP counter continues to increment (for future prestige use). No stat growth. Display "MAX LEVEL" in UI. |
| XP overflow (64-bit integer max) | Theoretical max at level 50: ~362,000 cumulative + post-cap farming. No overflow risk with 64-bit integers. |
| Stat growth rounds to 0 for a minor stat at low levels | Stat stays at starting value. Growth accumulates fractionally and the floor eventually awards a point at higher levels. |
| Two stats have identical weights | Both follow the same growth formula. No conflict. |

### 5.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Progression | <-- | Combat | XP is earned from kills |
| Progression | --> | Combat | Higher stats increase damage and HP |
| Progression | <-- | Character Creation | Starting stats and class weights define the growth trajectory |
| Progression | --> | First 2 Acts | Level determines which zones are survivable |
| Progression | <-> | Idle Mechanics | Leveling occurs during idle; offline XP calculation feeds progression |

### 5.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `BASE_XP` | 50 | 25-100 | **curve** | Baseline XP requirement. Lower = faster early game. |
| `XP_EXPONENT` | 1.5 | 1.2-2.0 | **curve** | How steeply XP requirements grow. 1.2 = gentle, 2.0 = harsh. |
| `STAT_POINTS_PER_LEVEL` | 3 | 2-5 | **curve** | Power growth rate per level. |
| `LEVEL_CAP` | 50 | 30-100 | **gate** | Maximum achievable level in current content. |

### 5.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| PG-01 | XP to next level matches formula | At level 10, xp_to_next_level = floor(50 * 10^1.5) = 1581 |
| PG-02 | Level-up triggers stat growth | Chronoknight leveling from 9 to 10 gains STR such that total STR = 7 + floor(9 * 3 * 0.30) = 15 |
| PG-03 | Excess XP carries over | Player at level 5 with 500/559 XP, gains 100 XP -> levels to 6 with (600-559)=41 XP toward level 7 |
| PG-04 | Multi-level-up works | Player at level 1 with 0 XP gains 500 XP -> levels to 3 (L1->L2 costs 50, L2->L3 costs 141, total 191; 500-191=309 carried, L3->L4 costs 259; levels to 4 with 50 XP carried) |
| PG-05 | Level cap prevents further leveling | At level 50, gaining 10,000 XP does not change level or stats. XP counter reflects the addition. |
| PG-06 | HP fully restores on level-up | Player at 30/70 HP levels up with VIT increase -> HP becomes new max_hp |

---

## 6. Item & Rarity System

### 6.1 Overview

Items are the primary tangible reward for combat. They drop automatically from defeated enemies, follow a rarity tier system, and provide stat bonuses when equipped. The system is designed to produce a constant stream of small upgrades with occasional exciting rare finds -- the heartbeat of idle RPG engagement.

### 6.2 Player Fantasy

"The player feels like a treasure hunter on a lucky streak when they see a Legendary item drop in the loot feed, because rarity colors create instant emotional spikes and the stat jump from a rare drop is immediately visible in their combat performance."

### 6.3 Detailed Rules

**Rarity Tiers (6):**

| Tier | Name | Color | Base Drop Weight |
|------|------|-------|-----------------|
| 0 | Common | White/Gray | 600 |
| 1 | Uncommon | Green | 250 |
| 2 | Rare | Blue | 100 |
| 3 | Epic | Purple | 40 |
| 4 | Legendary | Orange | 9 |
| 5 | Mythic | Red | 1 |

Total weight: 1000. Drop percentages: Common 60%, Uncommon 25%, Rare 10%, Epic 4%, Legendary 0.9%, Mythic 0.1%.

**Equipment Slots (7):**

| Slot | Item Category | Stat Focus |
|------|--------------|-----------|
| Head | Helmets, Hoods, Crowns | VIT, INT |
| Chest | Armor, Robes, Jackets | VIT, STR |
| Legs | Greaves, Pants, Boots | SPD, VIT |
| Weapon | Swords, Staves, Daggers | STR or INT (determines weapon_type) |
| Off-hand | Shields, Focuses, Parrying Daggers | VIT, LCK |
| Accessory 1 | Rings, Amulets, Charms | Any stat |
| Accessory 2 | Rings, Amulets, Charms | Any stat |

**Item Generation:**
When an item drops, the system generates it as follows:
1. Roll for equipment slot (uniform random across 7 slots).
2. Roll for rarity (weighted roll against the rarity table, modified by LCK).
3. Generate stat values based on zone level and rarity.
4. Generate item name from templates (slot + rarity + zone theme).

**Weapon Type Rule:**
- Weapons roll a type: 50% physical (STR-scaling), 50% magical (INT-scaling).
- Physical weapons generate weapon_power and bonus STR.
- Magical weapons generate weapon_power and bonus INT.

**Item Drop Trigger:**
- After each enemy kill (not bosses -- bosses have a separate guaranteed-drop rule).
- Regular enemies: `ITEM_DROP_CHANCE` probability of dropping an item.
- Bosses: 100% drop rate, rarity floor of Rare (minimum tier 2).

### 6.4 Formulas

**Item Drop Roll:**

```
drop_roll = random(0, 1)
drops_item = drop_roll < ITEM_DROP_CHANCE
```

| Constant | Value |
|----------|-------|
| ITEM_DROP_CHANCE | 0.25 |

**Rarity Roll (LCK-adjusted):**

```
For tiers >= 2 (Rare and above):
  adjusted_weight(tier) = base_weight(tier) * (1 + LCK * LCK_RARITY_BONUS)
For tiers < 2 (Common, Uncommon):
  adjusted_weight(tier) = base_weight(tier)

Normalize all weights to sum to 1000, then roll.
```

| Constant | Value |
|----------|-------|
| LCK_RARITY_BONUS | 0.01 | (1% increased weight per LCK point for Rare+)

**Worked example (LCK = 20):**
- Rare adjusted: 100 * (1 + 20 * 0.01) = 100 * 1.2 = 120
- Epic adjusted: 40 * 1.2 = 48
- Legendary adjusted: 9 * 1.2 = 10.8
- Mythic adjusted: 1 * 1.2 = 1.2
- Common: 600 (unchanged)
- Uncommon: 250 (unchanged)
- New total: 600 + 250 + 120 + 48 + 10.8 + 1.2 = 1030
- Effective Legendary chance: 10.8 / 1030 = 1.05% (up from 0.9%)

**Item Stat Value:**

```
base_stat_value = ZONE_LEVEL * ITEM_STAT_PER_LEVEL
stat_value = floor(base_stat_value * rarity_multiplier * (1 + random(-ITEM_VARIANCE, ITEM_VARIANCE)))
```

**Rarity Multipliers:**

| Rarity | Multiplier |
|--------|-----------|
| Common | 1.0 |
| Uncommon | 1.3 |
| Rare | 1.6 |
| Epic | 2.0 |
| Legendary | 2.5 |
| Mythic | 3.5 |

| Constant | Value |
|----------|-------|
| ITEM_STAT_PER_LEVEL | 2 |
| ITEM_VARIANCE | 0.10 |

**Worked example (Rare Sword, Zone Level 10):**
- base_stat_value = 10 * 2 = 20
- rarity_multiplier = 1.6
- variance roll: +5% (0.05)
- stat_value = floor(20 * 1.6 * 1.05) = floor(33.6) = 33
- This sword has weapon_power = 33.

**Weapon Power:**
- Weapons use the item stat formula to generate `weapon_power` instead of a bonus stat.
- Weapons also grant a secondary stat bonus = floor(stat_value * 0.3) to the scaling stat (STR for physical, INT for magical).

**Worked example (continued):**
- Physical Rare Sword, Zone 10: weapon_power = 33, bonus STR = floor(33 * 0.3) = 9

**Armor/Accessory Stat Assignment:**
- Each slot has two candidate stats (see slot table).
- Roll: 70% chance the item gets the first candidate stat, 30% the second.
- Stat value follows the item stat formula.

**Item Power Score (for comparison):**

```
power_score = sum_of_all_stat_bonuses * RARITY_POWER_FACTOR
```

| Rarity | RARITY_POWER_FACTOR |
|--------|-------------------|
| Common | 1.0 |
| Uncommon | 1.1 |
| Rare | 1.2 |
| Epic | 1.3 |
| Legendary | 1.5 |
| Mythic | 2.0 |

**Sell Value:**

```
sell_price = power_score * SELL_MULTIPLIER
```

| Constant | Value |
|----------|-------|
| SELL_MULTIPLIER | 1 |

Effective sell values scale with rarity naturally through the power score formula.

### 6.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| LCK is 0 | No adjustment to rarity weights. Base rates apply. |
| LCK is 200 (theoretical max) | Rare+ weights tripled. Mythic chance rises from 0.1% to ~0.23%. Still rare, not broken. |
| Boss drops an item | 100% drop rate. Rarity floor = Rare (tier 2). Roll as normal but reroll any result below tier 2. |
| Item stat variance rolls exactly -10% | stat_value = floor(base * multiplier * 0.9). Stat is lower but still positive. |
| Zone level 1 Common item | stat_value = floor(1 * 2 * 1.0 * ~1.0) = 2. Minimum meaningful stat. |
| Weapon rolls 0 weapon_power | Cannot happen. Minimum zone_level is 1, minimum rarity_multiplier is 1.0. floor(1 * 2 * 1.0 * 0.9) = 1. |
| Two accessories equipped with same name | Allowed. Accessories are independent items. |

### 6.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Item & Rarity | <-- | Combat | Enemy kills trigger item drops |
| Item & Rarity | --> | Combat | Equipped items provide weapon_power and stat bonuses |
| Item & Rarity | --> | Inventory | Dropped items enter inventory |
| Item & Rarity | <-- | Progression | Player level determines which zones they're in, which determines item stat ranges |
| Item & Rarity | <-- | Character Creation | LCK stat affects rarity distribution from the start |
| Item & Rarity | <-- | First 2 Acts | Zone level determines base item stats |

### 6.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `ITEM_DROP_CHANCE` | 0.25 | 0.10-0.50 | **feel** | How often items drop. Higher = more loot dopamine. |
| `LCK_RARITY_BONUS` | 0.01 | 0.005-0.03 | **curve** | How much LCK influences rare drops. |
| `ITEM_STAT_PER_LEVEL` | 2 | 1-4 | **curve** | How fast item power scales with zone level. |
| `ITEM_VARIANCE` | 0.10 | 0.05-0.25 | **feel** | Randomness range on item stats. |
| `RARITY_WEIGHTS` | [600,250,100,40,9,1] | See notes | **curve** | Drop distribution. Must sum to 1000 pre-LCK adjustment. |
| `BOSS_RARITY_FLOOR` | 2 (Rare) | 1-3 | **gate** | Minimum rarity of boss drops. |

### 6.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| IT-01 | Drop rate matches ITEM_DROP_CHANCE | Over 10,000 kills, item drop rate is 25% +/- 2% |
| IT-02 | Rarity distribution matches weights | Over 10,000 drops with LCK 0: Common ~60%, Uncommon ~25%, Rare ~10%, Epic ~4%, Legendary ~0.9%, Mythic ~0.1% (within 1.5% absolute tolerance) |
| IT-03 | LCK modifies rarity correctly | LCK 50 produces measurably higher Rare+ rates than LCK 0 over 10,000 drops |
| IT-04 | Item stats scale with zone level | Zone 10 Common item stat = floor(10 * 2 * 1.0 * variance) is in range [18, 22] |
| IT-05 | Boss always drops Rare+ | 100 boss kills produce 0 Common or Uncommon drops |
| IT-06 | Weapon generates weapon_power | Every weapon item has a weapon_power field > 0 and a weapon_type of "physical" or "magical" |
| IT-07 | Sell value is calculable | Every item has a computable sell_price = power_score * SELL_MULTIPLIER |

---

## 7. Inventory System

### 7.1 Overview

The inventory stores collected items and manages the equip/unequip flow. In idle mode, it auto-equips upgrades and auto-sells junk. The system must handle the constant stream of item drops without requiring player attention while still rewarding players who manually curate their loadout.

### 7.2 Player Fantasy

"The player feels like a treasure hoarder managing a growing vault when they open their inventory and see rows of color-coded items, because the rarity colors and power scores make it immediately clear what's valuable and what's vendor trash."

### 7.3 Detailed Rules

**Inventory Capacity:**
- Base capacity: `INVENTORY_MAX_SLOTS` items.
- Each item occupies exactly 1 slot regardless of rarity or type.
- Equipped items do NOT occupy inventory slots. They are in separate equipment slots.

**Equip/Unequip Flow:**
1. Player selects an inventory item and chooses "Equip."
2. If the target equipment slot is occupied, the existing item moves to inventory.
3. If inventory is full and the slot is occupied, the swap still occurs (1-for-1 exchange, no net change in inventory count).
4. New item is placed in the equipment slot. Stat bonuses apply immediately.
5. To unequip without replacing: item moves from equipment slot to inventory. Fails if inventory is full.

**Auto-Equip Logic (Idle Mode -- always active unless manually disabled post-MVP):**
When a new item enters inventory:
1. Identify the equipment slot for the new item.
2. Compare `power_score` of the new item vs. currently equipped item in that slot.
3. If new item's power_score > equipped item's power_score: auto-equip. Old item goes to inventory.
4. If new item's power_score <= equipped item's power_score: item stays in inventory.
5. If no item is equipped in that slot: auto-equip immediately.

**Auto-Sell Logic (when inventory is full):**
When a new item enters and inventory is at capacity:
1. Compare new item's power_score against the lowest power_score item in inventory.
2. If new item is better: auto-sell the lowest power_score item, add new item.
3. If new item is worse or equal: auto-sell the new item immediately (it never enters inventory).
4. Gold from auto-sold items is added to player's gold total.

**Manual Sell/Discard:**
- Player can sell any inventory item for its sell_price in gold.
- Player can discard any inventory item for 0 gold (in case sell is not desired).
- Equipped items must be unequipped first before selling/discarding.

**Item Comparison Display:**
When hovering/selecting an item, show:
- Item stats vs. currently equipped item in the same slot.
- Green arrow for stats that would increase, red arrow for stats that would decrease.
- Net power_score change.

### 7.4 Formulas

**Power Score (repeated from Item system for completeness):**

```
power_score = sum_of_all_stat_bonuses * RARITY_POWER_FACTOR
```

**Worked example (comparing two Chest items):**
- Equipped: Common Chest, VIT +10, power_score = 10 * 1.0 = 10
- New drop: Uncommon Chest, VIT +14, power_score = 14 * 1.1 = 15.4 -> floor = 15
- 15 > 10 -> Auto-equip the Uncommon. Old Common goes to inventory.

**Sell Price:**

```
sell_price = floor(power_score * SELL_MULTIPLIER)
```

**Worked example:**
- Common item, power_score 10: sell_price = floor(10 * 1) = 10 gold
- Epic item, power_score 60: sell_price = floor(60 * 1) = 60 gold

**Inventory Utilization Rate (for UI display):**

```
utilization = current_item_count / INVENTORY_MAX_SLOTS
```

Display as "32/50" and a fill bar.

### 7.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Inventory full, new item drops, no improvement | New item is auto-sold. Gold added. Item never enters inventory. |
| Inventory full, new item drops, better than lowest | Lowest item auto-sold. New item takes its slot. |
| Inventory full, player tries to unequip | Action blocked. Display message: "Inventory full. Sell or discard an item first." |
| Equipping an item when inventory is full | Swap occurs (equipped item goes to inventory, new item goes to slot). Net inventory count unchanged. |
| Multiple items tied for lowest power_score | Sell the one with lowest rarity tier. If still tied, sell the oldest (first acquired). |
| Player has 0 gold and sells an item | Gold increases by sell_price. No minimum gold requirement. |
| Item with power_score of 0 | Cannot happen. Minimum stat_value is 1, minimum RARITY_POWER_FACTOR is 1.0. |
| Auto-equip triggers while player is manually managing inventory | In MVP, auto-equip and manual equip do not conflict because auto-equip only triggers on new drops, not retroactively. |

### 7.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Inventory | <-- | Item & Rarity | Items enter inventory from drops |
| Inventory | --> | Combat | Equipped items affect combat stats (weapon_power, stat bonuses) |
| Inventory | <-- | Idle Mechanics | Auto-equip and auto-sell run during idle play |
| Inventory | --> | Progression | Equipment bonuses are added on top of base stats from leveling |

### 7.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `INVENTORY_MAX_SLOTS` | 50 | 20-100 | **gate** | More slots = less auto-sell pressure. Fewer = more curation. |
| `SELL_MULTIPLIER` | 1 | 0.5-5 | **curve** | Gold economy faucet from selling items. |
| `AUTO_EQUIP_ENABLED` | true | true/false | **feel** | Whether idle mode auto-equips upgrades. Always true in MVP. |

### 7.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| IN-01 | Inventory capacity enforced | Cannot exceed INVENTORY_MAX_SLOTS items in inventory at any time |
| IN-02 | Auto-equip triggers on upgrade | Item with power_score 20 drops for a slot with power_score 15 equipped -> item auto-equips |
| IN-03 | Auto-equip does not trigger on downgrade | Item with power_score 10 drops for a slot with power_score 15 equipped -> item goes to inventory |
| IN-04 | Auto-sell triggers at capacity | At 50/50 inventory, item drop with power_score lower than all inventory items -> item is sold, gold increases |
| IN-05 | Equip-swap works at full inventory | At 50/50, equipping an inventory item into an occupied slot results in a clean swap with 50/50 count |
| IN-06 | Unequip blocked at full inventory | At 50/50, attempting to unequip shows "Inventory full" message and does not modify state |
| IN-07 | Sell awards correct gold | Selling an item with power_score 25 and SELL_MULTIPLIER 1 awards exactly 25 gold |

---

## 8. First 2 Acts

### 8.1 Overview

Acts are the narrative and content structure of ChronoQueue. Each act contains zones (areas with level-appropriate enemies), quests (progression gates), and a boss encounter that gates the next act. The first two acts cover levels 1-20 and establish the game's tone: you're standing in a queue, and the queue is full of monsters.

### 8.2 Player Fantasy

"The player feels like an adventurer progressing through an absurd bureaucratic dungeon when they clear zones and defeat bosses, because the quest text is funny, the enemy names are ridiculous, and yet the power growth is genuinely satisfying."

### 8.3 Detailed Rules

**Act Structure:**

Each act contains 4 zones. Each zone spans ~2-3 levels of content.

**Act 1: "The Waiting Room" (Levels 1-10)**

| Zone | Name | Level Range | Zone Level (for formulas) |
|------|------|------------|--------------------------|
| 1-1 | The Back of the Line | 1-3 | 2 |
| 1-2 | The Middle-ish Area | 3-5 | 4 |
| 1-3 | The Front Desk Approach | 5-8 | 7 |
| 1-4 | The Clerk's Domain | 8-10 | 9 |

**Act 1 Enemies:**

| Enemy | Zone(s) | HP Modifier | Notes |
|-------|---------|------------|-------|
| Ticket Holder | 1-1, 1-2 | 1.0x | Basic melee. "Still holding number 4,782." |
| Line Cutter | 1-1, 1-2 | 0.7x HP, 1.3x DMG | Fast, fragile. "No shame. No remorse. No waiting." |
| Queue Guardian | 1-2, 1-3 | 1.5x HP, 0.7x DMG | Tanky, slow. "Ma'am, this is an orderly line." |
| Clipboard Golem | 1-3, 1-4 | 1.2x | Moderate. "Forms. In. Triplicate." |
| Rubber Stamp Elemental | 1-3, 1-4 | 1.0x HP, 1.2x DMG | "DENIED. DENIED. DENIED." |
| **The Bureaucratic Clerk** | 1-4 (Boss) | Boss multipliers | "Do you have form 27-B/6? ...I didn't think so." |

**Act 2: "The Other Side" (Levels 11-20)**

| Zone | Name | Level Range | Zone Level (for formulas) |
|------|------|------------|--------------------------|
| 2-1 | Temporal Lobby | 11-13 | 12 |
| 2-2 | The Chrono-Corridor | 13-16 | 14 |
| 2-3 | Paradox Alley | 16-18 | 17 |
| 2-4 | The Scheduler's Office | 18-20 | 19 |

**Act 2 Enemies:**

| Enemy | Zone(s) | HP Modifier | Notes |
|-------|---------|------------|-------|
| Time Waster | 2-1, 2-2 | 1.0x | "It'll just be a minute. It's never a minute." |
| Paradox Imp | 2-1, 2-2 | 0.8x HP, 1.1x DMG | "Yesterday, you already lost this fight." |
| Clock Watcher | 2-2, 2-3 | 0.6x HP, 1.5x DMG | Glass cannon. "Is it 5 o'clock yet?" |
| Overtime Ogre | 2-3, 2-4 | 1.4x HP, 1.1x DMG | "Mandatory. Fun." |
| Schedule Conflict | 2-3, 2-4 | 1.0x HP, 1.3x DMG | "You can't be here AND there." |
| **The Eternal Scheduler** | 2-4 (Boss) | Boss multipliers | "I've penciled in your defeat for... now." |

**Enemy HP/DMG Modifiers:**
These multiply the base enemy stats from the Combat System formulas:

```
modified_hp = floor(enemy_hp * hp_modifier)
modified_dmg = ceil(enemy_damage * dmg_modifier)
```

**Zone Progression:**
- Player starts in Zone 1-1.
- Completing all quests in a zone unlocks the next zone.
- The final zone of each act has a boss quest that gates the next act.
- Player can revisit cleared zones (enemies still spawn for grinding).

**Quest System:**
Quests are auto-accepted and auto-progressed. Four types:

| Type | Mechanic | Example |
|------|----------|---------|
| Kill | Defeat N enemies in current zone | "Disperse 10 Ticket Holders" |
| Collection | Collect N items (any rarity) | "Find 3 items in The Back of the Line" |
| Milestone | Reach level N | "Reach Level 5" |
| Boss | Defeat the zone boss | "Defeat The Bureaucratic Clerk" |

Each zone has 3-4 quests. Boss quests are always the final quest in the last zone of an act.

**Boss Encounter Spawning:**
When the boss quest is the player's active quest, encounters in the boss zone have a `BOSS_SPAWN_RATE` (20%) chance of spawning the boss instead of a regular enemy. The remaining 80% of encounters are regular enemies, allowing the player to gain XP and gear between boss attempts. After dying to a boss, the player respawns and continues fighting regular enemies until the next boss spawn roll succeeds.

**Quest Rewards:**
- Kill quests: Bonus XP = `quest_kill_count * enemy_xp * 0.5`
- Collection quests: Bonus gold = `quest_item_count * zone_level * 10`
- Milestone quests: One guaranteed item drop at Rare (tier 2) or above.
- Boss quests: Boss kill reward (already high) + act completion bonus.

**Act Completion Bonus:**

```
act_completion_xp = xp_to_next_level(act_max_level) * 2
act_completion_gold = act_max_level * 100
```

Act 1 completion (level 10): 1581 * 2 = 3162 XP, 1000 gold.
Act 2 completion (level 20): 4472 * 2 = 8944 XP, 2000 gold.

**Quest Log (Act 1, All Zones):**

Zone 1-1 "The Back of the Line":
1. "Take a Number" -- Kill 5 Ticket Holders. (Kill)
2. "Finders Keepers" -- Collect 2 items. (Collection)
3. "Baby Steps" -- Reach Level 2. (Milestone)

Zone 1-2 "The Middle-ish Area":
1. "Cutting in Line" -- Kill 8 Line Cutters. (Kill)
2. "Queue Discipline" -- Kill 5 Queue Guardians. (Kill)
3. "Gearing Up" -- Collect 3 items. (Collection)
4. "Getting Somewhere" -- Reach Level 5. (Milestone)

Zone 1-3 "The Front Desk Approach":
1. "Paperwork" -- Kill 10 Clipboard Golems. (Kill)
2. "Denied!" -- Kill 8 Rubber Stamp Elementals. (Kill)
3. "Well-Equipped" -- Collect 5 items. (Collection)

Zone 1-4 "The Clerk's Domain":
1. "The Final Form" -- Kill 12 enemies in this zone. (Kill)
2. "Level Up" -- Reach Level 8. (Milestone)
3. "The Clerk" -- Defeat The Bureaucratic Clerk. (Boss)

**Quest Log (Act 2, All Zones):**

Zone 2-1 "Temporal Lobby":
1. "Time After Time" -- Kill 10 Time Wasters. (Kill)
2. "Paradox Prevention" -- Kill 8 Paradox Imps. (Kill)
3. "Temporal Gear" -- Collect 4 items. (Collection)

Zone 2-2 "The Chrono-Corridor":
1. "Clock's Ticking" -- Kill 10 Clock Watchers. (Kill)
2. "Hall of Hours" -- Kill 12 enemies in this zone. (Kill)
3. "Chrono-Equipped" -- Collect 5 items. (Collection)
4. "Halfway There" -- Reach Level 15. (Milestone)

Zone 2-3 "Paradox Alley":
1. "Mandatory Overtime" -- Kill 10 Overtime Ogres. (Kill)
2. "Double-Booked" -- Kill 10 Schedule Conflicts. (Kill)
3. "Alley Sweep" -- Kill 15 enemies in this zone. (Kill)

Zone 2-4 "The Scheduler's Office":
1. "Final Countdown" -- Kill 15 enemies in this zone. (Kill)
2. "Peak Performance" -- Reach Level 18. (Milestone)
3. "The Scheduler" -- Defeat The Eternal Scheduler. (Boss)

### 8.4 Formulas

**Enemy Encounter Selection:**
Each zone has a weighted enemy table. When an encounter triggers:

```
For a zone with enemies [A, B]:
  Select enemy with equal probability (uniform random) from the zone's enemy list.
```

**Zone Survival Check (can the player survive here?):**

```
player_damage = floor((max(STR, INT) * best_weapon_power) / 10)
zone_enemy_hp = ZONE_LEVEL * ENEMY_HP_PER_LEVEL
zone_enemy_dmg = ceil(ZONE_LEVEL * ENEMY_DMG_PER_LEVEL)

ticks_to_kill = ceil(zone_enemy_hp / player_damage)
ticks_to_die = ceil(max_hp / zone_enemy_dmg)

survivable = ticks_to_die >= ticks_to_kill
```

**Worked example (Chronoknight, Level 5, entering Zone 1-2):**
- STR: 7 + floor(4 * 3 * 0.30) = 7 + 3 = 10
- Weapon: ~Common Zone 1-1, weapon_power = floor(2 * 2 * 1.0) = 4 (worst case)
- player_damage = floor(10 * 4 / 10) = 4
- Zone 1-2 level = 4
- enemy_hp = 4 * 15 = 60
- enemy_dmg = ceil(4 * 2) = 8
- ticks_to_kill = ceil(60/4) = 15
- VIT: 7 + floor(4 * 3 * 0.30) = 7 + 3 = 10, HP = 150
- ticks_to_die = ceil(150/8) = 19
- 19 > 15 -> Survivable. Player is comfortable in this zone.
- With a better weapon (Uncommon, weapon_power ~5-6): player_damage = 5, ticks_to_kill = 12, even safer.

This confirms the system creates meaningful gear pressure: you need to find upgrades to push zones comfortably.

**Pacing Target:**
- Act 1 (Levels 1-10): ~2-3 hours of idle time.
- Act 2 (Levels 11-20): ~5-8 hours of idle time.
- Total MVP content: ~7-11 hours of progression.

### 8.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Player enters a zone before recommended level | Allowed. They will die often and progress slowly. Auto-progression will eventually push them to appropriate zones. |
| Player is over-leveled for a zone | Enemies die quickly. Reduced relative XP but faster quest completion. |
| Boss encountered while under-leveled | Player dies, respawns, fights boss again after clearing more enemies/gaining XP. No lockout. |
| All quests in a zone complete but player stays | Enemies still spawn. Player can grind as long as desired. |
| Player reaches level 10 in Zone 1-1 | Over-leveled but progression still works. Boss quest gates Act 2 regardless. |
| Quest requires killing enemies that only spawn in a specific zone | Quest progress only counts kills of the named enemy type, regardless of zone. Enemy types are zone-bound, so the player must be in the correct zone. |
| Boss defeated but quest not yet accepted | Quests are auto-accepted on zone entry. Boss kill always counts. |

### 8.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| First 2 Acts | --> | Combat | Zone level determines enemy stats. Enemy modifiers are defined per-act. |
| First 2 Acts | <-- | Progression | Player level determines which zones are survivable |
| First 2 Acts | --> | Item & Rarity | Zone level determines item stat ranges for drops in that zone |
| First 2 Acts | <-- | Idle Mechanics | Zone progression continues while idle |
| First 2 Acts | <-- | Character Creation | Class choice affects how quickly a player can push into harder zones |

### 8.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `ZONE_LEVEL` (per zone) | See table | +/- 2 from defaults | **curve** | Drives all enemy/item scaling for that zone |
| `QUEST_KILL_COUNTS` | 5-15 | 3-25 | **curve** | How long quest completion takes. Affects pacing. |
| `ACT_COMPLETION_XP_MULTIPLIER` | 2 | 1-5 | **feel** | How rewarding act completion feels |
| `BOSS_RARITY_FLOOR` | Rare (tier 2) | Uncommon-Epic | **feel** | Minimum rarity of boss drops |
| `ENEMY_HP_MODIFIER` (per type) | See table | 0.5-2.0 | **curve** | Differentiates enemy archetypes |
| `ENEMY_DMG_MODIFIER` (per type) | See table | 0.5-2.0 | **curve** | Differentiates enemy archetypes |

### 8.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| AC-01 | Act 1 has exactly 4 zones | Zones 1-1 through 1-4 exist and are traversable in order |
| AC-02 | Act 2 has exactly 4 zones | Zones 2-1 through 2-4 exist and are traversable in order |
| AC-03 | Zone gating works | Player cannot enter Zone 1-2 until all Zone 1-1 quests are complete |
| AC-04 | Act gating works | Player cannot enter Zone 2-1 until The Bureaucratic Clerk boss quest is complete |
| AC-05 | Enemy modifiers apply correctly | A Line Cutter (0.7x HP, 1.3x DMG) in Zone 1-2 (zone_level 4) has HP = floor(60 * 0.7) = 42, DMG = ceil(8 * 1.3) = 11 |
| AC-06 | Quest auto-progression works | Kill quest "Kill 5 Ticket Holders" increments by 1 each time a Ticket Holder is killed, completing at 5 |
| AC-07 | Boss quest gates correctly | Defeating The Bureaucratic Clerk completes the boss quest and unlocks Act 2 |
| AC-08 | Act completion bonus is awarded | Completing Act 1 awards 3162 XP and 1000 gold |
| AC-09 | Milestone quest completes passively | "Reach Level 5" quest completes automatically when player reaches level 5, regardless of current zone |

---

## 9. Idle Mechanics

### 9.1 Overview

The idle system is what makes ChronoQueue an idle game. The entire game loop -- combat, looting, leveling, questing -- runs automatically whether the player is watching or not. When the player is offline, the game calculates what would have happened and applies the results. The player should never feel punished for being away.

### 9.2 Player Fantasy

"The player feels like a general who set a plan in motion when they return after a day away to find their character 5 levels higher with a full inventory of new loot, because the game respected their time by making meaningful progress without them."

### 9.3 Detailed Rules

**Online Tick Loop:**
The game processes one tick every `BASE_TICK_INTERVAL` seconds (modified by SPD). Each tick processes the full game state:

```
Tick Loop:
1. If IN_COMBAT:
   a. Player attacks enemy (damage formula).
   b. If enemy HP <= 0: transition to VICTORY.
   c. Else: enemy attacks player (flat damage).
   d. If player HP <= 0: transition to DEFEAT.
2. If IDLE:
   a. Decrement encounter_delay counter.
   b. If counter == 0: spawn enemy from zone table, transition to IN_COMBAT.
3. If VICTORY:
   a. Award XP. Check for level-up(s).
   b. Award gold.
   c. Roll for item drop. Process auto-loot.
   d. Increment quest progress (kill count, collection count).
   e. Check quest completion. If zone quests complete, unlock next zone.
   f. Transition to IDLE, set encounter_delay = ENCOUNTER_DELAY.
4. If DEFEAT:
   a. Restore HP to max.
   b. Increment death counter.
   c. Transition to IDLE, set encounter_delay = ENCOUNTER_DELAY.
```

**Effective Tick Interval:**

```
effective_tick_interval = BASE_TICK_INTERVAL / (1 + SPD / 100)
```

A player with SPD 20 ticks every 2.5 seconds instead of 3.0. The Idlemaster (high SPD) literally processes more game ticks per real-time second.

**Offline Progression:**
When the player reconnects after being offline:

1. Calculate offline duration: `offline_seconds = now - last_online_timestamp`
2. Cap at `MAX_OFFLINE_SECONDS`.
3. Calculate total offline ticks: `offline_ticks = floor(offline_seconds / effective_tick_interval)`
4. Run the **offline simulation** to determine results.

**Offline Simulation (Aggregate Method):**
Tick-by-tick simulation would be too expensive for long offline periods. Instead, use aggregate formulas:

```
# Determine average combat metrics at current power level
avg_ticks_per_kill = ceil(zone_enemy_hp / player_avg_damage)
avg_ticks_per_cycle = ENCOUNTER_DELAY + avg_ticks_per_kill + 1  # +1 for loot processing
can_survive = (player_max_hp / zone_enemy_dmg) >= avg_ticks_per_kill

if can_survive:
    total_kills = floor(offline_ticks / avg_ticks_per_cycle)
else:
    # Player dies sometimes. Estimate death rate.
    death_rate = max(0, 1 - (player_max_hp / (zone_enemy_dmg * avg_ticks_per_kill)))
    effective_kills = floor(offline_ticks / avg_ticks_per_cycle) * (1 - death_rate)
    total_kills = floor(effective_kills)
    total_deaths = floor(offline_ticks / avg_ticks_per_cycle) - total_kills

# Apply offline efficiency penalty
total_kills = floor(total_kills * OFFLINE_EFFICIENCY)

# Calculate rewards
offline_xp = total_kills * enemy_xp
offline_gold = total_kills * enemy_gold
offline_items = floor(total_kills * ITEM_DROP_CHANCE * OFFLINE_EFFICIENCY)
```

**Offline Item Generation:**
- Generate `offline_items` number of items using the Item & Rarity system.
- Each item rolls rarity normally (with LCK bonus).
- Auto-equip and auto-sell run on each generated item.

**Level-Up During Offline:**
- After calculating total offline XP, apply it to the character.
- Process level-ups sequentially: each level-up increases stats, which could change the damage calculation.
- For simplicity, the offline simulation uses the starting stats (before any level-ups) for the kill calculation, then applies all XP at once. This slightly underestimates offline progress, which is intentional (incentivizes checking in).

**Zone Progression During Offline:**
- Quest progress (kill counts, collection counts) increments with offline kills/items.
- If quest completions would unlock the next zone, the simulation advances to the next zone and continues.
- Multi-zone offline progression is supported but capped at 1 act boundary per offline session (boss quest completion does NOT auto-start the next act offline -- the player must be online to see the act transition narrative).

### 9.4 Formulas

**Effective Tick Interval:**

```
effective_tick_interval = BASE_TICK_INTERVAL / (1 + SPD / 100)
```

| Constant | Value |
|----------|-------|
| BASE_TICK_INTERVAL | 3.0 seconds |
| OFFLINE_EFFICIENCY | 0.90 |
| MAX_OFFLINE_SECONDS | 2,592,000 (30 days) |

**Worked example (Idlemaster, Level 15, offline for 8 hours):**
- SPD: 7 + floor(14 * 3 * 0.30) = 7 + 12 = 19
- effective_tick_interval = 3.0 / (1 + 19/100) = 3.0 / 1.19 = 2.52 seconds
- offline_seconds = 28,800 (8 hours)
- offline_ticks = floor(28,800 / 2.52) = 11,428 ticks

Assume in Zone 2-2 (zone_level 14):
- STR: 4 + floor(14 * 3 * 0.15) = 4 + 6 = 10
- INT: 4 + floor(14 * 3 * 0.15) = 4 + 6 = 10
- Best weapon: assume Rare magical, weapon_power = floor(14 * 2 * 1.6) = 44 (high estimate)
- Wait, let me be more realistic: weapon_power ~30 (accounting for variance and not always having best possible)
- player_avg_damage = floor(10 * 30 / 10) = 30 (no crits for offline)
- zone_enemy_hp = 14 * 15 = 210
- avg_ticks_per_kill = ceil(210 / 30) = 7
- zone_enemy_dmg = ceil(14 * 2) = 28
- VIT: 4 + floor(14 * 3 * 0.15) = 4 + 6 = 10, HP = 150
- ticks_to_die = ceil(150 / 28) = 6
- can_survive = 6 >= 7? NO. Player dies in this zone (barely).
- death_rate = max(0, 1 - (150 / (28 * 7))) = 1 - (150/196) = 1 - 0.765 = 0.235
- total_cycle_attempts = floor(11,428 / (1 + 7 + 1)) = floor(11,428 / 9) = 1,269
- effective_kills = 1,269 * (1 - 0.235) = 1,269 * 0.765 = 970
- After offline efficiency: floor(970 * 0.9) = 873 kills

This Idlemaster at level 15 in Zone 2-2 takes some deaths but still progresses well thanks to high SPD giving more ticks. Compare with a Chronoknight:

**Chronoknight, Level 15, same 8 hours offline:**
- SPD: 4 + floor(14 * 3 * 0.15) = 4 + 6 = 10
- effective_tick_interval = 3.0 / 1.10 = 2.73 sec
- offline_ticks = floor(28,800 / 2.73) = 10,549
- STR: 7 + floor(14 * 3 * 0.30) = 7 + 12 = 19
- weapon_power ~30
- player_avg_damage = floor(19 * 30 / 10) = 57
- ticks_to_kill = ceil(210 / 57) = 4
- VIT: 7 + floor(14 * 3 * 0.30) = 7 + 12 = 19, HP = 285
- ticks_to_die = ceil(285/28) = 11
- can_survive = 11 >= 4? YES!
- total_kills = floor(10,549 / (1+4+1)) * 0.9 = floor(1,758 * 0.9) = 1,582 kills

Chronoknight: 1,582 kills. Idlemaster: 873 kills. The Chronoknight has better raw combat throughput, but the Idlemaster compensates with higher LCK (better drop quality) and more total ticks from SPD.

Class differentiation is working as designed.

**Notification Triggers:**
The game does not send push notifications in MVP. Future enhancement. The "notification" is the state the player sees on return:

- Level-up summary: "You gained X levels while away!"
- Loot summary: "Y items collected. Z auto-equipped. W auto-sold for G gold."
- Quest progress: "Completed Q quests."
- Deaths: "Your character died D times but kept fighting."

### 9.5 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Offline for 0 seconds | No offline calculation. Resume normal tick loop. |
| Offline for exactly MAX_OFFLINE_SECONDS | Full 30-day calculation runs. |
| Offline for > 30 days | Capped at 30 days of offline ticks. |
| Player was mid-combat when going offline | Abandon the current fight. Offline simulation starts fresh from IDLE state. |
| Zone unlocks during offline but boss zone reached | Offline simulation processes zone transitions. Stops at act boss -- does not auto-defeat boss offline. Player must be online for boss encounters. |
| Player level-up during offline changes combat ability | Offline simulation uses pre-offline stats for all calculations. Level-ups and stat gains are applied as a batch after simulation. Intentionally conservative. |
| Offline calculation produces more items than inventory capacity | Auto-equip and auto-sell run per item. Excess items beyond inventory capacity are auto-sold. |
| Server clock manipulation | Use server-side timestamps only. Client time is never trusted. |
| Multiple login sessions | Last session's last_online_timestamp is authoritative. Previous sessions are invalidated. |

### 9.6 Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Idle Mechanics | <-> | Combat | Tick loop drives combat. Offline uses aggregate combat math. |
| Idle Mechanics | --> | Progression | Offline XP feeds into progression system. |
| Idle Mechanics | --> | Item & Rarity | Offline generates item drops. |
| Idle Mechanics | --> | Inventory | Offline triggers auto-equip and auto-sell. |
| Idle Mechanics | <-> | First 2 Acts | Offline progresses through zones and quests. Act bosses gate offline progression. |
| Idle Mechanics | <-- | Character Creation | SPD stat directly affects tick rate and offline tick count. |

### 9.7 Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `BASE_TICK_INTERVAL` | 3.0 sec | 1.0-5.0 sec | **feel** | Core game speed. Lower = more action visible. Higher = more idle-like. |
| `OFFLINE_EFFICIENCY` | 0.90 | 0.50-1.00 | **curve** | Incentive to be online. 1.0 = no penalty. 0.5 = half efficiency offline. |
| `MAX_OFFLINE_SECONDS` | 2,592,000 | 604,800-5,184,000 | **gate** | 7 days to 60 days. Controls max AFK benefit. |
| `ENCOUNTER_DELAY` | 1 tick | 0-3 ticks | **feel** | Breathing room between fights. |

### 9.8 Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| ID-01 | Online tick rate matches formula | Player with SPD 0 has exactly 3.0 second tick interval. Player with SPD 50 has 3.0/1.5 = 2.0 second interval. |
| ID-02 | Offline XP calculation is correct | Player offline 1 hour, zone_level 5, 582 calculated kills -> offline_xp = 582 * 35 = 20,370 |
| ID-03 | Offline efficiency applies | Offline kills are exactly floor(raw_kills * 0.90) |
| ID-04 | 30-day cap enforced | Player offline 45 days receives rewards for exactly 30 days |
| ID-05 | Level-ups apply after offline | Player gaining enough XP for 3 levels offline sees all 3 level-ups and stat increases on return |
| ID-06 | Offline items generate correctly | Number of items = floor(kills * ITEM_DROP_CHANCE * OFFLINE_EFFICIENCY). Each item has valid rarity and stats. |
| ID-07 | Boss encounters block offline progression | Offline simulation reaching a boss zone does not auto-defeat the boss. Quest progress stops at the boss quest. |
| ID-08 | Return summary is accurate | Displayed summary matches actual XP gained, items collected, levels gained, and gold earned |

---

## Appendix A: Global Constants Reference

All tuning knobs in one place for quick reference.

| Constant | Value | System | Category |
|----------|-------|--------|----------|
| STARTING_STAT_BUDGET | 25 | Character Creation | curve |
| NAME_MAX_LENGTH | 20 | Character Creation | feel |
| HP_PER_VIT | 15 | Combat | feel |
| MIN_DAMAGE | 1 | Combat | feel |
| CRIT_MULTIPLIER | 1.5 | Combat | feel |
| ENEMY_HP_PER_LEVEL | 15 | Combat | curve |
| ENEMY_DMG_PER_LEVEL | 2.0 | Combat | curve |
| ENEMY_BASE_XP | 10 | Combat | curve |
| ENEMY_XP_PER_LEVEL | 5 | Combat | curve |
| ENEMY_BASE_GOLD | 5 | Combat | curve |
| ENEMY_GOLD_PER_LEVEL | 3 | Combat | curve |
| ENCOUNTER_DELAY | 1 tick | Combat / Idle | feel |
| BOSS_HP_MULTIPLIER | 3 | Combat | gate |
| BOSS_DMG_MULTIPLIER | 1.5 | Combat | gate |
| BOSS_SPAWN_RATE | 0.20 | Combat / Acts | gate |
| BOSS_XP_MULTIPLIER | 10 | Combat | gate |
| BOSS_GOLD_MULTIPLIER | 10 | Combat | gate |
| XP_EXPONENT | 1.5 | Progression | curve |
| BASE_XP | 50 | Progression | curve |
| STAT_POINTS_PER_LEVEL | 3 | Progression | curve |
| LEVEL_CAP | 50 | Progression | gate |
| ITEM_DROP_CHANCE | 0.25 | Item & Rarity | feel |
| LCK_RARITY_BONUS | 0.01 | Item & Rarity | curve |
| ITEM_STAT_PER_LEVEL | 2 | Item & Rarity | curve |
| ITEM_VARIANCE | 0.10 | Item & Rarity | feel |
| BOSS_RARITY_FLOOR | 2 (Rare) | Item & Rarity | gate |
| INVENTORY_MAX_SLOTS | 50 | Inventory | gate |
| SELL_MULTIPLIER | 1 | Inventory | curve |
| BASE_TICK_INTERVAL | 3.0 sec | Idle | feel |
| OFFLINE_EFFICIENCY | 0.90 | Idle | curve |
| MAX_OFFLINE_SECONDS | 2,592,000 | Idle | gate |

---

## Appendix B: Pacing Simulation

**Scenario: Chronoknight, zero player input, Acts 1-2 complete playthrough.**

| Milestone | Est. Level | Est. Time (Idle) | Notes |
|-----------|-----------|-------------------|-------|
| Zone 1-1 complete | 3 | ~10 min | Tutorial pace. Fast kills, quick levels. |
| Zone 1-2 complete | 5 | ~30 min | First gear pressure. Need weapon upgrade. |
| Zone 1-3 complete | 8 | ~1.5 hr | Steady grind. Items matter now. |
| Act 1 Boss defeated | 10 | ~2.5 hr | Boss is a spike. May die 1-2 times. |
| Zone 2-1 complete | 13 | ~4 hr | New act, tougher enemies, better loot. |
| Zone 2-2 complete | 16 | ~6.5 hr | Mid-act. Class identity clearly felt. |
| Zone 2-3 complete | 18 | ~9 hr | Endgame of MVP content approaching. |
| Act 2 Boss defeated | 20 | ~11 hr | Final boss. Significant challenge. |

**Total MVP content: ~11 hours of idle progression for a Chronoknight.**

Faster classes (Timestomper) may clear in ~9 hours. Slower but luckier classes (Loot Gremlin) may take ~14 hours but with significantly better gear.

---

## Appendix C: Design Decisions Pending Review

The following decisions were made based on design judgment and are flagged for Creative Director / board review:

1. **No manual stat allocation in MVP.** Stats grow automatically by class weights. Rationale: keeps the idle loop clean. Manual allocation creates a decision backlog for AFK players. *Alternative: allow manual allocation with an "auto-distribute" toggle.*

2. **6 classes, no restrictions on equipment.** Any class can equip any item. Rationale: simplifies the item system and avoids "useless drop" frustration. *Alternative: class-restricted weapons with more targeted drops.*

3. **Offline efficiency at 90%.** Slight incentive to be online without punishing absence. *Alternative: 100% (no penalty) or 80% (stronger incentive).*

4. **Boss encounters require online presence.** Offline simulation stops at boss quests. Rationale: boss kills are milestone moments worth experiencing. *Alternative: auto-defeat bosses offline if player is strong enough.*

7. **HP_PER_VIT set to 15 (not 10).** Higher VIT scaling ensures most classes can survive zone-appropriate content. At 10, even balanced classes died in boss zones. At 15, balanced classes survive comfortably, glass cannons need gear investment, and tanks feel distinctly tanky. *Can be tuned post-playtest.*

8. **Boss multipliers reduced to 3x HP, 1.5x DMG (from 5x/2x).** Original values made bosses mathematically unsurvivable at level-appropriate gear. New values create tight but winnable fights for on-level characters with decent equipment. Glass cannons may need to over-level by 2-3 levels or find better gear. *Boss spawn rate of 20% ensures natural grinding between attempts.*

5. **Parody tone in enemy/zone names.** Names like "Line Cutter" and "Bureaucratic Clerk" lean into the queue theme. *Pending Creative Director tone guide for final naming pass.*

6. **XP exponent of 1.5.** Creates a gentle-to-moderate curve. Lower than many RPGs (typically 1.8-2.0) because idle games need faster early pacing. *Can be adjusted after playtest data.*

---

*End of GDD v1. This document is the single source of truth for ChronoQueue MVP systems until superseded by v2.*
