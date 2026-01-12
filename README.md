# Auror Examination

A text-based adventure game set in the Harry Potter universe. Take the final Auror examination and prove your worth through magical challenges, combat encounters, and moral decisions.

## Play Online

The game is hosted on Vercel. Simply visit the deployed URL and start playing!

## Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

This is a classic text adventure game. Type commands to interact with the world.

### Basic Commands

- **Movement**: `NORTH`, `SOUTH`, `EAST`, `WEST` (or `N`, `S`, `E`, `W`)
- **Look around**: `LOOK`
- **Check inventory**: `INVENTORY` (or `I`)
- **Examine objects**: `EXAMINE [object]`
- **Take items**: `TAKE [object]`
- **Use items**: `USE [item]`
- **View score**: `SCORE`
- **See map**: `MAP`
- **Get help**: `HELP`
- **Get a hint**: `HINT` (costs points!)

### Casting Spells

To cast spells, simply type the **incantation**. You must know the correct magical words - this is an examination, after all! The game will accept minor typos, but you need to use proper spell incantations, not English descriptions.

### Tips

- Pay attention to environmental descriptions - they contain hints
- Explore thoroughly before proceeding
- Some items can heal you - use them wisely
- Different challenges require different magical knowledge
- Not every problem needs to be solved with force
- The examiners are watching your moral choices

### Grading System

Your performance is graded O.W.L./N.E.W.T. style:

- **O (Outstanding)** - Elite Auror material
- **E (Exceeds Expectations)** - Excellent Auror
- **A (Acceptable)** - Qualified Auror
- **P (Poor)** - Must retake examination
- **D (Dreadful)** - Failed
- **T (Troll)** - Catastrophic failure

Earn points by completing challenges, finding secrets, and making wise choices. Lose points for using hints or excessive violence.

## Deployment to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Deploy with default settings

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Technology

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Traditional text parser (no LLM/AI API calls)

## Credits

Inspired by classic text adventures like Zork and Colossal Cave Adventure, set in the magical world created by J.K. Rowling.

This is a fan project for educational and entertainment purposes.
