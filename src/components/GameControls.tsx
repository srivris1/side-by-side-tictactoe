import type { RefObject } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';

type GameControlsProps = {
  readonly canRestart: boolean;
  readonly canPlayAgain: boolean;
  readonly canReset: boolean;
  readonly isConfirmingReset: boolean;
  readonly onRestart: () => void;
  readonly onPlayAgain: () => void;
  readonly onRequestReset: () => void;
  readonly resetButtonRef?: RefObject<HTMLButtonElement | null>;
};

export function GameControls({
  canRestart,
  canPlayAgain,
  canReset,
  isConfirmingReset,
  onRestart,
  onPlayAgain,
  onRequestReset,
  resetButtonRef,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {canPlayAgain && (
        <button
          type="button"
          disabled={isConfirmingReset}
          onClick={onPlayAgain}
          className="rounded-[10px] bg-ink px-5 py-2.5 min-h-[44px] text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCw size={16} className="mr-1.5 inline-block align-text-bottom" aria-hidden="true" />
          Play again
        </button>
      )}
      <button
        type="button"
        disabled={!canRestart || isConfirmingReset}
        onClick={onRestart}
        className="rounded-[10px] border-2 border-boundary px-4 py-2 min-h-[44px] text-sm font-medium text-ink transition-opacity hover:bg-divider/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw size={16} className="mr-1.5 inline-block align-text-bottom" aria-hidden="true" />
        Restart round
      </button>
      <button
        type="button"
        ref={resetButtonRef}
        disabled={!canReset || isConfirmingReset}
        onClick={onRequestReset}
        className="rounded-[10px] border-2 border-boundary px-4 py-2 min-h-[44px] text-sm font-medium text-ink transition-opacity hover:bg-divider/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset match
      </button>
    </div>
  );
}
