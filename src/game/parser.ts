// Command parser for the text adventure

import { GameState, CommandResult } from './types';
import { matchSpell, isUnforgivable } from './spells';
import { LOCATIONS, canMoveTo } from './locations';

// Direction synonyms
const DIRECTION_SYNONYMS: Record<string, string> = {
  'n': 'north',
  's': 'south',
  'e': 'east',
  'w': 'west',
  'u': 'up',
  'd': 'down',
  'go north': 'north',
  'go south': 'south',
  'go east': 'east',
  'go west': 'west',
  'go up': 'up',
  'go down': 'down',
  'walk north': 'north',
  'walk south': 'south',
  'walk east': 'east',
  'walk west': 'west',
  'move north': 'north',
  'move south': 'south',
  'move east': 'east',
  'move west': 'west',
};

// Action synonyms
const ACTION_SYNONYMS: Record<string, string> = {
  'look': 'examine',
  'look at': 'examine',
  'inspect': 'examine',
  'check': 'examine',
  'study': 'examine',
  'l': 'look',
  'get': 'take',
  'grab': 'take',
  'pick up': 'take',
  'pickup': 'take',
  'drink': 'use',
  'apply': 'use',
  'consume': 'use',
  'inv': 'inventory',
  'i': 'inventory',
  'items': 'inventory',
  'cast': 'spell',
  'h': 'help',
  '?': 'help',
  'hints': 'hint',
  'clue': 'hint',
  'turn': 'leave',
  'turn away': 'leave',
  'look into': 'touch',
  'gaze': 'touch',
  'stare': 'touch',
  'touch': 'touch',
  'reach': 'touch',
};

export interface ParsedCommand {
  type: 'movement' | 'action' | 'spell' | 'system' | 'unknown';
  verb: string;
  target?: string;
  rawInput: string;
}

// Parse user input into a command
export function parseCommand(input: string): ParsedCommand {
  const rawInput = input;
  const normalized = input.toLowerCase().trim();

  if (!normalized) {
    return { type: 'unknown', verb: '', rawInput };
  }

  // Check for direction commands
  const direction = DIRECTION_SYNONYMS[normalized] || normalized;
  if (['north', 'south', 'east', 'west', 'up', 'down', 'enter', 'exit'].includes(direction)) {
    return { type: 'movement', verb: direction, rawInput };
  }

  // Check for system commands
  const systemCommands = ['help', 'hint', 'inventory', 'look', 'score', 'quit', 'restart', 'map'];
  if (systemCommands.includes(normalized)) {
    return { type: 'system', verb: normalized, rawInput };
  }
  // Check for synonyms of system commands
  if (ACTION_SYNONYMS[normalized] === 'inventory' ||
      ACTION_SYNONYMS[normalized] === 'help') {
    return { type: 'system', verb: ACTION_SYNONYMS[normalized], rawInput };
  }

  // Check for spells (including "cast X" format)
  let spellAttempt = normalized;
  if (normalized.startsWith('cast ')) {
    spellAttempt = normalized.slice(5);
  }

  // Check for ACCIO with target
  if (spellAttempt.startsWith('accio ')) {
    const target = spellAttempt.slice(6).trim();
    return { type: 'spell', verb: 'accio', target, rawInput };
  }

  const spellMatch = matchSpell(spellAttempt);
  if (spellMatch) {
    return { type: 'spell', verb: spellMatch.spell, rawInput };
  }

  // Parse verb-noun commands
  const parts = normalized.split(' ');
  const firstWord = parts[0];
  const rest = parts.slice(1).join(' ');

  // Check for action synonyms
  const verb = ACTION_SYNONYMS[firstWord] || firstWord;

  // Special actions
  if (['examine', 'take', 'use', 'drop', 'read', 'open', 'close', 'attack', 'bow', 'ride', 'leave', 'crawl', 'claim', 'wear', 'remove', 'touch'].includes(verb)) {
    return { type: 'action', verb, target: rest || undefined, rawInput };
  }

  // Two-word action synonyms
  const twoWords = `${parts[0]} ${parts[1] || ''}`.trim();
  if (ACTION_SYNONYMS[twoWords]) {
    return {
      type: 'action',
      verb: ACTION_SYNONYMS[twoWords],
      target: parts.slice(2).join(' ') || undefined,
      rawInput
    };
  }

  // Check if it might be a misspelled spell
  if (spellAttempt.length > 3) {
    // Could be a failed spell attempt
    return { type: 'spell', verb: 'unknown_spell', target: spellAttempt, rawInput };
  }

  return { type: 'unknown', verb: normalized, rawInput };
}

// Check if command is an Unforgivable Curse attempt
export function checkUnforgivable(command: ParsedCommand): string | null {
  if (command.type === 'spell' && isUnforgivable(command.verb)) {
    return `The use of Unforgivable Curses is strictly forbidden by the Ministry of Magic.
As an Auror candidate, you should know that using such curses would result in
immediate imprisonment in Azkaban. You feel your wand arm lower instinctively.

The examiners are watching. Choose a different approach.`;
  }
  return null;
}

// Get description of current location
export function getLocationDescription(state: GameState): string {
  const location = LOCATIONS[state.location];
  if (!location) return "You are nowhere.";

  if (location.getDescription) {
    return location.getDescription(state);
  }
  return location.description;
}

// Handle look command
export function handleLook(state: GameState): CommandResult {
  return {
    message: getLocationDescription(state),
    state,
  };
}

