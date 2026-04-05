# Sprint 2 Test Plan

**Author:** QA Lead, VOID Studios
**Date:** 2026-04-04
**Status:** Active
**Sprint scope:** Character Creation, Core Idle Loop / Tick Engine, Database Persistence

---

## 1. Character Creation

Source: GDD v1 Section 3, VOI-7 acceptance criteria CC-01 through CC-08.

### 1.1 Unit Tests (`packages/game-engine`)

Tests for the pure character creation logic (no UI, no DB).

| Test ID | Criterion | Type | Test Description | Expected Result |
|---------|-----------|------|------------------|-----------------|
| CC-U01 | CC-01 | Unit | All 6 class definitions exist and are selectable | `getClasses()` returns exactly 6 classes: Chronoknight, Timestomper, Epoch Mage, Idlemaster, Loot Gremlin, Unflappable |
| CC-U02 | CC-02 | Unit | Starting stats sum to STARTING_STAT_BUDGET | For each class, `sum(STR, INT, VIT, SPD, LCK) === 25` |
| CC-U03 | CC-05 | Unit | Class stats match GDD table | Chronoknight: {STR:7, INT:3, VIT:7, SPD:4, LCK:4}, Timestomper: {STR:9, INT:2, VIT:4, SPD:6, LCK:4}, Epoch Mage: {STR:2, INT:9, VIT:4, SPD:5, LCK:5}, Idlemaster: {STR:4, INT:4, VIT:4, SPD:7, LCK:6}, Loot Gremlin: {STR:4, INT:3, VIT:5, SPD:4, LCK:9}, Unflappable: {STR:5, INT:3, VIT:9, SPD:4, LCK:4} |
| CC-U04 | CC-03 | Unit | Empty name input yields "Adventurer" | `validateName("") === "Adventurer"` |
| CC-U05 | CC-03 | Unit | Whitespace-only name yields "Adventurer" | `validateName("   ") === "Adventurer"` |
| CC-U06 | CC-03 | Unit | Name > 20 chars is truncated | `validateName("abcdefghijklmnopqrstuvwxyz").length === 20` |
| CC-U07 | CC-03 | Unit | Special characters stripped | `validateName("xX_Chrono_Lord_Xx!!") === "xXChronoLordXx"` |
| CC-U08 | CC-03 | Unit | Name of only special chars yields "Adventurer" | `validateName("!!!@@@") === "Adventurer"` |
| CC-U09 | CC-03 | Unit | Name with emoji stripped | `validateName("Hero🗡️") === "Hero"` |
| CC-U10 | CC-03 | Unit | Exactly 20 char name accepted as-is | `validateName("12345678901234567890") === "12345678901234567890"` |
| CC-U11 | CC-03 | Unit | Leading/trailing whitespace trimmed | `validateName("  Hero  ") === "Hero"` |
| CC-U12 | CC-04 | Unit | New character starts at Act 1 Zone 1 | Character state after creation: `zone === "back_of_the_line"`, `act === 1`, `level === 1` |

### 1.2 Component Tests (`apps/web`)

Tests for React components rendered with Vitest + React Testing Library.

| Test ID | Criterion | Type | Test Description | Expected Result |
|---------|-----------|------|------------------|-----------------|
| CC-C01 | CC-01 | Component | Class selection UI renders all 6 classes | 6 class cards/buttons rendered with correct names |
| CC-C02 | CC-01 | Component | Selecting a class highlights it | Click on a class card updates selected state |
| CC-C03 | CC-03 | Component | Name input field enforces validation | Invalid input shows error, empty submission falls back to "Adventurer" |
| CC-C04 | CC-06 | Component | Back button works at each step | Each step of creation flow has a functioning back button |
| CC-C05 | CC-04 | Component | Starting stats display matches selected class | After class selection, stat display shows correct GDD values |
| CC-C06 | CC-06 | Component | Confirmation step before finalizing | User sees a summary/confirmation before character is created |

### 1.3 E2E Tests (`apps/web/e2e`)

Full flow tests via Playwright across viewport matrix.

