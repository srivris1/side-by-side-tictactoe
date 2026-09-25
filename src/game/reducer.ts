import type { GameAction, GameState, Scores } from './types';
import { createEmptyBoard, evaluateBoard, otherPlayer } from './rules';

export function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    nextPlayer: 'X',
    startingPlayer: 'X',
    roundNumber: 1,
    scores: { X: 0, O: 0, draws: 0 },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      if (
        !Number.isInteger(action.index) ||
        action.index < 0 ||
        action.index >= state.board.length ||
        state.board[action.index] !== null ||
        evaluateBoard(state.board).status !== 'playing'
      ) {
        return state;
      }

      const board = state.board.map((cell, index) =>
        index === action.index ? state.nextPlayer : cell,
      );
      const outcome = evaluateBoard(board);
      const scores: Scores =
        outcome.status === 'won'
          ? {
              ...state.scores,
              [outcome.winner]: state.scores[outcome.winner] + 1,
            }
          : outcome.status === 'draw'
            ? { ...state.scores, draws: state.scores.draws + 1 }
            : state.scores;

      return {
        ...state,
        board,
        nextPlayer: otherPlayer(state.nextPlayer),
        scores,
      };
    }
    case 'RESTART_ROUND': {
      if (
        evaluateBoard(state.board).status !== 'playing' ||
        state.board.every((cell) => cell === null)
      ) {
        return state;
      }
      return {
        ...state,
        board: createEmptyBoard(),
        nextPlayer: state.startingPlayer,
      };
    }
    case 'NEXT_ROUND': {
      if (evaluateBoard(state.board).status === 'playing') {
        return state;
      }
      const startingPlayer = otherPlayer(state.startingPlayer);
      return {
        ...state,
        board: createEmptyBoard(),
        startingPlayer,
        nextPlayer: startingPlayer,
        roundNumber: state.roundNumber + 1,
      };
    }
    case 'RESET_MATCH':
      return createInitialState();
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}
