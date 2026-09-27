import { useEffect, useReducer, useRef, useState } from 'react';
import { evaluateBoard } from './game/rules';
import { createInitialState, gameReducer } from './game/reducer';
import { Board } from './components/Board';
import { PlayerPanel } from './components/PlayerPanel';
import { GameStatus } from './components/GameStatus';
import { Scoreboard } from './components/Scoreboard';
import { GameControls } from './components/GameControls';
import { Rules } from './components/Rules';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const outcome = evaluateBoard(state.board);

  const isPlaying = outcome.status === 'playing';
  const hasMoves = state.board.some((cell) => cell !== null);
  const hasScores = state.scores.X + state.scores.O + state.scores.draws > 0;
  const canRestart = isPlaying && hasMoves;
  const canPlayAgain = !isPlaying;
  const canReset = hasMoves || hasScores || state.roundNumber > 1;
  const winningCells = outcome.status === 'won' ? outcome.winningCells : [];

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const pendingBoardFocus = useRef(false);

  useEffect(() => {
    if (pendingBoardFocus.current) {
      pendingBoardFocus.current = false;
      const firstCell = boardRef.current?.querySelector<HTMLButtonElement>('button');
      firstCell?.focus();
    }
  }, [state]);

  useEffect(() => {
    if (isConfirmingReset) {
      confirmButtonRef.current?.focus();
    }
  }, [isConfirmingReset]);

  function handlePlay(index: number) {
    if (isConfirmingReset) return;
    dispatch({ type: 'PLAY', index });
  }

  function handleRestart() {
    pendingBoardFocus.current = true;
    dispatch({ type: 'RESTART_ROUND' });
  }

  function handlePlayAgain() {
    pendingBoardFocus.current = true;
    dispatch({ type: 'NEXT_ROUND' });
  }

  function handleRequestReset() {
    setIsConfirmingReset(true);
  }

  function handleCancelReset() {
    setIsConfirmingReset(false);
    setTimeout(() => {
      resetButtonRef.current?.focus();
    }, 0);
  }

  function handleConfirmReset() {
    setIsConfirmingReset(false);
    pendingBoardFocus.current = true;
    dispatch({ type: 'RESET_MATCH' });
  }

  useEffect(() => {
    if (!isConfirmingReset) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelReset();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isConfirmingReset]);

  const boardLocked = !isPlaying || isConfirmingReset;
  const activeX = isPlaying && state.nextPlayer === 'X';
  const activeO = isPlaying && state.nextPlayer === 'O';

  return (
    <div className="min-h-[100svh] bg-paper pb-8 pt-6 sm:pb-12 sm:pt-8">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] text-ink">
              Side by Side
            </h1>
            <p className="text-muted">Two players. One board.</p>
          </div>
          <p className="text-sm text-muted">Local two-player · Same device</p>
        </header>

        <div className="mt-8 grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
          <div className="flex flex-col gap-4 lg:row-span-4">
            <p className="text-sm font-medium text-muted">Round {state.roundNumber}</p>
            <GameStatus outcome={outcome} nextPlayer={state.nextPlayer} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <PlayerPanel player="X" isActive={activeX} />
            </div>
            <div className="flex-1">
              <PlayerPanel player="O" isActive={activeO} />
            </div>
          </div>

          <div className="flex justify-center lg:justify-start">
            <Board
              board={state.board}
              winningCells={winningCells}
              isLocked={boardLocked}
              onPlay={handlePlay}
              boardRef={boardRef}
            />
          </div>

          <div className="space-y-4">
            <GameControls
              canRestart={canRestart}
              canPlayAgain={canPlayAgain}
              canReset={canReset}
              isConfirmingReset={isConfirmingReset}
              onRestart={handleRestart}
              onPlayAgain={handlePlayAgain}
              onRequestReset={handleRequestReset}
              resetButtonRef={resetButtonRef}
            />

            {isConfirmingReset && (
              <section
                role="region"
                aria-label="Reset the match?"
                className="rounded-xl border-2 border-boundary bg-surface p-4"
              >
                <h2 className="font-semibold text-ink">Reset the match?</h2>
                <p className="mt-1 text-sm text-muted">
                  This clears the board and both players&#39; scores.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    ref={confirmButtonRef}
                    onClick={handleConfirmReset}
                    className="rounded-[10px] bg-ink px-5 py-2.5 text-sm font-semibold text-surface min-h-[44px]"
                  >
                    Confirm reset
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelReset}
                    className="rounded-[10px] border-2 border-boundary px-4 py-2 text-sm font-medium text-ink min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-start-1 lg:row-start-3">
            <Scoreboard scores={state.scores} />
            <p className="mt-2 text-xs text-muted">Scores last until this page is refreshed.</p>
          </div>

          <div className="lg:col-start-1 lg:row-start-4">
            <Rules />
          </div>
        </div>
      </div>
    </div>
  );
}
