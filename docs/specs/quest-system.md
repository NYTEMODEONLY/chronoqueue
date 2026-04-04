# Quest System Spec

**Version:** 2.0 (formalizes quest subsystem from GDD-v1 Section 8)
**Author:** Lead Game Designer, VOID Studios
**Date:** 2026-04-04
**Status:** Draft -- Pending board review
**Loop Target:** Short Loop (5-15 minutes)
**Pillars Served:** Pillar 1 (Zero-Pressure Play), Pillar 3 (Joy of Watching), Pillar 2 (Parody With Substance)

---

## 1. Overview

Quests are the punctuation marks in ChronoQueue's idle flow. They wrap sequences of micro-loop events (combat ticks, loot drops) into short narratives with setup, escalation, and resolution. A quest completing is the moment the player notices "something finished" -- it's the main reward spike in the Short Loop.

The quest system runs entirely autonomously: quests auto-accept, auto-progress, and auto-complete. When the player is present, they can choose their next quest from 2-3 options. When absent, the system picks for them. Both paths must feel good.

---

## 2. Player Fantasy

"The player feels like they opened a book to find someone bookmarked the good parts when they return to see quests completed in the log, because each quest title is a tiny joke and each completion brought real rewards -- and there are more quests already underway."

This serves the **Primary Fantasy** (amused keeper of chaotic adventures) and the **Tertiary Fantasy** (returning to a backlog of completed stories).

---

## 3. Detailed Rules

### 3.1 Quest Structure

Every quest has these fields:

| Field | Type | Description |
|-------|------|-------------|
| `quest_id` | string | Unique identifier |
| `title` | string | Display name (humorous, per Tone Guide) |
| `type` | enum | `kill`, `collection`, `milestone`, `boss` |
| `zone_id` | string | Zone where this quest is relevant |
| `description` | string | Flavor text describing the objective |
| `objective_target` | int/string | Kill count, item count, level number, or boss enemy_id |
| `objective_current` | int | Current progress toward target |
| `reward_xp` | int | XP awarded on completion |
| `reward_gold` | int | Gold awarded on completion |
| `reward_item_tier_floor` | int or null | Minimum rarity tier of guaranteed item drop (null = no guaranteed item) |
| `prerequisite_quest_ids` | string[] | Quests that must be completed first |
| `priority` | int | Auto-assign priority (higher = picked first for AFK) |
| `is_variant` | boolean | Whether this quest is a Rare Quest Variant (default: false) |
| `variant_reward_multiplier` | float | Reward multiplier for variants (default: 1.0; variants use 1.5) |
| `status` | enum | `locked`, `available`, `active`, `complete` |

### 3.2 Quest Types

| Type | Mechanic | Objective | Auto-Progress |
|------|----------|-----------|---------------|
| **Kill** | Defeat N enemies of specified type (or any type in zone) | Counter increments on valid kill | Yes -- every enemy kill checks quest conditions |
| **Collection** | Collect N items (any rarity) while in the quest's zone | Counter increments on item drop | Yes -- every item drop checks quest conditions |
| **Milestone** | Reach level N | Counter is current player level | Yes -- level-up checks milestone quests |
| **Boss** | Defeat the named boss enemy | Binary: boss defeated or not | Yes -- boss kill checks quest conditions |

### 3.3 Quest Lifecycle

```
LOCKED --> AVAILABLE --> ACTIVE --> COMPLETE
```

- **LOCKED:** Prerequisites not yet met. Quest is invisible to the player.
- **AVAILABLE:** Prerequisites met. Quest appears in the quest selection pool.
- **ACTIVE:** Quest is being tracked. Progress counts. Maximum 1 active quest per zone.
- **COMPLETE:** Objective met. Rewards distributed. Unlocks dependent quests.

**State transitions:**
1. `LOCKED -> AVAILABLE`: When all `prerequisite_quest_ids` have status `COMPLETE`.
2. `AVAILABLE -> ACTIVE`: When auto-assigned or player-selected.
3. `ACTIVE -> COMPLETE`: When `objective_current >= objective_target` (kill/collection), `player_level >= objective_target` (milestone), or boss defeated (boss).

### 3.4 Auto-Assign Logic (AFK Mode)

When the current active quest completes and the player is not present, the system auto-assigns the next quest:

```
1. Get all quests with status = AVAILABLE in the current zone.
2. If none available in current zone, check the next zone (if unlocked).
3. Sort by priority (descending).
4. Select the highest-priority quest.
5. Set its status to ACTIVE.
```

**Priority Assignment by Type:**

