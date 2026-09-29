# Side by Side — Tic-Tac-Toe

A two-player Tic-Tac-Toe game you can play right in the browser. Nothing fancy on the backend — just open the page, hand your friend the keyboard, and take turns.

I built this as a college assignment to practice React state management, but honestly it turned into a fun little side project. The whole game state runs through a single `useReducer`, which keeps things predictable and easy to debug.

## What it does

- Two players share the same device, taking turns clicking squares
- X always goes first (in round 1 at least)
- After someone wins or the board fills up, hit "Play again" and the starting player swaps
- Scores stick around between rounds — they reset if you refresh the page or hit "Reset match"
- The winning line gets highlighted so you can see exactly how someone won
- Works on phones too, the layout adjusts for smaller screens

## Screenshots

The UI is pretty minimal — warm tones, clean typography (Outfit font), nothing overwhelming. Player X gets a red accent, Player O gets blue, and the active player's panel lights up so you always know whose turn it is.

## Tech stack

- **React 19** with TypeScript
- **Vite** for bundling (fast builds, no config headaches)
- **Tailwind CSS v4** for styling
- **Framer Motion** for the subtle mark animations (respects `prefers-reduced-motion`)
- **Vitest** + **React Testing Library** for unit/component tests
- **Playwright** for E2E tests

## Project structure

```
src/
├── game/
│   ├── types.ts        # type definitions for board, marks, state
│   ├── rules.ts        # pure functions — win detection, board eval
│   └── reducer.ts      # useReducer logic, all state transitions
├── components/
│   ├── Board.tsx        # 3x3 grid layout
│   ├── Cell.tsx         # individual square with animation
│   ├── Mark.tsx         # SVG X and O marks
│   ├── PlayerPanel.tsx  # shows which player is active
│   ├── GameStatus.tsx   # "Player X's turn" / "Player O wins!" etc
│   ├── GameControls.tsx # restart, play again, reset buttons
│   ├── Scoreboard.tsx   # running tally of wins and draws
│   └── Rules.tsx        # collapsible "how to play" section
├── App.tsx              # main app component, wires everything together
├── main.tsx             # entry point, renders into #root
└── index.css            # theme tokens + base styles
```

## Running locally

Make sure you have Node.js 18+ installed.

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Running tests

```bash
npm test              # unit + component tests
npm run test:e2e      # end-to-end tests (needs Playwright browsers installed)
```

## Building for production

```bash
npm run build
npm run preview       # serves the built files locally
```

The output goes into `dist/` — it's just static files, you can host it anywhere.

## Design decisions

I kept the game logic completely separate from React on purpose. The `rules.ts` file has zero React imports — it's just pure functions that take a board array and return an outcome. The reducer calls those functions but doesn't know anything about the UI. This made testing way easier since I could test the game logic independently.

The scoring happens inside the reducer too, not in a `useEffect`. That way there's no risk of double-counting or race conditions with score updates.

One thing I'm happy with is the accessibility — every cell has a proper aria-label ("Row 1, column 2: X"), the game status uses `role="status"` so screen readers announce changes, and the focus management actually works (first cell gets focused after reset, confirm button gets focused when the reset dialog opens, etc).

## What I'd add if I had more time

- Sound effects on mark placement
- A match history log
- Maybe online multiplayer with WebSockets, but that's a whole different project
- Dark mode (the warm paper color looks nice but some people prefer dark)

## License

Just a college project, use it however you want.
