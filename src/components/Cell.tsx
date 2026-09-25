import { motion, useReducedMotion } from 'framer-motion';
import type { CellValue } from '../game/types';
import { getCellLabel } from '../game/rules';
import { Mark } from './Mark';

type CellProps = {
  readonly index: number;
  readonly value: CellValue;
  readonly isWinning: boolean;
  readonly isLocked: boolean;
  readonly onPlay: (index: number) => void;
};

export function Cell({ index, value, isWinning, isLocked, onPlay }: CellProps) {
  const unavailable = isLocked || value !== null;
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      aria-label={getCellLabel(index, value)}
      aria-disabled={unavailable}
      data-winning={isWinning ? 'true' : 'false'}
      className={
        'cell flex items-center justify-center rounded-[10px] border-2 transition-colors duration-150' +
        ' bg-surface aspect-square cursor-pointer' +
        (isWinning && value === 'X' ? ' border-player-x bg-player-x-tint' : '') +
        (isWinning && value === 'O' ? ' border-player-o bg-player-o-tint' : '') +
        (!isWinning ? ' border-boundary' : '') +
        (!unavailable ? ' hover:bg-divider/30' : '') +
        (value === 'X' ? ' text-player-x' : '') +
        (value === 'O' ? ' text-player-o' : '')
      }
      onClick={() => {
        if (!unavailable) onPlay(index);
      }}
    >
      {value !== null && (
        <motion.span
          className="flex items-center justify-center w-full h-full"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: 'easeOut' }}
        >
          <Mark value={value} />
        </motion.span>
      )}
    </button>
  );
}
