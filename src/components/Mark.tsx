import type { Mark } from '../game/types';

type MarkProps = { readonly value: Mark };

export function Mark({ value }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-[46%] w-[46%]"
      aria-hidden="true"
      focusable="false"
    >
      {value === 'X' ? (
        <g stroke="currentColor" strokeWidth={6} strokeLinecap="round" fill="none">
          <line x1={16} y1={16} x2={48} y2={48} />
          <line x1={48} y1={16} x2={16} y2={48} />
        </g>
      ) : (
        <circle
          cx={32}
          cy={32}
          r={22}
          stroke="currentColor"
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
