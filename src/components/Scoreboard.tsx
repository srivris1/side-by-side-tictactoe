import type { Scores } from '../game/types';

type ScoreboardProps = { readonly scores: Scores };

export function Scoreboard({ scores }: ScoreboardProps) {
  return (
    <dl className="flex justify-between gap-4 text-center">
      <div className="flex-1">
        <dt className="text-xs font-medium text-muted uppercase tracking-wide">Player X wins</dt>
        <dd data-testid="score-x" className="text-[28px] font-semibold tabular-nums text-player-x">{scores.X}</dd>
      </div>
      <div className="flex-1">
        <dt className="text-xs font-medium text-muted uppercase tracking-wide">Draws</dt>
        <dd data-testid="score-draws" className="text-[28px] font-semibold tabular-nums text-muted">{scores.draws}</dd>
      </div>
      <div className="flex-1">
        <dt className="text-xs font-medium text-muted uppercase tracking-wide">Player O wins</dt>
        <dd data-testid="score-o" className="text-[28px] font-semibold tabular-nums text-player-o">{scores.O}</dd>
      </div>
    </dl>
  );
}
