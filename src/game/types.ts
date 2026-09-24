export type Mark = 'X' | 'O';
export type CellValue = Mark | null;
export type Board = readonly CellValue[];

export type Outcome =
  | { readonly status: 'playing' }
  | {
      readonly status: 'won';
      readonly winner: Mark;
      readonly winningCells: readonly number[];
    }
  | { readonly status: 'draw' };

export type Scores = {
  readonly X: number;
  readonly O: number;
  readonly draws: number;
};

export type GameState = {
  readonly board: Board;
  readonly nextPlayer: Mark;
  readonly startingPlayer: Mark;
  readonly roundNumber: number;
  readonly scores: Scores;
};

export type GameAction =
  | { readonly type: 'PLAY'; readonly index: number }
  | { readonly type: 'RESTART_ROUND' }
  | { readonly type: 'NEXT_ROUND' }
  | { readonly type: 'RESET_MATCH' };
