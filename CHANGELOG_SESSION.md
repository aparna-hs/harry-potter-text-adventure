# Session Changelog - Journey Log Feature

**Date:** 2026-01-12
**Branch:** claude/add-journey-log-QqTfa → main

## Summary
Replaced the visual map display system with a linear journey log feature that tracks the player's path through the game in chronological order.

## Changes Made

### 1. Added Journey Log Tracking System
**File:** `src/game/types.ts`
- Added `journeyLog` property to `GameState` interface
- Structure: `Array<{ location: string; direction?: string }>`
- Tracks each location visited and the direction taken to reach it

### 2. Replaced MAP Command with JOURNEY Command
**File:** `src/game/parser.ts`
- Removed `handleMap()` function (visual ASCII map)
- Added `handleJourney()` function (linear journey log)
- Updated system commands array: replaced 'map' with 'journey'
- Updated HELP text to show "View journey: JOURNEY" instead of "See map: MAP"

**Journey Display Format:**
```
╔═══════════════════════════════════╗
║       YOUR JOURNEY                ║
╠═══════════════════════════════════╣
║                                   ║
║  1. Entrance Hall                 ║
║  2. Dark Corridor (went north)    ║
║  3. Deep Tunnel (went east)       ║
║  4. → YOU ARE HERE                ║
║                                   ║
╚═══════════════════════════════════╝
```

### 3. Updated Movement Handler
**File:** `src/game/engine.ts`
- Updated import: changed `handleMap` to `handleJourney`
- Modified `handleMovement()` function to track journey:
  - Records previous location with direction taken
  - Adds new location to journey log
- Updated command switch case: 'map' → 'journey'
- Updated `createInitialState()` to initialize `journeyLog` with starting location

### 4. Enhanced Status Bar
**File:** `src/components/Terminal.tsx`
- Added location name display (blue text)
- Retained visual health bar with colored blocks:
  - Green: healthy (>50%)
  - Yellow: injured (26-50%)
  - Red: critical (≤25%)
- Displays: Location | Health Bar | Health Numbers | Score | Items
- Simplified item display in status bar

### 5. Updated Initial Game Message
**File:** `src/components/Terminal.tsx`
- Changed from: "Type HELP for commands, HINT if stuck, or MAP to see explored areas"
- Changed to:
  - "Type JOURNEY anytime to see where you've been"
  - "Type HELP for commands or HINT if stuck"

## Benefits of Journey Log Over Map

1. **Chronological tracking** - Shows exact path taken in order
2. **Direction memory** - Records which direction you went from each location
3. **Simpler display** - Linear list is easier to read than ASCII map
4. **Better for text adventure** - Matches classic text adventure game style
5. **Always shows progress** - No "unexplored" areas, just where you've been

## Files Modified
- `src/game/types.ts` - Added journeyLog property
- `src/game/parser.ts` - Replaced map command with journey command
- `src/game/engine.ts` - Implemented journey tracking in movement
- `src/components/Terminal.tsx` - Updated status bar and initial messages

## Testing
- Build: ✅ Successful compilation with no errors
- TypeScript: ✅ All types valid
- Lint: ✅ No linting errors

## Commits
1. `03a3523` - Replace map display with journey log feature
2. `e0118a4` - Restore health bar visualization to status bar