| Type | Base Priority | Notes |
|------|--------------|-------|
| Boss | 100 | Always last -- requires all other zone quests complete |
| Milestone | 30 | Passive -- completes alongside other quests |
| Kill | 20 | Primary combat quest |
| Collection | 10 | Secondary -- item drops happen passively during kill quests |

**Auto-assign tie-breaking:** If two quests have the same priority, pick the one with the lower `quest_id` (deterministic ordering).

**Why this order matters:** Kill quests advance combat engagement, which produces item drops that satisfy collection quests in parallel. Milestones track passively. Boss quests come last because they're gate checks that require the player to be sufficiently powered.

### 3.5 Player Choice Layer (Active Mode)

When the player is present and a quest completes:

```
1. Pause auto-assign for CHOICE_WINDOW_DURATION seconds.
2. Display 2-3 available quests from the current (or next) zone.
3. Player selects one. It becomes ACTIVE.
4. If player does not select within CHOICE_WINDOW_DURATION: auto-assign kicks in.
```

**Quest Selection Pool:**
- Pull up to 3 available quests, ordered by priority.
- If fewer than 2 quests are available, skip the choice UI entirely and auto-assign.
- Display each quest with: title, type icon, objective summary, reward preview.

**Choice Architecture:**
- Choices are meaningful but not punishing (Core Loop doc: "A bad build choice slows you down; it doesn't brick your save").
- All quests in the pool will eventually need to be completed. The choice is about *order*, not *exclusion*.
- The player is choosing "what do I want to progress toward right now?" not "which quest do I permanently skip?"

**Worked Example (Zone 1-2 "The Middle-ish Area"):**

Player completes "Cutting in Line" (Kill 8 Line Cutters). Three quests become available:
1. "Queue Discipline" -- Kill 5 Queue Guardians (Kill, priority 20)
2. "Gearing Up" -- Collect 3 items (Collection, priority 10)
3. "Getting Somewhere" -- Reach Level 5 (Milestone, priority 30)