| Test ID | Criterion | Type | Test Description | Expected Result |
|---------|-----------|------|------------------|-----------------|
| CC-E01 | CC-01..CC-06 | E2E | Complete character creation flow | User enters name, selects class, confirms, lands in game with idle loop running |
| CC-E02 | CC-07 | Responsive | Character creation on all 7 viewports | No overflow, no truncation, touch targets >= 44x44px on mobile |
| CC-E03 | CC-05 | E2E | Persistence across refresh | Create character, refresh page, character still exists with correct stats |
| CC-E04 | CC-08 | E2E | Idle loop auto-starts after creation | After confirming character, game UI shows auto-playing state (tick advancing) |

---

## 2. Core Idle Loop / Tick Engine

Source: GDD v1 Section 9, ADR-005, `packages/game-engine/src/tick-engine.ts`.

### 2.1 Unit Tests (`packages/game-engine`)

The tick engine is purely functional: `(slots, now) -> result`. Existing tests in `tick-engine.test.ts` cover basics. Sprint 2 expands coverage.

| Test ID | Area | Type | Test Description | Expected Result |
|---------|------|------|------------------|-----------------|
| TE-U01 | Empty queue | Unit | Empty queue returns empty result | `completed: [], updatedSlots: []` |
| TE-U02 | First slot | Unit | First unstarted slot starts immediately | `startedAt === now`, `completesAt === now + duration` |
| TE-U03 | Completion | Unit | Slot past its completesAt is marked completed | Appears in `completed[]` with correct `completedAt` |
| TE-U04 | Chaining | Unit | Completed slot chains to next | Slot B starts at Slot A's completesAt |
| TE-U05 | Offline catch-up | Unit | Multi-slot catch-up processes all completed slots | 3 slots with enough elapsed time -> 3 completions with correct chain times |
| TE-U06 | Blocking | Unit | In-progress slot blocks subsequent slots | Slot B in progress -> Slot C remains `startedAt: null` |
| TE-U07 | Duration accuracy | Unit | Slot duration of 0 seconds completes immediately | Slot with `durationSeconds: 0` appears in completed |
| TE-U08 | Large offline gap | Unit | 30 days of offline time processes correctly | 720 hours of queued actions process without error or precision loss |
| TE-U09 | Single slot queue | Unit | Queue with one completed slot returns it | One completed slot, empty updatedSlots |
| TE-U10 | Position ordering | Unit | Slots process in position order regardless of input order | Shuffled input produces same result as sorted input |
| TE-U11 | Exact boundary | Unit | Slot where `completesAt === now` is treated as complete | Boundary condition: exact match counts as done |

### 2.2 Integration Tests

Tests that verify the tick engine integrates correctly with database persistence.

| Test ID | Area | Type | Test Description | Expected Result |
|---------|------|------|------------------|-----------------|
| TE-I01 | Persist | Integration | Queue result is saved to DB correctly | Process queue, write to DB, read back, verify match |
| TE-I02 | Resume | Integration | Queue resumes from persisted state | Save mid-progress queue, reload, process again, correct result |
| TE-I03 | Concurrent ticks | Integration | Two rapid tick calls don't duplicate completions | Race condition: same queue processed twice yields idempotent result |

---

## 3. Database Persistence

Source: GDD v1, VOI-7 acceptance criteria DB-01 through DB-07, `packages/db` schema.

### 3.1 Schema Validation Tests (Unit — no DB required)

| Test ID | Criterion | Type | Test Description | Expected Result |
|---------|-----------|------|------------------|-----------------|
| DB-S01 | -- | Unit | Players table has required columns | `id, authId, username, settings, createdAt, lastSeenAt` all present |
| DB-S02 | -- | Unit | Heroes table has required columns | `id, playerId, name, class, level, xp, stats` etc. all present |
| DB-S03 | -- | Unit | Queue slots table has required columns | `id, heroId, position, actionType, targetId, durationSeconds, startedAt, completesAt` |
| DB-S04 | -- | Unit | All relations are defined | Every table with foreign keys has corresponding relation exports |

### 3.2 Integration Tests (require DATABASE_URL)

