# ChronoQueue — Core Loop Design

ChronoQueue's loop structure operates at four scales. Each loop feeds into the next. If a loop feels dead-ended, it needs redesign.

---

## Loop Architecture

### Micro Loop (~30 seconds)
**What happens:** Combat tick resolves -> auto-battle outcome -> loot/XP generated -> log entry appears.

This is the heartbeat of the game. Every ~30 seconds, *something happens* — a fight, a discovery, a skill check, a random encounter. The log updates. The player (if watching) sees a new line of text.

**Design goals:**
- Each tick should be readable in 2-3 seconds.
- Outcomes must have enough variety that two consecutive ticks rarely feel identical.
- Occasional spikes of interest: critical hits, rare drops, funny flavor events.
- This loop runs whether the player is watching or not.

**Feeds into:** Short loop (quest completion is a sequence of micro-loop outcomes).

---

### Short Loop (5-15 minutes)
**What happens:** Quest completes -> rewards distributed -> new quest auto-assigned -> gear comparison opportunity.

A quest is a sequence of micro-loop events with a narrative wrapper and a completion reward. Quest completion is the main punctuation mark in the idle flow — it's the moment the player notices "something finished."

**Design goals:**
- Quests should feel like complete micro-stories (setup -> escalation -> resolution).
- Completion rewards must be meaningful: new gear to compare, currency to spend, or progression milestones.
- Auto-assignment of the next quest keeps the idle flow unbroken.
- Player choice layer: if the player is present, they can pick the next quest from 2-3 options. If absent, the game picks for them.

**Feeds into:** Session loop (multiple quest completions lead to level-ups and build decisions).

---

### Session Loop (30-90 minutes)
**What happens:** Hero levels up -> new abilities unlock -> player reviews build options -> optimizes loadout -> pushes into harder content.

This is where the Secondary Fantasy (systems tinkerer) activates. A level-up is a decision point: new skill choices, stat allocations, gear upgrades. The player who's been passively watching now has a reason to engage.

**Design goals:**
- Level-ups should feel like opening a present: clear, rewarding, and offering real choices.
- Build decisions must have meaningful tradeoffs, not obvious best picks.
- Harder content should be visibly different in the log — new enemy types, new mechanics, new flavor.
- The player should leave a session feeling like their party is measurably stronger.

**Feeds into:** Long-term loop (cumulative progression unlocks new systems and zones).

---

### Long-Term Loop (Days to Weeks)
**What happens:** Zone completion -> new zone/class unlocks -> prestige/rebirth mechanics -> party composition strategy -> meta-progression.

This is the retention backbone. The long-term loop asks: "Why do I keep coming back?" The answer must be: "Because there's always a next thing, and the next thing changes how I play."

**Design goals:**
- Zone completion should feel like a chapter ending — satisfying, with a clear "what's next."
- Class/job unlocks expand the possibility space: new party compositions, new synergies, new strategies.
- Prestige/rebirth (if implemented) must offer genuine power growth AND new content, not just bigger numbers.
- Meta-progression should make the *journey* faster and more interesting, not just the *destination* closer.

**Feeds into:** Back to micro loop with new content, abilities, and systems layered in.

---

## Player Agency Layers

ChronoQueue supports four levels of engagement, all of which must be satisfying:

| Level | Input | Experience | Fantasy Served |
|-------|-------|------------|----------------|
| **AFK** | Zero input | Game auto-resolves everything. Pure Progress Quest mode. Player returns to a log of adventures. | Primary + Tertiary |
| **Casual** | Light touch | Equip better gear, choose quest direction, pick active party members. 1-2 decisions per session. | Primary |
| **Engaged** | Active optimization | Build optimization, stat analysis, targeted quest selection, synergy discovery. Theorycraft-lite. | Secondary |
| **Deep** | Mastery pursuit | Hidden mechanics, rare event triggers, optimal prestige paths, party composition theory. | Secondary (advanced) |

**Critical rule:** The AFK layer must be genuinely fun. If the game requires engagement to be enjoyable, we've failed Pillar 1. Active play makes it *better*, but passive play must be *good*.

---

## Choice Architecture

Player choices should be:
- **Meaningful but not punishing.** A bad build choice slows you down; it doesn't brick your save.
- **Discoverable, not required.** The game never says "you must choose." It presents opportunities.
- **Reversible at reasonable cost.** Respec is always available. Experimentation is encouraged.
- **Layered in gradually.** The first hour has almost no choices. Choices appear as the player demonstrates engagement.

---

## Loop Health Diagnostic

Use this checklist during design reviews:

- [ ] Does the micro loop produce enough variety to be watchable for 5+ minutes?
- [ ] Does the short loop have a clear completion moment that feels rewarding?
- [ ] Does the session loop offer at least one real decision the player cares about?
- [ ] Does the long-term loop change *how* the player plays, not just *where*?
- [ ] Does each loop feed cleanly into the next?
- [ ] Is the AFK experience satisfying on its own?
- [ ] Can an engaged player find depth without the game demanding it?
