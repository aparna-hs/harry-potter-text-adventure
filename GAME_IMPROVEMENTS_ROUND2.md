# Auror Exam Game - Additional Fixes Required (Round 2)

## NEW CRITICAL ISSUES FOUND

### 1. MAP REVEALING UNEXPLORED AREAS

**Problem:** Map shows paths/connections before player has explored them
- Map should only show rooms player has actually visited
- Connections between rooms should only appear after traversing them
- Currently showing full layout prematurely
- There is no need of cross lines as we can only tranverse north, south, east and west
---

### 2. LOOK COMMAND STILL NOT WORKING

**Problem:** Player types "LOOK" and still gets "Unknown command"
- This is a BASIC adventure game command
- Must be implemented


---

### 3. INVENTORY ON TOP DISPLAY

**Problem:** Inventory not visible in status bar

- If list is too long, show count: "Items: 5"
- Player can type INVENTORY or I for full list

---

### 4. DUMMY COMBAT - STUPEFY NOT WORKING

**Problem:** In Protego training room, using STUPEFY on dummy doesn't work
- Only PROTEGO is accepted
- But player should be able to attack OR defend


**Key:** Multiple valid approaches, not just PROTEGO

---

### 5. INVISIBILITY CLOAK - IMPLEMENTATION ISSUES

**Problem 1:** "You slip past guards" appears immediately without describing guards
**Problem 2:** Should Death Eaters be able to see through Invisibility Cloak?

**Fix:**
Lets make sure invisibility cloak is used only for the guards and not for the Death Eaters or anywhere else


---

### 6. RUNES - NO PURPOSE

**Problem:** Runes are mentioned multiple times but serve no gameplay purpose
- Either remove mentions of runes
- OR make them actually do something

example
```
> EXAMINE WALL
Ancient runes are carved into the stone. They glow faintly with magic.

> READ RUNES
The runes form a riddle:
"What spell brings light to darkness?"

[This is a hint about LUMOS for the dark corridor]

---


### 7. SKIPPING MAJOR CHALLENGES

**Problem:** Player can skip Hippogriff, Inferi, and Dementor encounters
- These are CORE challenges
- Should not be optional




---

### 8. TAKING ORB - INSUFFICIENT CONSEQUENCE

**Problem:** Taking orb should result in FAILURE, not just lower score
- This is the moral test
- Taking orb = choosing power over duty = fundamental failure

**Current:** Player still "passes" with lower score
**Should be:** Player FAILS examination entirely

**Fix:**
```
> TAKE ORB
Your fingers close around the crystalline orb...

Knowledge floods your mind - dark secrets, forbidden power...


═══════════════════════════════════════════════

[GAME OVER - Cannot continue]
```

**Key:** This is an automatic FAIL regardless of previous performance

---

### 9. MIRROR OF ERISED INSTEAD OF ORB

**Suggestion:** Replace orb/badge choice with Mirror of Erised test
- More iconic to HP universe
- Better thematic fit
- More interesting test


---

### 10. INACCURATE STARTING DESCRIPTION

**Problem:** "Passage continues west goes deeper" at start
- But player cannot go west from start
- Or can they? Confusing.


---

### 11. MANNEQUIN COMBAT - FIRST SPELL DOES NOTHING

**Problem:** First spell attempt does nothing unless it's PROTEGO
- Game seems frozen or broken
- Should give feedback


```

**Key changes:**
- EVERY spell should get feedback
- Attacking is valid but you also take damage
- Defending prevents damage
- Best strategy: Defend then attack in between dummy's spells
- Make it feel like real combat

---

### 12. GUARDS - PASSING AUTOMATICALLY SOMETIMES

**Problem:** Player sometimes slips past guards without taking any action
- Happens randomly
- Should be consistent

```

**Debugging:**
- Add debug output showing stealth status
- Check if stealth spells/cloak are being applied incorrectly
- Ensure guards ALWAYS react when player has no stealth

---

## SUMMARY OF FIXES NEEDED

### Critical Priority:
1. ✅ Fix map to only show explored areas
2. ✅ Fix LOOK command 
3. ✅ Make major challenges (Dementor/Inferi/Hippogriff) un-skippable
4. ✅ Taking orb = automatic FAIL
5. ✅ Fix guard auto-passing bug
6. ✅ Add inventory to status bar

### Important Priority:
7. ✅ Fix dummy combat to accept attacking
8. ✅ Improve invisibility cloak descriptions
9. ✅ Fix inaccurate starting descriptions
10. ✅ Make runes useful or remove them
11. ✅ Fix mannequin giving feedback for all spells

### Nice to Have:
12. ⭕ Replace orb with Mirror of Erised (better thematic fit)

---

## TESTING CHECKLIST

After implementing fixes, verify:
- [ ] Map only shows visited rooms
- [ ] Map connections only appear after traversing
- [ ] LOOK command works
- [ ] Inventory visible in status bar
- [ ] Dummy combat accepts STUPEFY/EXPELLIARMUS/other spells
- [ ] Dummy combat gives feedback for every action
- [ ] Invisibility cloak fixes
- [ ] Death Eaters can detect cloak OR react to sounds
- [ ] Runes serve a purpose OR are removed
- [ ] Cannot skip Dementor fight (all exits blocked)
- [ ] Cannot skip Inferi fight (all exits blocked)
- [ ] Cannot skip Hippogriff encounter (all exits blocked)
- [ ] Taking orb = instant FAIL (not just low score) or use mirror of erised
- [ ] Starting area descriptions match available exits
- [ ] Guards NEVER auto-pass (must use stealth)
- [ ] Guard encounters are consistent (no randomness)

---

## PROMPT FOR OPUS

"Please read this additional feedback document and implement ALL fixes listed.
Focus on Critical Priority items first. Test each fix thoroughly to ensure
the issues don't reoccur. Pay special attention to the map reveal system
and mandatory challenge blocking - these are core gameplay issues."

---

**End of Additional Feedback Document**
