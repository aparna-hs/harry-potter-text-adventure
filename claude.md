# Claude Code Instructions for HP Auror Game

## Project Overview
Text adventure game - Harry Potter themed Auror examination. Built with Next.js 14, TypeScript.

**Target Audience:** The 0.01% who appreciate Zork, read the HP books (not just watched movies), and prefer typing to clicking. This is unabashedly niche.

**Live URL:** https://harry-potter-text-adventure.vercel.app/

## Core Philosophy
1. **Challenging by design** - No hand-holding, exact commands required, spell knowledge essential
2. **Book knowledge required** - Movie fans won't have enough info (e.g., bowing to hippogriffs, fire vs inferi)
3. **Classic parser-based** - Like it's 1985, no autocomplete, no fuzzy matching for commands
4. **Reward knowledge** - The game should feel rewarding for HP nerds who know the lore

## Code Style & Architecture

### File Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata & analytics
│   ├── page.tsx            # Home page (renders Terminal)
│   └── globals.css
├── components/
│   └── Terminal.tsx        # Main terminal UI component (~400 lines)
└── game/
    ├── types.ts            # TypeScript interfaces
    ├── engine.ts           # Core game logic (~2700 lines)
    ├── parser.ts           # Command parsing & system commands
    ├── spells.ts           # Spell definitions & fuzzy matching
    └── locations.ts        # All game locations & challenges
```

### Design Principles
- **Desktop:** Preserve classic terminal aesthetic - transparent input, blinking cursor, retro vibe
- **Mobile:** Modern UX with visible input box, send button, placeholder text
- **Responsive:** Use conditional rendering based on `isMobile` state (< 768px)
- **No emojis** unless user explicitly requests them
- **ASCII art:** Keep it simple and clean, fits terminal aesthetic

### Code Standards
- TypeScript strict mode
- Functional components with hooks
- No unnecessary abstractions - keep it simple
- Comments only where logic isn't self-evident
- Never commit without building first

## Hint System Rules

**CRITICAL:** Hints must guide without giving away answers directly.

### Hint Structure
- **Simple locations** (door, darkness, passage): Only 1 hint
- **Complex locations**: 2 progressive hints
- **Repeated hints**: Show same message with "[No additional penalty for repeated hint]"

### Good vs Bad Hints
❌ **Bad:** "The Unlocking Charm is 'Alohomora'."
✅ **Good:** "Think of the most basic unlocking charm. First years learn it."

❌ **Bad:** "BOW to the Hippogriff and wait for it to bow back."
✅ **Good:** "Remember Hagrid's Care of Magical Creatures lessons. How did he greet Buckbeak?"

**Rule:** First hint should be vague, second hint can be more specific but still require the player to know/figure out the actual command or spell.

## Testing Requirements

### Before Every Commit
1. Run `npm run build` - must compile successfully
2. Check TypeScript errors - zero tolerance
3. Test on mobile viewport if touching UI
4. Test on desktop to ensure classic aesthetic preserved

### Important Test Cases
- Command input works on both mobile and desktop
- Hints don't reveal answers directly
- Score can go negative (when using hints at 0 points)
- Journey log tracks properly
- Health bar displays correctly

## Documentation

### After Each Session
**Update CHANGELOG_SESSION.md** with:
- Date and summary
- Detailed changes by category
- Files modified
- Commit hashes
- Benefits/rationale

### For New Features
Consider if the feature aligns with:
- Classic text adventure style
- HP book knowledge requirement
- No hand-holding philosophy

## Common Pitfalls to Avoid

1. **Don't make hints too direct** - Players should need HP knowledge
2. **Don't add tutorials** - Part of the challenge is figuring things out
3. **Don't break desktop aesthetic** - Mobile changes should be mobile-only
4. **Don't lower difficulty** - This game is meant to be challenging
5. **Don't add autocomplete** - Exact commands are part of the experience

## Git Workflow

### Commit Messages
Use descriptive commits with Co-Authored-By:
```
Brief summary of changes

Detailed explanation if needed with:
- Bullet points for multiple changes
- Rationale for approach

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Branch Strategy
- Main branch for all development
- Test builds before pushing
- Push frequently to keep remote updated

## Key Context

### Game State Management
- State tracked in `GameState` interface (types.ts)
- Game phases: 'intro' | 'naming' | 'ready' | 'playing' | 'victory' | 'death'
- Hints tracked separately from attempts via `hintRequestCounts`
- Journey log tracks location history with directions

### Mobile vs Desktop
The game adapts based on screen width (768px breakpoint):
- **Mobile:** Smaller ASCII art, visible input controls, larger touch targets
- **Desktop:** Full ASCII art, transparent input, classic cursor

### Analytics
- Vercel Analytics integrated in layout.tsx
- Tracks visitor engagement automatically

## Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter

# Testing
npm run build        # Always build before commit
```

## Project History
See `CHANGELOG_SESSION.md` for detailed session-by-session changes.

## Questions?
- Check `README.md` for game overview
- Check `WALKTHROUGH.md` for complete solution
- Check `CHANGELOG_SESSION.md` for recent changes
