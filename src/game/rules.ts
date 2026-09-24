import type { Board, CellValue, Mark, Outcome } from './types';

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function createEmptyBoard(): Board {
  return Array<CellValue>(9).fill(null);
}

export function otherPlayer(player: Mark): Mark {
  return player === 'X' ? 'O' : 'X';
}

export function evaluateBoard(board: Board): Outcome {
  for (const [a, b, c] of WINNING_LINES) {
    const winner = board[a];
    if (winner && winner === board[b] && winner === board[c]) {
      const winningCells = [
        ...new Set(
          WINNING_LINES
            .filter((line) => line.every((index) => board[index] === winner))
            .flatMap((line) => [...line]),
        ),
      ].sort((left, right) => left - right);
      return { status: 'won', winner, winningCells };
    }
  }
  return board.every((cell) => cell !== null)
    ? { status: 'draw' }
    : { status: 'playing' };
}

export function getCellLabel(index: number, value: CellValue): string {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  return 'Row ' + row + ', column ' + column + ': ' + (value ?? 'empty');
}
