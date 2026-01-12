# Harry Potter Auror Exam - Text-Based Adventure Game

## Project Overview

Build a complete, playable text-based adventure game where the player takes the final Auror examination. This is a dangerous, real-world test featuring actual Dark creatures, combat scenarios, and magical challenges. The player must navigate and solve puzzles using their Harry Potter spell knowledge to reach the final chamber and pass the exam.

### Key Design Philosophy

- Players should use their actual HP knowledge - they must figure out which spells to use based on the situation
- Like classic text adventures (Zork, Colossal Cave), don't hold the player's hand
- Use traditional text parser (NO LLM API calls)
- Let players explore, experiment, and discover

---

## Game Structure

**Format:** Terminal-based text adventure with ASCII art elements

**Core Gameplay Loop:**
1. Player reads location descriptions
2. Types commands to interact with world
3. Navigates by figuring out available directions through exploration
4. Encounters challenges and must use HP knowledge to progress
5. Health system with potential healing opportunities
6. Reaches final chamber and completes exam

**Game Length:** 45-60 minutes for full playthrough

---

## Technical Requirements

### Parser System

**MUST USE TRADITIONAL TEXT PARSER - NO LLM API CALLS**

Build a classic parser that recognizes:
- Verb-noun commands: "CAST LUMOS", "EXAMINE DOOR", "TAKE POTION"
- Single word commands: "NORTH", "INVENTORY", "HELP"
- Two-word combinations: "GO NORTH", "LOOK AROUND"
- Be flexible with synonyms but keep it traditional

**Why no LLM:**
- Avoid API costs for players
- More reliable and predictable
- Faster response times
- Classic text adventure feel

---

### Navigation System

**Design freedom:** Choose any system (node-based, grid, graph, hybrid)

