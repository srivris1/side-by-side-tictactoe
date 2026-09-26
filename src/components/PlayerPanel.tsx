import type { Mark as MarkType } from '../game/types';

type PlayerPanelProps = {
  readonly player: MarkType;
  readonly isActive: boolean;
};

export function PlayerPanel({ player, isActive }: PlayerPanelProps) {
  return (
    <div
      className={
        'flex items-center gap-3 rounded-xl px-4 py-3 border-2 transition-colors duration-150' +
        (isActive && player === 'X' ? ' border-player-x bg-player-x-tint' : '') +
        (isActive && player === 'O' ? ' border-player-o bg-player-o-tint' : '') +
        (!isActive ? ' border-divider bg-surface' : '')
      }
    >
      <span className={player === 'X' ? 'text-player-x' : 'text-player-o'}>
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true" focusable="false">
          {player === 'X' ? (
            <g stroke="currentColor" strokeWidth={6} strokeLinecap="round" fill="none">
              <line x1={16} y1={16} x2={48} y2={48} />
              <line x1={48} y1={16} x2={16} y2={48} />
            </g>
          ) : (
            <circle cx={32} cy={32} r={22} stroke="currentColor" strokeWidth={6} strokeLinecap="round" fill="none" />
          )}
        </svg>
      </span>
      <span className="font-semibold">Player {player}</span>
      {isActive && (
        <span className={
          'ml-auto rounded-full px-3 py-0.5 text-sm font-medium' +
          (player === 'X' ? ' bg-player-x text-surface' : ' bg-player-o text-surface')
        }>
          Your turn
        </span>
      )}
    </div>
  );
}
