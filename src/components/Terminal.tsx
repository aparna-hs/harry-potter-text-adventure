'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, CommandResult } from '@/game/types';
import { createInitialState, processCommand, calculateGrade } from '@/game/engine';
import { getLocationDescription } from '@/game/parser';

interface OutputLine {
  text: string;
  color?: 'normal' | 'damage' | 'healing' | 'magic' | 'gold' | 'warning';
  type?: 'system' | 'player' | 'game';
}

const ASCII_TITLE = `
 █████╗ ██╗   ██╗██████╗  ██████╗ ██████╗      ███████╗██╗  ██╗ █████╗ ███╗   ███╗
██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔══██╗     ██╔════╝╚██╗██╔╝██╔══██╗████╗ ████║
███████║██║   ██║██████╔╝██║   ██║██████╔╝     █████╗   ╚███╔╝ ███████║██╔████╔██║
██╔══██║██║   ██║██╔══██╗██║   ██║██╔══██╗     ██╔══╝   ██╔██╗ ██╔══██║██║╚██╔╝██║
██║  ██║╚██████╔╝██║  ██║╚██████╔╝██║  ██║     ███████╗██╔╝ ██╗██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
`;

const ASCII_TITLE_MOBILE = `
 ▄▀█ █ █ █▀█ █▀█ █▀█   █▀▀ ▀▄▀ ▄▀█ █▀▄▀█
 █▀█ █▄█ █▀▄ █▄█ █▀▄   ██▄ █░█ █▀█ █░▀░█
`;

const WAND_ART = `
              ══════════════ ✦ ★ ⚡
`;

const MINISTRY_HEADER = `
═══════════════════════════════════════════════════════════════════
              MINISTRY OF MAGIC - AUROR OFFICE
                   FINAL EXAMINATION
═══════════════════════════════════════════════════════════════════

This is the final test to become an Auror.

Real magical threats. Real danger.
Some candidates don't return.

`;