**Key requirements:**
- Player must discover available directions through exploration
- Don't explicitly list "Available exits: North, South"
- Instead, describe the environment: "A corridor stretches to the north. You hear water dripping to the east."
- Player tries directions and gets feedback: "You can't go that way" or describes new location
- Multiple paths, some dead ends
- Map tracking (shows where they've been, not where they can go)

**Like Zork:**
- "The path opens to the north, disappearing into darkness."
- Player types NORTH
- "You are in a dark corridor..."

---

### Display System

**Show player:**
- Current location name/description
- Current health status
- Visual map representation showing explored areas only
- Challenge status if actively engaged

**DO NOT show:**
- Available exits/directions
- Action suggestions
- Hints unless specifically requested
- What objects/creatures will do

**Example display:**
```
╔════════════════════════════════════╗
║      AUROR EXAMINATION MAZE        ║
╠════════════════════════════════════╣
║ Health: ████████░░ 80/100          ║
╠════════════════════════════════════╣
║ [Explored Map - shows only        ║
║  locations player has visited]     ║
╠════════════════════════════════════╣
║ Dark Corridor                      ║
║                                    ║
║ The walls here are damp and cold.  ║
║ Your breath mists in the freezing  ║
║ air. A passageway leads deeper     ║
║ into darkness ahead. Behind you,   ║
║ the corridor opens to a wider      ║
║ chamber.                           ║
╚════════════════════════════════════╝

> _
```

---

### Health System

**Starting Health:** 100 HP

**Damage:**
- Various threats throughout the maze
- Amount varies by situation
- Death at 0 HP = restart from beginning

**Healing Opportunities:**
- Dittany can be found in certain locations
- Player can cast ACCIO DITTANY if near hospital wing/healing area
- Maybe Wiggenweld Potion somewhere
- Episkey spell for minor wounds
- Limited healing opportunities (2-3 maximum throughout game)
- Make healing strategic - players must decide when to use it

**Don't tell players specific damage amounts ahead of time** - let them discover through gameplay

---

## The 9 Challenges

Design your maze to include these 9 challenges. You decide placement, connections, and exact implementation.

### 1. Pitch Black Corridor

**Concept:** Total darkness, cannot navigate safely

**Solution:** LUMOS or LUMOS MAXIMA

**Implementation notes:**
- Describe darkness, maybe sounds
- Trying to move without light = bump into things, minor damage
- Don't say "You need light" - let them figure it out
- Lumos reveals the area properly

---

### 2. Levitation Puzzle

**Concept:** Gap or obstacle that requires moving heavy objects

**Solution:** WINGARDIUM LEVIOSA on objects

**Implementation notes:**
- Describe the chasm/gap and heavy blocks nearby
- Player must EXAMINE to notice details
- Must figure out to levitate objects
- Alternative creative solutions acceptable

---

### 3. Dementor Encounter

**Concept:** Dementor appears, causing despair

**Solution:**
1. EXPECTO PATRONUM
2. Must describe/think of happy memory when prompted

**Implementation notes:**
- Describe cold, despair, dark figure
- Don't mention "Dementor" by name initially
- Let player figure out it's a Dementor from description
- First Patronus attempt fails or is weak
- Prompt for happy memory
- Memory quality determines success
- Failure = significant damage and despair

---

### 4. Protego Shield Training

**Concept:** Automated dummy fires curses in sequence

**Solution:** PROTEGO to block each curse

**Implementation notes:**
- Describe training room with magical dummy
- Curses fire in sequence
- Player must shield or dodge
- Getting hit = damage
- Can also try counter-curses

---

### 5. Inferi Chamber

**Concept:** Reanimated corpses rising from water

**Solution:** Fire spells (INCENDIO, CONFRINGO)

**Implementation notes:**
- Describe pale bodies, dead eyes, water
- Don't name them as "Inferi" immediately
- Let player figure out they're undead
- Fire is effective, water makes worse
- Stupefy only temporary

---

### 6. Hippogriff Enclosure

**Concept:** Proud magical creature blocks path

**Solution:** BOW to show respect, wait for bow back

**Implementation notes:**
- Describe creature (without naming it initially if you want)
- Let player figure out proper etiquette
- Attack = serious retaliation
- Can offer to RIDE for shortcut

---

### 7. Death Eater Duel

**Concept:** Combat encounter with dark wizard

**Solution:** Combat spells (STUPEFY, EXPELLIARMUS, PROTEGO, etc.)

**Implementation notes:**
- Turn-based or action-based combat
- Must defend and attack
- Block Unforgivable Curses if player tries
- Multiple rounds to win

---

### 8. Stealth Section

**Concept:** Must pass guards undetected

**Solution:** MUFFLIATO or DISILLUSIONMENT CHARM

**Implementation notes:**
- Describe voices, footsteps ahead
- Without stealth = confrontation
- Creative solutions acceptable
- Can fight but costly

---

### 9. Final Chamber

**Concept:** Last test before completion

**Your choice of implementation:**
- Moral dilemma
- Final defense demonstration
- Puzzle or knowledge test
- Capstone challenge

---

## Hint System

**Only provide hints when player is clearly stuck:**

**Trigger hints after:**
- Multiple failed attempts (4-5 tries)
- Player types HINT or HELP in challenge context
- Certain amount of time stuck in one place

**Hint progression:**
- Environmental clue: "The creature seems to recoil from your torch..."
- Skill category: "This situation requires defensive magic..."
- General spell type: "Perhaps a shield charm..."
- Specific spell (last resort): "Try PROTEGO"

**Never give away answers easily** - make players work for it

---

## Spell System

**NO SPELL LIST PROVIDED TO PLAYERS**

### CRITICAL: Spell Recognition Rules

Players MUST type the correct spell incantation. Only minor spelling mistakes are acceptable.

**Acceptable:**
- "EXPECTO PATRONUM" ✓
- "EXPETO PATRONUM" ✓ (minor typo)
- "EXPEPTO PATRONUM" ✓ (minor typo)
- "WINGARDIUM LEVIOSA" ✓
- "WINGARDIUM LEVIOSA" ✓ (minor typo in middle)

**NOT Acceptable:**
- "PATRONUS" ✗ (wrong/incomplete incantation)
- "CAST PATRONUM" ✗ (wrong form)
- "PATRONUS CHARM" ✗ (English name, not spell)
- "LEVITATE" ✗ (English word, not spell)
- "SHIELD" ✗ (English word, not spell)

**Implementation:**
- Use fuzzy matching for typos (Levenshtein distance of 1-2 characters)
- Accept case variations (LUMOS, lumos, Lumos all work)
- Reject shortened versions or English names
- Give feedback: "That's not the right incantation" or "Nothing happens"

**Special cases:**
- Actions like "BOW" are not spells - these are acceptable
- Movement commands (NORTH, SOUTH) are obviously fine
- Some spells have variations: "LUMOS" vs "LUMOS MAXIMA" (both correct)

**Handle gracefully:**
- Unrecognized spells: "Nothing happens" or "That spell doesn't seem to work here"
- Unforgivable Curses: Warning message about Auror ethics
- Creative spell use: Reward when appropriate and correctly cast

---

## Healing System

**Healing Opportunities (scattered throughout maze):**

**Dittany:**
- Can be found in certain locations (Herbology area, supply closet, etc.)
- Restores 30-40 HP
- Limited quantity (2-3 doses maximum)

**Accio Dittany:**
- Works if player is near Hospital Wing area
- Must cast as "ACCIO DITTANY" (not just "ACCIO")
- Must be close enough for summoning charm to work
- "The essence flies to your hand from somewhere nearby..."

**Wiggenweld Potion:**
- Maybe one bottle hidden somewhere
- Restores 50 HP
- Very rare

**Episkey:**
- Player can cast this minor healing spell
- Must cast as "EPISKEY" (correct incantation)
- Restores 15-20 HP
- Can only be used 2-3 times (spell takes toll on caster)

**Strategic healing:**
- Players must decide when to use limited resources
- Finding healing items requires exploration
- Rewards thorough players who examine environment

---

## Exploration & Discovery

**Environmental storytelling:**
- Rich descriptions hint at what's possible
- "You notice scratches on the door... something large passed through here"
- "The air smells of sulfur and ash"
- "A bookshelf lines one wall, dusty tomes barely visible"

**Interactive objects:**
- Players can EXAMINE, TAKE, USE, READ objects
- Some items useful, some flavor text
- Reward curiosity

**Dead ends and secrets:**
- Some paths lead nowhere (realistic maze)
- Hidden shortcuts for observant players
- Optional challenges for extra points

---

## Scoring System

Track throughout the game:

**Points for:**
- Challenges completed: +10 each
- Health management (ending with high HP): bonus points
- Perfect execution (no damage in challenge): +5
- Creative spell usage: +5
- Secrets found: +5
- Helping others: +10
- Showing mercy to creatures: +5

**Penalties:**
- Heavy damage taken: minor point loss
- Excessive violence: -5
- Using hints: -2 per hint

**Final Grade (O.W.L./N.E.W.T. style):**
- 95+: Outstanding (O) - Elite Auror material
- 85-94: Exceeds Expectations (E) - Excellent Auror
- 75-84: Exceeds Expectations (E) - Strong Auror
- 65-74: Acceptable (A) - Qualified Auror
- 55-64: Acceptable (A) - Probationary Auror
- 45-54: Poor (P) - Must retake examination
- Below 45: Dreadful (D) - Failed, not Auror material
- Below 30: Troll (T) - Catastrophic failure

---

## Atmosphere & Writing

### Opening

```
═══════════════════════════════════════════
    MINISTRY OF MAGIC - AUROR OFFICE
        FINAL EXAMINATION
═══════════════════════════════════════════

This is the final test to become an Auror.

Real magical threats. Real danger.
Some candidates don't return.

What is your name? > _____

Good luck, [Name].

Your examination begins.
═══════════════════════════════════════════
```

### Writing Style

- Immersive, atmospheric descriptions
- Don't be overly helpful - let players figure things out
- Show, don't tell
- Use all senses (sight, sound, smell, temperature, feeling)
- Create tension and atmosphere
- Respect HP canon

**Example descriptions:**
```
> NORTH

You step into a vast chamber. The temperature
drops sharply - your breath comes out in white
clouds. Frost creeps across the stone walls.
The torches on the walls flicker and dim.
A feeling of overwhelming despair settles over
you like a heavy cloak.

Something moves in the shadows ahead.

> _
```

---

## Technical Implementation

**Language:** Your choice (Python recommended)

**Architecture:**
- Traditional text parser
- State management for location, health, inventory, challenges
- Location/room system with descriptions and connections
- Challenge state tracking
- Command history (optional but nice)
- Save/load at checkpoints (optional)

**Parser requirements:**
- Verb-noun recognition
- Synonym handling for actions (EXAMINE = LOOK AT = INSPECT)
- Typo tolerance ONLY for spelling (fuzzy matching with max distance of 2)
- Reject incomplete or English versions of spells
- Clear error messages
- Command history navigation (up/down arrows if possible)

**Polish:**
- ASCII art for key moments
- Color coding if terminal supports (red=damage, green=healing, blue=magic)
- Clear formatting
- Smooth pacing

---

## Creative Freedom

**Full freedom on:**
- Navigation system architecture
- Maze layout, size, and complexity
- Challenge placement and order
- Room descriptions and details
- How much to reveal vs hide
- Puzzle difficulty tuning
- Additional content (easter eggs, optional areas, etc.)
- Implementation details
- Exact healing mechanics
- Combat system details

**Must preserve:**
- All 9 core challenges
- Traditional parser (no LLM API)
- Strict spell incantation requirement (only typos allowed)
- Health system with healing opportunities
- No explicit direction lists or action menus
- No spell list given to players
- Hint system only when stuck
- 45-60 minute gameplay length
- HP accuracy and lore
- Grading system including "Troll" (T) grade for very poor performance

---

## Success Criteria

The game is successful if:

✅ All 9 challenges implemented and working  
✅ Traditional text parser (no LLM API calls)  
✅ Players must type correct spell incantations (only typos forgiven)  
✅ No hand-holding (no exit lists, no action menus)  
✅ Health system with strategic healing  
✅ Rich, atmospheric descriptions  
✅ Challenging but fair  
✅ 45-60 minutes to complete  
✅ Feels like a real, dangerous Auror exam  
✅ Grading system includes Troll (T) grade for very poor performance  
✅ Fun to play and explore!

---

## Deliverables

1. **Complete playable game**
2. **README.md:**
   - How to run
   - Basic command syntax examples (not spell list)
   - Game premise
   - Tips without spoilers
3. **WALKTHROUGH.md** (separate, for testing):
   - One solution path
   - All correct spells
   - Developer use only

---

**Create something that makes players feel like they're truly in the Harry Potter world, being tested on their knowledge and skill. Make them explore, think, and discover. Build something worthy of the Auror Office! 🪄✨**