| Test ID | Criterion | Type | Test Description | Expected Result |
|---------|-----------|------|------------------|-----------------|
| DB-I01 | DB-01 | Integration | Create and read back player | Insert player row, SELECT it back, all fields match |
| DB-I02 | DB-01 | Integration | Create and read back hero with stats | Insert hero with full stat block, read back, verify all values |
| DB-I03 | DB-04 | Integration | Full save/load cycle | Create player + hero + inventory + queue, read all back, deep equality check |
| DB-I04 | DB-03 | Integration | Concurrent writes don't corrupt | Two rapid updates to same hero (equip + level up) both succeed without data loss |
| DB-I05 | DB-06 | Integration | Cascading deletes | Delete a player, verify all associated heroes/inventory/queue rows removed |
| DB-I06 | DB-05 | Integration | Failed write produces error state | Simulate constraint violation, verify error is surfaced (not silently swallowed) |
| DB-I07 | DB-07 | Integration | Auth session round-trip | Create player with authId, query by authId, verify correct player returned |

### 3.3 E2E Persistence Tests

| Test ID | Criterion | Type | Test Description | Expected Result |
|---------|-----------|------|------------------|-----------------|
| DB-E01 | DB-01 | E2E | Data survives page refresh | Create character, refresh, character still present |
| DB-E02 | DB-02 | E2E | Offline progression calculation | Advance server time, reload, verify catch-up calculation is correct |
| DB-E03 | DB-07 | E2E | Returning player lands on character | Auth -> reload -> see existing character, not creation screen |

---

## 4. Test Execution Plan

### 4.1 Test Layers

| Layer | Framework | Where | Runs When |
|-------|-----------|-------|-----------|
| Unit (game engine) | Vitest | `packages/game-engine` | Every PR, every push to main |
| Unit (DB schema) | Vitest | `packages/db` | Every PR, every push to main |
| Component (web) | Vitest + RTL | `apps/web` | Every PR, every push to main |
| Integration (DB) | Vitest | `packages/db` | When DATABASE_URL available (manual / staging CI) |
| E2E | Playwright | `apps/web/e2e` | Pre-merge for responsive; post-deploy for full suite |

### 4.2 Responsive Testing Matrix

All E2E tests run across 7 viewport configurations:

| ID | Device | Viewport | Notes |
|----|--------|----------|-------|
| V1 | Phone (small) | 375x667 | iPhone SE |
| V2 | Phone (large) | 390x844 | iPhone 14 |
| V3 | Phone (landscape) | 844x390 | |
| V4 | Tablet (portrait) | 768x1024 | iPad |
| V5 | Tablet (landscape) | 1024x768 | |
| V6 | Desktop (small) | 1280x720 | |
| V7 | Desktop (large) | 1920x1080 | |

### 4.3 Browser Targets

| Browser | Priority | CI Coverage |
|---------|----------|-------------|
| Chrome (Chromium) | P0 | All E2E tests |
| Safari (WebKit) | P0 | Added when Playwright WebKit configured |
| Firefox | P1 | Added when Playwright Firefox configured |
| Edge | P2 | Covered by Chromium engine |

### 4.4 Quality Gate for Sprint 2

Sprint 2 passes quality gate when:

1. **Zero critical bugs** in character creation, tick engine, or persistence
2. **CC-01 through CC-08** all passing (unit + component + E2E)
3. **TE-U01 through TE-U11** all passing
4. **DB-S01 through DB-S04** all passing
5. **Responsive spot-check** on V1, V4, V7 minimum
6. **No regressions** from Sprint 1 (existing tick-engine tests still pass)

---

## 5. Automation Strategy

### Automate (deterministic, repeatable)
- Name validation logic (all CC-U04..CC-U11)
- Stat budget verification (CC-U02, CC-U03)
- Tick engine processing (all TE-U tests)
- Schema validation (all DB-S tests)
- Responsive layout checks (horizontal overflow, font size)

### Manual (feel, UX, emergent)
- Character creation flow "feel" (CC-C06 confirmation UX)
- Idle loop visual feedback (does the UI feel alive?)
- Mobile touch target size verification
- Accessibility audit (keyboard nav, screen reader, color contrast)
- Playtest sessions (real players creating characters and watching idle loop)