// Handle inventory command
export function handleInventory(state: GameState): CommandResult {
  if (state.inventory.length === 0) {
    return {
      message: "You are carrying nothing but your wand.",
      state,
    };
  }

  const items = state.inventory.map(item => {
    switch (item) {
      case 'dittany': return 'Essence of Dittany';
      case 'wiggenweld_potion': return 'Wiggenweld Potion';
      case 'healing_herbs': return 'Dried Healing Herbs';
      case 'invisibility_cloak':
        return state.challengeState.wearingCloak
          ? 'Invisibility Cloak (wearing)'
          : 'Invisibility Cloak';
      default: return item;
    }
  });

  return {
    message: `You are carrying:\n- ${items.join('\n- ')}\n\nAnd of course, your wand.`,
    state,
  };
}

// Handle help command
export function handleHelp(): CommandResult {
  return {
    message: `AUROR EXAMINATION - COMMAND HELP

Movement: NORTH, SOUTH, EAST, WEST (or N, S, E, W)
Look around: LOOK
Check items: INVENTORY (or I)
Examine things: EXAMINE [object]
Take items: TAKE [object]
Use items: USE [item]
Check score: SCORE
Get a hint: HINT (if you're stuck)
See map: MAP

To cast spells, simply type the incantation.
You must know the correct magical words - this is an examination!

Remember: An Auror must be resourceful. Explore carefully and use
your knowledge of the magical world.`,
    state: undefined as unknown as GameState,
  };
}

// Handle score command
export function handleScore(state: GameState): CommandResult {
  const completedChallenges = Array.from(state.challengesCompleted).length;

  return {
    message: `EXAMINATION PROGRESS

Challenges completed: ${completedChallenges}/9
Current score: ${state.score} points
Hints used: ${state.hintsUsed}
Health: ${state.health}/${state.maxHealth}

Keep going. The final chamber awaits.`,
    state,
    color: 'gold',
  };
}

// Handle map command - ASCII visual map (only shows explored areas)
export function handleMap(state: GameState): CommandResult {
  const v = state.visitedLocations;
  const current = state.location;

  // Helper to show a location (only if visited)
  const show = (loc: string, short: string): string => {
    if (current === loc) return `[${short}]`;
    if (v.has(loc)) return ` ${short} `;
    return ' ?? ';
  };

  // Helper to show a connection (only if both endpoints visited)
  const conn = (loc1: string, loc2: string, symbol: string): string => {
    if (v.has(loc1) && v.has(loc2)) return symbol;
    return ' '.repeat(symbol.length);
  };

  // Build ASCII map showing only explored areas
  const map = `
╔═══════════════════════════════════════════════════════════════════╗
║                    EXAMINATION MAZE MAP                           ║
║           [XX] = Current    XX = Visited    ?? = Unexplored       ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║                          ${show('final_chamber', 'FIN')}                              ║
║                            ${conn('final_chamber', 'final_approach', '|')}                                      ║
║                          ${show('final_approach', 'APP')}                              ║
║                            ${conn('final_approach', 'death_eater_chamber', '|')}                                      ║
║                          ${show('death_eater_chamber', 'DUE')}                                    ║
║                            ${conn('death_eater_chamber', 'beyond_guards', '|')}                                      ║
║          ${show('armory_corridor', 'ARM')} ${conn('armory_corridor', 'beyond_guards', '--------')} ${show('beyond_guards', 'INN')}                              ║
║            ${conn('armory_corridor', 'training_hall', '|')}                ${conn('beyond_guards', 'guard_corridor', '|')}                                     ║
║          ${show('training_hall', 'TRN')}            ${show('guard_corridor', 'GRD')}                                ║
║            ${conn('training_hall', 'chasm_other_side', '|')}                ${conn('guard_corridor', 'beyond_creature', '|')}                                     ║
║          ${show('chasm_other_side', 'BYC')}            ${show('beyond_creature', 'NTH')}                              ║
║            ${conn('chasm_other_side', 'dementor_chamber', '|')}   ${conn('chasm_other_side', 'chasm_room', '|')}            ${conn('beyond_creature', 'creature_enclosure', '|')}                                     ║
║    ${show('dementor_chamber', 'DEM')}   ${show('chasm_room', 'CHA')}       ${show('creature_enclosure', 'CRE')}                               ║
║      ${conn('dementor_chamber', 'beyond_dementor', '|')}       ${conn('chasm_room', 'deep_tunnel', '|')}              ${conn('creature_enclosure', 'lake_shore', '|')}                                     ║
║    ${show('beyond_dementor', 'EAS')}   ${show('deep_tunnel', 'TUN')}        ${show('lake_shore', 'SHR')}                              ║
║      ${conn('beyond_dementor', 'inferi_lake', '|')}       ${conn('deep_tunnel', 'dark_corridor', '|')}   ${conn('deep_tunnel', 'shadow_passage', '|')}            ${conn('lake_shore', 'inferi_lake', '|')}                                     ║
║    ${show('inferi_lake', 'LAK')} ${show('dark_corridor', 'DRK')} ${show('shadow_passage', 'SHD')} ${conn('shadow_passage', 'hidden_room', '---')} ${show('hidden_room', 'HID')}                    ║
║             ${conn('dark_corridor', 'entrance_hall', '|')}                                                     ║
║ ${show('water_passage', 'WAT')} ${conn('water_passage', 'entrance_hall', '---')} ${show('entrance_hall', 'ENT')} ${conn('entrance_hall', 'preparation_room', '---')} ${show('preparation_room', 'PRP')}                              ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  LEGEND: (rooms revealed as you explore)                          ║
║  ENT=Entrance  DRK=Dark Corridor  TUN=Deep Tunnel  CHA=Chasm      ║
║  DEM=Dementor  LAK=Inferi Lake    CRE=Hippogriff   GRD=Guards     ║
║  TRN=Training  DUE=Death Eater    FIN=Final Chamber               ║
╚═══════════════════════════════════════════════════════════════════╝`;

  return {
    message: map,
    state,
  };
}
