export function Rules() {
  return (
    <details className="text-sm text-muted">
      <summary className="cursor-pointer font-semibold text-ink select-none">How to play</summary>
      <ol className="mt-3 space-y-1.5 list-decimal pl-5">
        <li>Two players share this device. Player X starts the first round.</li>
        <li>Take turns choosing an empty square.</li>
        <li>Make a row, column, or diagonal of three matching marks to win.</li>
        <li>If all squares fill without a winner, the round is a draw.</li>
        <li>Play again to swap the starting player. Restart round keeps the current starter.</li>
      </ol>
    </details>
  );
}