Player sees these 3 options. If they select "Queue Discipline," they focus on killing Queue Guardians. Meanwhile, "Getting Somewhere" tracks passively in the background (milestone quests auto-complete when the level condition is met, regardless of whether they're the active quest).

If player is AFK: auto-assign picks "Getting Somewhere" (highest priority, 30). This is optimal because milestones complete passively while the player fights anything.

**Important:** Milestone quests are special -- they complete based on a global condition (player level) regardless of active quest status. The "active" designation for milestones only affects whether the completion notification is prominent vs. background.

### 3.6 Quest Generation Grammar (for Future Acts)

Acts 1 and 2 have hand-authored quest slates (see GDD-v1 Section 8.3). For Acts 3+ and procedural content, quests are generated using this grammar:

**Every zone generates a quest slate of 3-4 quests:**

| Slot | Type | Objective Formula | Notes |
|------|------|-------------------|-------|
| 1 | Kill (specific) | `QUEST_BASE_KILL_COUNT + (zone_level * QUEST_KILL_SCALING)` enemies of a named type | Primary combat engagement |
| 2 | Kill (any) or Collection | Kill: `QUEST_BASE_KILL_COUNT + (zone_level * QUEST_KILL_SCALING)` any enemy. Collection: `QUEST_BASE_COLLECT_COUNT + floor(zone_level * QUEST_COLLECT_SCALING)` items | Variety slot |
| 3 | Milestone | Reach level `zone_recommended_level` | Passive progress check |
| 4 (optional, boss zones only) | Boss | Defeat zone boss | Gate quest |

| Constant | Value | Safe Range |
|----------|-------|------------|
| QUEST_BASE_KILL_COUNT | 5 | 3-10 |
| QUEST_KILL_SCALING | 0.5 | 0.3-1.0 |
| QUEST_BASE_COLLECT_COUNT | 2 | 1-5 |
| QUEST_COLLECT_SCALING | 0.2 | 0.1-0.5 |

**Worked example (Zone 3-2, zone_level 24):**
- Slot 1: Kill 5 + floor(24 * 0.5) = Kill 17 [enemy_name]
- Slot 2: Collect 2 + floor(24 * 0.2) = Collect 6 items
- Slot 3: Reach Level 24
- No boss (not a boss zone)

**Quest Naming (Tone Guide compliance):**

Quest titles are generated from templates per quest type:

**Kill Quest Templates:**
- "Disperse {count} {enemy_plural}"
- "The {enemy_name} Problem"
- "{zone_theme} Pest Control"
- "Thin the {enemy_plural}"
- "A Reasonable Request ({count} {enemy_plural})"

**Collection Quest Templates:**
- "Finder's Fee ({count} items)"
- "Spoils of {zone_name}"
- "Equip Yourself, Voluntarily"
- "Looting for Fun and Profit"

**Milestone Quest Templates:**
- "Growing Pains (Level {level})"
- "Professional Development"
- "Are You This Tall? (Level {level})"
- "Experience Required"

**Boss Quest Templates:**
- "Defeat {boss_name}"
- "The {boss_name} Problem"
- "An Appointment with {boss_name}"

### 3.7 Reward Tables

**Kill Quest Rewards:**

```
reward_xp = objective_target * zone_enemy_xp * KILL_QUEST_XP_MULTIPLIER
reward_gold = objective_target * zone_enemy_gold * KILL_QUEST_GOLD_MULTIPLIER
```

| Constant | Value |
|----------|-------|
| KILL_QUEST_XP_MULTIPLIER | 0.5 |
| KILL_QUEST_GOLD_MULTIPLIER | 0.5 |

**Worked example (Kill 10 enemies in Zone 1-3, zone_level 7):**
- enemy_xp = 10 + (7 * 5) = 45
- enemy_gold = 5 + (7 * 3) = 26
- reward_xp = 10 * 45 * 0.5 = 225 XP
- reward_gold = 10 * 26 * 0.5 = 130 gold
- This is equivalent to ~5 extra kills as a completion bonus.

**Collection Quest Rewards:**

```
reward_xp = 0  (collection quests reward gold, not XP)
reward_gold = objective_target * zone_level * COLLECT_QUEST_GOLD_PER_ITEM
```

| Constant | Value |
|----------|-------|
| COLLECT_QUEST_GOLD_PER_ITEM | 10 |

**Worked example (Collect 3 items in Zone 1-1, zone_level 2):**
- reward_gold = 3 * 2 * 10 = 60 gold

**Milestone Quest Rewards:**

```
reward_xp = 0  (player already gained XP to reach the level)
reward_gold = 0
reward_item_tier_floor = 2  (guaranteed Rare+ item drop)
```

Milestone quests always guarantee a Rare or better item. This creates a meaningful "present" at level checkpoints.

**Boss Quest Rewards:**

Boss kill rewards are already high (GDD-v1: 10x XP, 10x gold). The quest itself adds:

```
reward_xp = xp_to_next_level(act_max_level) * ACT_COMPLETION_XP_MULTIPLIER
reward_gold = act_max_level * ACT_COMPLETION_GOLD_PER_LEVEL
reward_item_tier_floor = 3  (guaranteed Epic+ item drop)
```

| Constant | Value |
|----------|-------|
| ACT_COMPLETION_XP_MULTIPLIER | 2 |
| ACT_COMPLETION_GOLD_PER_LEVEL | 100 |

**Worked example (Act 1 Boss, act_max_level = 10):**
- reward_xp = 1581 * 2 = 3162 XP
- reward_gold = 10 * 100 = 1000 gold
- Plus guaranteed Epic+ item drop
- This is in addition to the boss's own kill rewards (350 XP, 200 gold)

### 3.8 Rare Quest Variants

Rare Quest Variants are enhanced versions of standard quests that create "screenshot moments" — the player sees something unexpected and wants to share it. They serve the board directive for more talking points and social sharing, and directly serve the **Primary Fantasy** (surprise and discovery) and **Tertiary Fantasy** (returning to find something unusual happened).

**Trigger:**

When generating the quest selection pool (Section 3.5), each available quest has a `VARIANT_CHANCE` (default 10%) probability of being promoted to a variant. The variant roll happens per-quest independently. Variant promotion replaces the quest's standard title with a variant title template and applies the reward multiplier.

```
for each quest in selection_pool:
    variant_roll = random(0, 1)
    if variant_roll < VARIANT_CHANCE:
        quest.is_variant = true
        quest.title = random(variant_title_templates[quest.type])
        quest.variant_reward_multiplier = VARIANT_REWARD_MULTIPLIER
        quest.priority += VARIANT_PRIORITY_BONUS
```

**Variant Properties:**
- Same quest type, objective, and zone as the standard version.
- Enhanced title from the variant title template pool (noticeably funnier/more dramatic).
- Boosted rewards: XP and gold multiplied by `variant_reward_multiplier` (default 1.5 = +50%).
- For quests with `reward_item_tier_floor`: rarity floor bumped by 1 tier (Rare → Epic, Epic → Legendary). Legendary is the cap — no bump beyond it.
- Priority bonus of +10 for auto-assign (variants should be picked preferentially).

**Variant Title Templates:**

Variant titles are noticeably different from standard templates. The player should immediately recognize "this is a special quest." Titles are longer, more dramatic, and lean harder into the bureaucratic humor.

**Kill Quest Variant Templates** (11 entries):
- "The {enemy_name} Situation Has Escalated"
- "An Unreasonable Number of {enemy_plural}"
- "{zone_theme} Pest Control: The Reckoning"
- "This Time It's Personnel (Disperse {count} {enemy_plural})"
- "The {enemy_name} Problem: Management Is Aware"
- "Mandatory Overtime: {count} {enemy_plural}"
- "{count} {enemy_plural} and a Strongly Worded Letter"
- "Operation: Thin the {enemy_plural} (With Extreme Prejudice)"
- "The {enemy_plural} Have Unionized"
- "A Formal Complaint ({count} {enemy_plural})"
- "Severance Package for {count} {enemy_plural}"

**Collection Quest Variant Templates** (10 entries):
- "Finder's Fee ({count} items, and Yes We Counted)"
- "Loot and Found (The Premium Collection)"
- "A Suspicious Quantity of Items ({count})"
- "Equip Yourself, Aggressively"
- "Inventory Audit: {count} Items Unaccounted For"
- "The Lost and Found Has Opinions ({count} items)"
- "Requisition {count} Items Before They're Requisitioned From You"
- "Asset Recovery: Priority Clearance"
- "Finders Keepers (Company Policy, Apparently)"
- "Spoils of {zone_name}: Collector's Edition"

**Milestone Quest Variant Templates** (10 entries):
- "Growing Pains: The Extended Director's Cut (Level {level})"
- "Professional Development: Expedited Track"
- "Are You This Tall Yet? (Seriously, Level {level})"
- "The Performance Improvement Plan (Level {level})"
- "Accelerated Career Path (Level {level})"
- "Your Potential Has Been Flagged (Level {level})"
- "Level {level}: This Goes on Your Permanent Record"
- "Mandatory Growth (Level {level})"
- "Exit Velocity Required: Level {level}"
- "The Board Has Taken Notice (Level {level})"

**Boss Quest Variant Templates** (10 entries):
- "An Urgent Appointment with {boss_name}"
- "{boss_name}: This Has Been Escalated"
- "The {boss_name} Situation (Priority: Immediate)"
- "Defeat {boss_name} (They Were Warned)"
- "{boss_name}'s Final Performance Review"
- "A Meeting with {boss_name} That Could've Been an Email"
- "Executive Action Required: {boss_name}"
- "The {boss_name} Incident: Resolution Phase"
- "Termination of {boss_name}'s Contract"
- "Your 3 O'Clock with {boss_name}"

**Complete Variant Examples:**

**Example 1 — Kill Variant (Zone 1-3):**

| Field | Standard | Variant |
|-------|----------|---------|
| Title | "Thin the Overtime Ogres" | "The Overtime Ogre Situation Has Escalated" |
| Type | Kill | Kill |
| Objective | Kill 10 Overtime Ogres | Kill 10 Overtime Ogres |
| Description | "The Overtime Ogres refuse to clock out." | "The Overtime Ogres have filed a counter-complaint. Dispatch 10 before HR gets involved." |
| reward_xp | 225 | 338 (225 × 1.5) |
| reward_gold | 130 | 195 (130 × 1.5) |
| is_variant | false | true |
| variant_reward_multiplier | 1.0 | 1.5 |
| priority | 20 | 30 (20 + 10 bonus) |

**Example 2 — Collection Variant (Zone 1-1):**

| Field | Standard | Variant |
|-------|----------|---------|
| Title | "Finder's Fee (3 items)" | "A Suspicious Quantity of Items (3)" |
| Type | Collection | Collection |
| Objective | Collect 3 items | Collect 3 items |
| Description | "Pick up what others have dropped." | "Three items are unaccounted for. Accounting has questions." |
| reward_xp | 0 | 0 |
| reward_gold | 60 | 90 (60 × 1.5) |
| is_variant | false | true |
| variant_reward_multiplier | 1.0 | 1.5 |
| priority | 10 | 20 (10 + 10 bonus) |

**Example 3 — Milestone Variant (Level 5):**

| Field | Standard | Variant |
|-------|----------|---------|
| Title | "Growing Pains (Level 5)" | "The Performance Improvement Plan (Level 5)" |
| Type | Milestone | Milestone |
| Objective | Reach Level 5 | Reach Level 5 |
| Description | "Growth is inevitable." | "Your quarterly review is in. The numbers suggest you should be Level 5 by now." |
| reward_xp | 0 | 0 |
| reward_gold | 0 | 0 |
| reward_item_tier_floor | 2 (Rare+) | 3 (Epic+, bumped from Rare) |
| is_variant | false | true |
| variant_reward_multiplier | 1.5 | 1.5 |
| priority | 30 | 40 (30 + 10 bonus) |

**Example 4 — Boss Variant (Act 1 Boss):**

| Field | Standard | Variant |
|-------|----------|---------|
| Title | "Defeat the Queue Warden" | "The Queue Warden's Final Performance Review" |
| Type | Boss | Boss |
| Objective | Defeat Queue Warden | Defeat Queue Warden |
| Description | "The Queue Warden controls passage." | "The Queue Warden's contract is up for review. The review is you." |
| reward_xp | 3162 | 4743 (3162 × 1.5) |
| reward_gold | 1000 | 1500 (1000 × 1.5) |
| reward_item_tier_floor | 3 (Epic+) | 4 (Legendary+, bumped from Epic) |
| is_variant | false | true |
| variant_reward_multiplier | 1.0 | 1.5 |
| priority | 100 | 110 (100 + 10 bonus) |

**Example 5 — Kill Variant (Zone 2-1, Generated):**

| Field | Standard | Variant |
|-------|----------|---------|
| Title | "Disperse 12 Time Clerks" | "Mandatory Overtime: 12 Time Clerks" |
| Type | Kill | Kill |
| Objective | Kill 12 Time Clerks | Kill 12 Time Clerks |
| Description | "The Time Clerks are behind schedule." | "The Time Clerks have been put on mandatory overtime. They are not handling it well. Disperse 12." |
| reward_xp | 420 | 630 (420 × 1.5) |
| reward_gold | 240 | 360 (240 × 1.5) |
| is_variant | false | true |
| variant_reward_multiplier | 1.0 | 1.5 |
| priority | 20 | 30 (20 + 10 bonus) |

**Auto-Assign Behavior:**

Variants receive a `VARIANT_PRIORITY_BONUS` of +10 to their base priority. This means:
- A variant Kill quest (priority 30) beats a standard Milestone quest (priority 30) via tie-breaking.
- A variant Milestone quest (priority 40) beats a standard Boss quest (priority 100)? No — Boss quests still dominate at 100. Variant bonus is additive, not multiplicative.
- The priority bonus ensures variants are picked preferentially among quests of similar tier, without overriding the natural type ordering.

**Variant Display:**

When a variant quest appears in the choice window or quest log, it is visually distinguished:
- Title text uses a unique color (gold/amber, distinct from rarity colors).
- A small "★ Rare Quest" badge appears next to the title.
- The reward preview explicitly shows the boosted values.
- In the offline summary, variant completions are called out: "★ Completed rare quest: [title]"

---

## 4. Formulas

### 4.1 Quest Completion Time Estimate

How long a quest takes to complete, for pacing verification:

```
# Kill quest
ticks_per_kill = ceil(zone_enemy_hp / player_damage) + ENCOUNTER_DELAY + 1
total_ticks = objective_target * ticks_per_kill
estimated_seconds = total_ticks * effective_tick_interval

# Collection quest
kills_per_item = ceil(1 / ITEM_DROP_CHANCE)  // = 4 at 25% drop rate
total_kills_needed = objective_target * kills_per_item
total_ticks = total_kills_needed * ticks_per_kill
estimated_seconds = total_ticks * effective_tick_interval
```

**Worked example (Kill 10 in Zone 1-2, Chronoknight Lv.5):**
- ticks_per_kill = ceil(60/4) + 1 + 1 = 17 ticks
- total_ticks = 10 * 17 = 170 ticks
- effective_tick_interval = 3.0 / 1.04 = 2.88s
- estimated_seconds = 170 * 2.88 = 490 seconds = ~8.2 minutes
- This is within the Short Loop target of 5-15 minutes.

**Worked example (Collect 3 items in Zone 1-1, Chronoknight Lv.2):**
- kills_per_item = ceil(1/0.25) = 4
- total_kills_needed = 3 * 4 = 12
- ticks_per_kill = ceil(30/3) + 1 + 1 = 12 ticks (rough estimate)
- total_ticks = 12 * 12 = 144 ticks
- estimated_seconds = 144 * 2.94 = 423 seconds = ~7 minutes
- Also within Short Loop target.

### 4.2 Choice Window Timer

```
choice_available = (available_quests.length >= 2) AND (player_is_online)
if choice_available:
    display quest selection UI
    start timer = CHOICE_WINDOW_DURATION
    if player_selects: activate selected quest
    if timer expires: auto-assign per priority
```

| Constant | Value | Safe Range |
|----------|-------|------------|
| CHOICE_WINDOW_DURATION | 30 seconds | 15-60 seconds |

30 seconds is long enough for a casual player to notice and choose, short enough to not stall AFK flow significantly.

### 4.3 Variant Reward Calculation

```
if quest.is_variant:
    final_xp = floor(base_reward_xp * quest.variant_reward_multiplier)
    final_gold = floor(base_reward_gold * quest.variant_reward_multiplier)
    if quest.reward_item_tier_floor is not null:
        final_tier_floor = min(quest.reward_item_tier_floor + 1, LEGENDARY_TIER)
    quest.priority = base_priority + VARIANT_PRIORITY_BONUS
```

| Constant | Value | Safe Range |
|----------|-------|------------|
| VARIANT_CHANCE | 0.10 | 0.05-0.20 |
| VARIANT_REWARD_MULTIPLIER | 1.5 | 1.25-2.0 |
| VARIANT_PRIORITY_BONUS | 10 | 5-20 |
| LEGENDARY_TIER | 4 | (not tunable) |

**Worked example (Kill Variant, Zone 1-3, kill 10 enemies):**
- base_reward_xp = 10 * 45 * 0.5 = 225
- base_reward_gold = 10 * 26 * 0.5 = 130
- final_xp = floor(225 * 1.5) = 337
- final_gold = floor(130 * 1.5) = 195
- priority = 20 + 10 = 30
- Player receives ~50% more XP and gold for the same objective. The variant title signals this is special.

**Worked example (Milestone Variant, Level 5):**
- base_reward_xp = 0, base_reward_gold = 0 (milestone)
- reward_item_tier_floor = 2 (Rare) → min(2 + 1, 4) = 3 (Epic)
- Player receives a guaranteed Epic+ item instead of Rare+. This is the "screenshot moment" for milestones.

**Worked example (Boss Variant, Act 1):**
- base_reward_xp = 3162, base_reward_gold = 1000
- final_xp = floor(3162 * 1.5) = 4743
- final_gold = floor(1000 * 1.5) = 1500
- reward_item_tier_floor = 3 (Epic) → min(3 + 1, 4) = 4 (Legendary)
- This is the jackpot. A variant boss quest guarantees a Legendary+ drop. Extremely rare (~10% of an already-rare event) but when it happens, it's memorable.

---

## 5. Edge Cases

| Scenario | Behavior |
|----------|----------|
| No available quests in current zone | Check the next unlocked zone. If no quests anywhere, player is in end-of-content state. Display "All quests complete. New adventures coming soon." |
| Player selects a quest then goes AFK mid-quest | Quest remains active. Progress continues automatically. No change needed. |
| Only 1 quest available when choice would trigger | Skip the choice UI. Auto-assign the single quest immediately. |
| Kill quest requires specific enemy type not in current zone | Player must be in a zone that spawns that enemy type. If they're in the wrong zone, quest progress does not increment. The quest's `zone_id` field identifies where to go; the auto-assign system never assigns a quest for a different zone. |
| Milestone quest completes while a kill quest is active | Milestone quests complete passively regardless of active quest. Both the active kill quest and the passive milestone can complete in the same game state update. |
| Two quests complete in the same tick | Process completions sequentially by quest_id order. Each generates its own log entry and reward distribution. |
| Player returns from AFK with multiple quests completed offline | Display a summary: "Completed {n} quests while away: [list]. Rewards: {total_xp} XP, {total_gold} gold." |
| Boss quest activated but player is too weak | Player fights regular enemies in boss zone. Boss spawns at BOSS_SPAWN_RATE (20%). Player may die to boss, respawn, fight regulars, gain XP/gear, eventually defeat boss. No lockout. |
| Choice window opens but player disconnects | Timer expires, auto-assign activates. No stuck state. |
| Zone has 5+ available quests (future content) | Display top 3 by priority. Remaining quests are auto-assigned in subsequent rounds. |
| Quest reward would overflow gold/XP counters | Both use 64-bit integers. Not a practical concern within game scale. |
| Player completes a quest in a zone they've already cleared | Allowed. Quest progress and rewards function normally. Cleared zones still spawn enemies. |
| Only available quest is a variant | Normal behavior. The variant is displayed/assigned like any other quest. No special handling needed. |
| All 3 choice options are variants | Allowed. At 10% variant chance per quest, probability of all 3 being variants is 0.1% — rare but legal. Player sees three gold-highlighted quests. This is a good day. |
| Variant roll happens but quest pool has only 1 quest | Variant promotion still applies. The single quest becomes a variant. If the choice UI is skipped (< 2 quests), the variant is auto-assigned with its boosted rewards. |
| Variant boss quest would bump tier floor above Legendary | Tier floor is capped at Legendary (tier 4). No tier above Legendary exists. The cap applies silently. |
| Variant quest completes while player is offline | Variant rewards are calculated at completion time, not generation time. Offline summary shows variant marker: "★ Completed rare quest: [title]". |
| Same quest appears as variant in one session, standard in next | Variant promotion is rolled at generation time per quest selection event. A quest can be standard one time and variant the next. There is no persistence of variant status between selection events. |

---

## 6. Dependencies

| This System | Direction | Other System | Relationship |
|-------------|-----------|-------------|-------------|
| Quest | <-- | Combat | Enemy kills increment kill quest counters |
| Quest | <-- | Item System | Item drops increment collection quest counters |
| Quest | <-- | Progression | Level-ups complete milestone quests |
| Quest | --> | Progression | Quest completion rewards XP |
| Quest | --> | Item System | Milestone/boss quests grant guaranteed item drops |
| Quest | --> | First 2 Acts | Quest completion unlocks next zone; boss quests gate acts |
| Quest | <-> | Idle Mechanics | Quests progress offline; auto-assign runs offline; choice window is online-only |
| Quest | --> | Combat Log | Quest completion generates log entries |
| Quest | <-- | Tone Guide | Quest titles and descriptions follow voice guidelines |
| Quest (Variants) | --> | Item System | Variant milestone/boss quests bump guaranteed item rarity tier floor |
| Quest (Variants) | --> | Combat Log | Variant quest completion generates distinct "★ Rare Quest" log entries |

---

## 7. Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `CHOICE_WINDOW_DURATION` | 30 sec | 15-60 sec | **feel** | How long the player has to choose a quest before auto-assign kicks in |
| `KILL_QUEST_XP_MULTIPLIER` | 0.5 | 0.25-1.0 | **curve** | Completion bonus as proportion of raw kill XP |
| `KILL_QUEST_GOLD_MULTIPLIER` | 0.5 | 0.25-1.0 | **curve** | Completion bonus as proportion of raw kill gold |
| `COLLECT_QUEST_GOLD_PER_ITEM` | 10 | 5-25 | **curve** | Gold per collected item as quest reward |
| `ACT_COMPLETION_XP_MULTIPLIER` | 2 | 1-5 | **feel** | How rewarding act completion feels |
| `ACT_COMPLETION_GOLD_PER_LEVEL` | 100 | 50-200 | **feel** | Gold per level for act completion |
| `QUEST_BASE_KILL_COUNT` | 5 | 3-10 | **curve** | Base kill count for generated quests |
| `QUEST_KILL_SCALING` | 0.5 | 0.3-1.0 | **curve** | Kill count increase per zone level |
| `QUEST_BASE_COLLECT_COUNT` | 2 | 1-5 | **curve** | Base collection count |
| `QUEST_COLLECT_SCALING` | 0.2 | 0.1-0.5 | **curve** | Collection count increase per zone level |

### Variant Tuning Knobs

| Parameter | Default | Safe Range | Category | Notes |
|-----------|---------|------------|----------|-------|
| `VARIANT_CHANCE` | 0.10 | 0.05-0.20 | **feel** | Per-quest chance to become a variant during selection pool generation |
| `VARIANT_REWARD_MULTIPLIER` | 1.5 | 1.25-2.0 | **curve** | Multiplier applied to variant XP and gold rewards |
| `VARIANT_PRIORITY_BONUS` | 10 | 5-20 | **feel** | Priority bonus for auto-assign; keeps variants preferential without overriding type ordering |
| `VARIANT_TIER_BUMP` | 1 | 1 | **gate** | Number of rarity tiers to bump for variant item floor rewards. Fixed at 1 — do not tune above 1 or boss variants guarantee Mythic drops. |

---

## 8. Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| QS-01 | Quests auto-assign when player is AFK | On quest completion with no player input within CHOICE_WINDOW_DURATION, the highest-priority available quest becomes ACTIVE within 1 tick |
| QS-02 | Choice window shows 2-3 options | When player is online and 2+ quests are available, a selection UI appears within 1 tick of quest completion |
| QS-03 | Choice window expires to auto-assign | If player does not select within 30 seconds, auto-assign activates |
| QS-04 | Kill quest increments correctly | Killing a Ticket Holder increments "Kill 5 Ticket Holders" by 1. Killing a Line Cutter does not increment it. |
| QS-05 | Collection quest increments correctly | Receiving an item drop in Zone 1-1 while "Collect 2 items" is active increments by 1. Drops in other zones do not count. |
| QS-06 | Milestone quests complete passively | "Reach Level 5" completes immediately when player reaches level 5, regardless of which quest is currently active |
| QS-07 | Boss quest gates act transition | Completing the boss quest in Zone 1-4 unlocks Zone 2-1 |
| QS-08 | Kill quest reward matches formula | Kill 10 in Zone 1-3 (zone_level 7): reward_xp = 10 * 45 * 0.5 = 225, reward_gold = 10 * 26 * 0.5 = 130 |
| QS-09 | Milestone quest grants Rare+ item | Completing a milestone quest triggers an item drop with rarity >= Rare (tier 2) |
| QS-10 | Boss quest grants Epic+ item | Completing a boss quest triggers an item drop with rarity >= Epic (tier 3) |
| QS-11 | Quest prerequisite gating works | "Queue Discipline" (Zone 1-2) is LOCKED until "Cutting in Line" is COMPLETE |
| QS-12 | Priority ordering is correct | With "Reach Level 5" (priority 30) and "Kill 8 Line Cutters" (priority 20) both available, auto-assign picks "Reach Level 5" |
| QS-13 | Offline quest completion summarized | After 2 hours offline with 3 quests completed, return summary shows all 3 quest names and total rewards |
| QS-14 | No stuck state on disconnect during choice | Player disconnecting during choice window results in auto-assign when timer expires |

### Rare Quest Variant Criteria

| ID | Criterion | Pass Condition |
|----|-----------|----------------|
| QS-15 | Variant chance matches config | Over 1000 quest selection events, ~10% +/- 3% of quests in selection pools are variants |
| QS-16 | Variant XP reward is boosted | A variant Kill quest in Zone 1-3 (base 225 XP) awards floor(225 * 1.5) = 337 XP |
| QS-17 | Variant gold reward is boosted | A variant Kill quest in Zone 1-3 (base 130 gold) awards floor(130 * 1.5) = 195 gold |
| QS-18 | Variant milestone bumps item tier | A variant milestone quest with base tier floor 2 (Rare) generates an item with rarity >= Epic (tier 3) |
| QS-19 | Variant boss bumps item tier | A variant boss quest with base tier floor 3 (Epic) generates an item with rarity >= Legendary (tier 4) |
| QS-20 | Variant tier floor capped at Legendary | A variant quest with base tier floor 4 (Legendary) does not bump to tier 5. Floor remains at 4. |
| QS-21 | Variant priority bonus applied | A variant Kill quest has priority 30 (base 20 + 10 bonus). Auto-assign picks it over a standard Kill quest (priority 20) when both are available. |
| QS-22 | Variant title is from variant template pool | A variant Kill quest uses a variant Kill title template (e.g., "The {enemy_name} Situation Has Escalated"), not a standard template |
| QS-23 | Variant display is visually distinct | Variant quests in the choice window show gold/amber title color and "★ Rare Quest" badge |
| QS-24 | Variant offline summary is marked | Returning from offline with a completed variant shows "★ Completed rare quest: [title]" in the summary |
| QS-25 | All 3 variants is legal | If all 3 quests in choice pool roll as variants, all 3 display as variants. No error, no fallback to standard. |

---

## Design Options for Board Review

### Option A: Choice Window with Auto-Assign Fallback (Recommended, Specified Above)

Player sees 2-3 options for 30 seconds. If no input, auto-assign picks the best.

**Pros:** Respects Pillar 1 (zero-pressure -- choices don't accumulate). Satisfies Casual engagement level. AFK flow is never interrupted.
**Cons:** 30-second window may be too short for very casual players. (Tunable.)

### Option B: Quest Queue (Player Pre-Selects Order)

Player can set a priority queue of quests. System processes them in order.

**Pros:** More control for Engaged/Deep players. No real-time pressure.
**Cons:** Requires additional UI. Creates a "homework" feeling -- the queue itself becomes a management task. Risks violating Pillar 1 if the queue feels like an obligation.

### Option C: Pure Auto-Assign (No Player Choice)

All quests auto-assign by priority. No choice layer.

**Pros:** Simplest implementation. Perfect AFK experience.
**Cons:** Eliminates the Secondary Fantasy for quests. Players who want agency have none. Quest order is deterministic, reducing replayability.

**Recommendation:** Option A. The choice window adds meaningful but zero-pressure agency. It's the lightest possible touch that still makes the player feel like they're steering. Options B and C are valid extremes, but A hits the sweet spot for our player agency layers.
