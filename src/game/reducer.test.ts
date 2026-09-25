import { describe, expect, it } from 'vitest';
import type { GameState } from './types';
import { evaluateBoard } from './rules';
import { createInitialState, gameReducer } from './reducer';

function play(moves: readonly number[], start = createInitialState()): GameState {
  return moves.reduce(
    (state, index) => gameReducer(state, { type: 'PLAY', index }),
    start,
  );
}

describe('game reducer', () => {
  it('starts a new match with X and zero scores', () => {
    expect(createInitialState()).toEqual({
      board: Array(9).fill(null),
      nextPlayer: 'X',
      startingPlayer: 'X',
      roundNumber: 1,
      scores: { X: 0, O: 0, draws: 0 },
    });
  });

  it('alternates turns, preserving prior states', () => {
    const first = createInitialState();
    Object.freeze(first.board);
    Object.freeze(first.scores);
    Object.freeze(first);
    const second = play([0], first);
    const third = play([4], second);
    expect(first.board).toEqual(Array(9).fill(null));
    expect(second.board[0]).toBe('X');
    expect(second.board[4]).toBeNull();
    expect(second.nextPlayer).toBe('O');
    expect(third.board[4]).toBe('O');
    expect(third.nextPlayer).toBe('X');
    expect(third.scores).toEqual({ X: 0, O: 0, draws: 0 });
  });

  it('ignores an occupied cell without switching turns', () => {
    const state = play([0]);
    expect(gameReducer(state, { type: 'PLAY', index: 0 })).toBe(state);
    expect(state.nextPlayer).toBe('O');
  });

  it.each([-1, 9, 99, 0.5, NaN, Infinity])('ignores invalid index %s', (index) => {
    const state = createInitialState();
    expect(gameReducer(state, { type: 'PLAY', index })).toBe(state);
  });

  it.each([
    { moves: [0, 3, 1, 4, 2], winner: 'X', scores: { X: 1, O: 0, draws: 0 } },
    { moves: [0, 3, 1, 4, 8, 5], winner: 'O', scores: { X: 0, O: 1, draws: 0 } },
  ])('scores a $winner win once and locks the board', ({ moves, winner, scores }) => {
    const state = play(moves);
    expect(evaluateBoard(state.board)).toMatchObject({ status: 'won', winner });
    expect(state.scores).toEqual(scores);
    for (let index = 0; index < 9; index += 1) {
      expect(gameReducer(state, { type: 'PLAY', index })).toBe(state);
    }
  });

  it('scores a draw once', () => {
    const state = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(evaluateBoard(state.board)).toEqual({ status: 'draw' });
    expect(state.scores).toEqual({ X: 0, O: 0, draws: 1 });
    expect(gameReducer(state, { type: 'PLAY', index: 8 })).toBe(state);
  });

  it('awards one win for a ninth move completing two lines', () => {
    const state = play([0, 1, 2, 3, 6, 5, 8, 7, 4]);
    expect(evaluateBoard(state.board)).toEqual({
      status: 'won', winner: 'X', winningCells: [0, 2, 4, 6, 8],
    });
    expect(state.scores).toEqual({ X: 1, O: 0, draws: 0 });
  });

  it('restarts only an unfinished nonempty round', () => {
    const initial = createInitialState();
    expect(gameReducer(initial, { type: 'RESTART_ROUND' })).toBe(initial);
    const partial = play([0, 4]);
    expect(gameReducer(partial, { type: 'RESTART_ROUND' })).toEqual(initial);
    const won = play([0, 3, 1, 4, 2]);
    expect(gameReducer(won, { type: 'RESTART_ROUND' })).toBe(won);
  });

  it('advances only after completion and preserves scores', () => {
    const partial = play([0]);
    expect(gameReducer(partial, { type: 'NEXT_ROUND' })).toBe(partial);
    const won = play([0, 3, 1, 4, 2]);
    const next = gameReducer(won, { type: 'NEXT_ROUND' });
    expect(next.board).toEqual(Array(9).fill(null));
    expect(next.startingPlayer).toBe('O');
    expect(next.nextPlayer).toBe('O');
    expect(next.roundNumber).toBe(2);
    expect(next.scores).toEqual(won.scores);
  });

  it('restarts an O-starting round without losing the O starter', () => {
    const won = play([0, 3, 1, 4, 2]);
    const next = gameReducer(won, { type: 'NEXT_ROUND' });
    const partial = play([0, 4], next);
    expect(partial.board[0]).toBe('O');
    expect(partial.board[4]).toBe('X');
    expect(gameReducer(partial, { type: 'RESTART_ROUND' })).toEqual(next);
  });

  it('alternates starters after draws and subsequent wins', () => {
    const draw = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    const second = gameReducer(draw, { type: 'NEXT_ROUND' });
    expect(second.startingPlayer).toBe('O');
    const oWin = play([0, 3, 1, 4, 2], second);
    expect(oWin.scores).toEqual({ X: 0, O: 1, draws: 1 });
    const third = gameReducer(oWin, { type: 'NEXT_ROUND' });
    expect(third.startingPlayer).toBe('X');
    expect(third.roundNumber).toBe(3);
  });

  it('resets a completed match to its initial state', () => {
    const won = play([0, 3, 1, 4, 2]);
    expect(gameReducer(won, { type: 'RESET_MATCH' })).toEqual(createInitialState());
  });
});
