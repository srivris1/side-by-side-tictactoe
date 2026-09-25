import type { RefObject } from 'react';
import type { Board as BoardState } from '../game/types';
import { Cell } from './Cell';

type BoardProps = {
  readonly board: BoardState;
  readonly winningCells: readonly number[];
  readonly isLocked: boolean;
  readonly onPlay: (index: number) => void;
  readonly boardRef?: RefObject<HTMLDivElement | null>;
};

export function Board({ board, winningCells, isLocked, onPlay, boardRef }: BoardProps) {
  return (
    <div
      ref={boardRef}
      role="group"
      aria-label="Tic tac toe board"
      className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square w-full max-w-[480px]"
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          isWinning={winningCells.includes(index)}
          isLocked={isLocked}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}