export default function Terminal() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize game on mount
  useEffect(() => {
    const title = isMobile ? ASCII_TITLE_MOBILE : ASCII_TITLE;
    const initialOutput: OutputLine[] = [
      { text: title, color: 'magic', type: 'system' },
      { text: WAND_ART, color: 'gold', type: 'system' },
      { text: MINISTRY_HEADER, color: 'normal', type: 'system' },
      { text: 'What is your name, candidate?', color: 'gold', type: 'system' },
    ];
    setOutput(initialOutput);
    setGameState(prev => ({ ...prev, gamePhase: 'naming' }));
  }, [isMobile]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on click
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const addOutput = useCallback((lines: OutputLine[]) => {
    setOutput(prev => [...prev, ...lines]);
  }, []);

  const handleCommand = useCallback((input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    // Echo player input
    addOutput([{ text: `> ${trimmedInput}`, type: 'player' }]);

    // Handle naming phase
    if (gameState.gamePhase === 'naming') {
      const name = trimmedInput;
      const newState = { ...gameState, playerName: name, gamePhase: 'playing' as const };
      setGameState(newState);

      addOutput([
        { text: '', type: 'game' },
        { text: `Good luck, ${name}.`, color: 'gold', type: 'system' },
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', type: 'system' },
        { text: '                         BRIEFING', color: 'gold', type: 'system' },
        { text: '═══════════════════════════════════════════════════════════════════', type: 'system' },
        { text: '', type: 'game' },
        { text: `You are about to enter the Ministry's underground examination maze.
Your goal: Navigate through dangerous challenges and reach the final chamber.

Along the way, you will face:
  • Dark creatures that test your defensive magic
  • Puzzles that require knowledge of spells
  • Combat situations requiring quick thinking
  • A final moral test that determines your worthiness

Remember your training. Cast spells by typing the incantation (e.g., LUMOS).
Explore by moving NORTH, SOUTH, EAST, or WEST.
EXAMINE objects, READ runes for hints, and check your INVENTORY.

Your wand is ready. Your knowledge will be tested.
Not all candidates survive.`, type: 'game' },
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', type: 'system' },
        { text: '                    YOUR EXAMINATION BEGINS', color: 'gold', type: 'system' },
        { text: '═══════════════════════════════════════════════════════════════════', type: 'system' },
        { text: '', type: 'game' },
        { text: getLocationDescription(newState), type: 'game' },
        { text: '', type: 'game' },
        { text: 'Type JOURNEY anytime to see where you\'ve been.', color: 'magic', type: 'system' },
        { text: 'Type HELP for commands or HINT if stuck (WARNING: hints reduce your score by 2 points).', color: 'magic', type: 'system' },
      ]);
      return;
    }

    // Handle restart confirm
    if (trimmedInput.toLowerCase() === 'restart confirm' || trimmedInput.toLowerCase() === 'restart') {
      const newState = createInitialState();
      setGameState(newState);
      setOutput([]);
      const title = isMobile ? ASCII_TITLE_MOBILE : ASCII_TITLE;
      const initialOutput: OutputLine[] = [
        { text: title, color: 'magic', type: 'system' },
        { text: WAND_ART, color: 'gold', type: 'system' },
        { text: MINISTRY_HEADER, color: 'normal', type: 'system' },
        { text: 'What is your name, candidate?', color: 'gold', type: 'system' },
      ];
      setOutput(initialOutput);
      setGameState(prev => ({ ...prev, gamePhase: 'naming' }));
      return;
    }

    // Handle death/victory state
    if (gameState.gamePhase === 'death') {
      addOutput([
        { text: '', type: 'game' },
        { text: 'The examination has ended. Type RESTART to try again.', type: 'system' },
      ]);
      return;
    }

    if (gameState.gamePhase === 'victory') {
      // Show final score
      const grade = calculateGrade(gameState);
      addOutput([
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'gold', type: 'system' },
        { text: '                    EXAMINATION RESULTS', color: 'gold', type: 'system' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'gold', type: 'system' },
        { text: '', type: 'game' },
        { text: `  Candidate: ${gameState.playerName}`, type: 'game' },
        { text: `  Final Score: ${gameState.score} points`, type: 'game' },
        { text: `  Health Remaining: ${gameState.health}/${gameState.maxHealth}`, type: 'game' },
        { text: `  Hints Used: ${gameState.hintsUsed}`, type: 'game' },
        { text: `  Challenges Completed: ${gameState.challengesCompleted.size}/9`, type: 'game' },
        { text: '', type: 'game' },
        { text: `  GRADE: ${grade.grade} - ${grade.title}`, color: 'gold', type: 'game' },
        { text: `  ${grade.description}`, type: 'game' },
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'gold', type: 'system' },
        { text: '', type: 'game' },
        { text: 'Congratulations on completing the Auror Examination!', color: 'magic', type: 'system' },
        { text: 'Type RESTART to play again.', type: 'system' },
      ]);
      setGameState(prev => ({ ...prev, gamePhase: 'death' })); // Prevent further commands
      return;
    }

    // Process command
    const result: CommandResult = processCommand(gameState, trimmedInput);
    setGameState(result.state);

    addOutput([
      { text: '', type: 'game' },
      { text: result.message, color: result.color, type: 'game' },
    ]);

    // Check for death
    if (result.state.gamePhase === 'death') {
      const grade = calculateGrade(result.state);
      addOutput([
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'damage', type: 'system' },
        { text: '                    EXAMINATION FAILED', color: 'damage', type: 'system' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'damage', type: 'system' },
        { text: '', type: 'game' },
        { text: `  Candidate: ${result.state.playerName}`, type: 'game' },
        { text: `  Final Score: ${result.state.score} points`, type: 'game' },
        { text: `  GRADE: ${grade.grade} - ${grade.title}`, color: 'damage', type: 'game' },
        { text: '', type: 'game' },
        { text: 'Type RESTART to try again.', type: 'system' },
      ]);
    }

    // Check for victory
    if (result.state.gamePhase === 'victory') {
      const grade = calculateGrade(result.state);
      addOutput([
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'gold', type: 'system' },
        { text: '                    EXAMINATION COMPLETE', color: 'gold', type: 'system' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'gold', type: 'system' },
        { text: '', type: 'game' },
        { text: `  Candidate: ${result.state.playerName}`, type: 'game' },
        { text: `  Final Score: ${result.state.score} points`, type: 'game' },
        { text: `  Health Remaining: ${result.state.health}/${result.state.maxHealth}`, type: 'game' },
        { text: `  Hints Used: ${result.state.hintsUsed}`, type: 'game' },
        { text: `  Challenges Completed: ${result.state.challengesCompleted.size}/9`, type: 'game' },
        { text: '', type: 'game' },
        { text: `  GRADE: ${grade.grade} - ${grade.title}`, color: 'gold', type: 'game' },
        { text: `  ${grade.description}`, type: 'game' },
        { text: '', type: 'game' },
        { text: '═══════════════════════════════════════════════════════════════════', color: 'gold', type: 'system' },
        { text: '', type: 'game' },
        { text: 'Type RESTART to play again.', type: 'system' },
      ]);
    }
  }, [gameState, addOutput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  }, [handleCommand, inputValue, commandHistory, historyIndex]);

  const getColorClass = (line: OutputLine) => {
    // Player input gets a distinct color
    if (line.type === 'player') {
      return 'text-cyan-300';
    }

    // Handle explicit colors
    switch (line.color) {
      case 'damage': return 'text-red-500';
      case 'healing': return 'text-green-400';
      case 'magic': return 'text-blue-400';
      case 'gold': return 'text-yellow-400';
      case 'warning': return 'text-orange-400';
      default: return 'text-gray-300';
    }
  };

  // Health bar component
  const renderHealthBar = () => {
    if (gameState.gamePhase !== 'playing') return null;

    const healthPercent = (gameState.health / gameState.maxHealth) * 100;
    const filledBlocks = Math.round(healthPercent / 10);
    const emptyBlocks = 10 - filledBlocks;

    let barColor = 'bg-green-500';
    if (healthPercent <= 25) barColor = 'bg-red-500';
    else if (healthPercent <= 50) barColor = 'bg-yellow-500';

    // Get current location name
    const currentLocation = gameState.location;
    const locationName = currentLocation.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Build inventory display
    const inventoryCount = gameState.inventory.length;
    const inventoryDisplay = inventoryCount === 0
      ? 'None'
      : inventoryCount <= 2
        ? gameState.inventory.map(item => {
            // Short names for status bar
            if (item === 'dittany') return 'Dittany';
            if (item === 'wiggenweld_potion') return 'Potion';
            if (item === 'healing_herbs') return 'Herbs';
            if (item === 'invisibility_cloak') return 'Cloak';
            return item;
          }).join(', ')
        : `${inventoryCount} items`;

    return (
      <div className="px-2 sm:px-4 py-2 border-b border-green-900 text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-blue-400">{locationName}</span>
          <span className="text-gray-500 hidden sm:inline">|</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap mt-1">
          <span className="text-green-400">HP:</span>
          <div className="flex">
            {[...Array(filledBlocks)].map((_, i) => (
              <div key={`filled-${i}`} className={`w-2 sm:w-3 h-3 sm:h-4 ${barColor} mr-0.5`} />
            ))}
            {[...Array(emptyBlocks)].map((_, i) => (
              <div key={`empty-${i}`} className="w-2 sm:w-3 h-3 sm:h-4 bg-gray-700 mr-0.5" />
            ))}
          </div>
          <span className="text-green-400">{gameState.health}/{gameState.maxHealth}</span>
          <span className="text-gray-500 mx-1">|</span>
          <span className="text-yellow-400">Score: {gameState.score}</span>
          <span className="text-gray-500 mx-1">|</span>
          <span className="text-purple-400">Items: {inventoryDisplay}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-green-900 px-2 sm:px-4 py-1 sm:py-2 bg-gray-900">
        <div className="text-green-400 font-mono text-xs sm:text-sm">
          {isMobile ? 'AUROR EXAM v1.0' : 'MINISTRY OF MAGIC - AUROR EXAMINATION TERMINAL v1.0'}
        </div>
      </div>

      {/* Health Bar */}
      {renderHealthBar()}

      {/* Output Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto"
      >
        {output.map((line, index) => (
          <div key={index} className={`${getColorClass(line)} whitespace-pre-wrap break-words`}>
            {line.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={`px-2 sm:px-4 py-3 sm:py-4 bg-gray-900 ${isMobile ? 'border-t-2 border-green-500' : 'border-t border-green-900'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-green-400 mr-1 text-sm sm:text-sm ${isMobile ? 'font-bold' : ''}`}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 text-green-400 outline-none font-mono text-sm sm:text-sm ${
              isMobile
                ? 'bg-gray-800 px-2 py-2 rounded border border-green-700 focus:border-green-500'
                : 'bg-transparent'
            }`}
            placeholder={isMobile ? "Type command..." : ""}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {isMobile ? (
            <button
              onClick={() => {
                handleCommand(inputValue);
                setInputValue('');
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded font-mono text-sm font-bold border border-green-500 active:bg-green-800 min-w-[60px]"
            >
              ⏎
            </button>
          ) : (
            <span className="text-green-400 cursor-blink text-sm">_</span>
          )}
        </div>
      </div>
    </div>
  );
}
