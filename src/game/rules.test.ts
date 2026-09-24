import { describe, expect, it } from 'vitest';
import type { CellValue, Mark } from './types';
import {
  createEmptyBoard,
  evaluateBoard,
  getCellLabel,
  otherPlayer,
  WINNING_LINES,
} from './rules';

describe('board rules', () => {
  it('creates distinct empty boards', () => {
    const first = createEmptyBoard();
    expect(first).toEqual(Array(9).fill(null));
    expect(createEmptyBoard()).not.toBe(first);
    expect(evaluateBoard(first)).toEqual({ status: 'playing' });
  });

  for (const player of ['X', 'O'] as const) {
    for (const line of WINNING_LINES) {
      it(player + ' wins on ' + line.join(','), () => {
        const board = Array<CellValue>(9).fill(null);
        for (const index of line) board[index] = player;
        expect(evaluateBoard(board)).toEqual({
          status: 'won',
          winner: player,
          winningCells: [...line],
        });
      });
    }
  }

  it('does not award a win for two marks', () => {
    expect(evaluateBoard(['X', 'X', null, null, 'O', null, null, null, null]))
      .toEqual({ status: 'playing' });
  });

  it('detects a full-board draw', () => {
    expect(evaluateBoard(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']))
      .toEqual({ status: 'draw' });
  });

  it('checks wins before draws and combines both winning diagonals', () => {
    expect(evaluateBoard(['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X']))
      .toEqual({ status: 'won', winner: 'X', winningCells: [0, 2, 4, 6, 8] });
  });

  it.each<[number, CellValue, string]>([
    [0, null, 'Row 1, column 1: empty'],
    [4, 'X', 'Row 2, column 2: X'],
    [8, 'O', 'Row 3, column 3: O'],
  ])('labels cell %i', (index, value, label) => {
    expect(getCellLabel(index, value)).toBe(label);
  });

  it.each<[Mark, Mark]>([['X', 'O'], ['O', 'X']])(
    'switches %s to %s',
    (player, next) => expect(otherPlayer(player)).toBe(next),
  );
});
