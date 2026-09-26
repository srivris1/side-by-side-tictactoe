import type { Mark, Outcome } from '../game/types';

type GameStatusProps = {
  readonly outcome: Outcome;
  readonly nextPlayer: Mark;
};

export function GameStatus({ outcome, nextPlayer }: GameStatusProps) {
  let headline: string;
  let support: string;

  switch (outcome.status) {
    case 'won':
      headline = 'Player ' + outcome.winner + ' wins!';
      support = 'A line well played. Ready for another round?';
      break;
    case 'draw':
      headline = "It's a draw!";
      support = 'The board is full. Try again with a fresh round.';
      break;
    case 'playing':
    default:
      headline = 'Player ' + nextPlayer + "'s turn";
      support = 'Choose an empty square. First to get three in a row wins.';
      break;
  }

  return (
    <div>
      <p role="status" aria-atomic="true" className="text-[clamp(1.25rem,3vw,1.75rem)] font-semibold">
        {headline}
      </p>
      <p className="mt-1 text-sm text-muted">{support}</p>
    </div>
  );
}
