import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Board } from './Board';
import { createEmptyBoard } from '../game/rules';

describe('Board', () => {
  it('renders nine labeled cells and forwards a legal move once', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    render(
      <Board board={createEmptyBoard()} winningCells={[]} isLocked={false} onPlay={onPlay} />,
    );
    const board = screen.getByRole('group', { name: 'Tic tac toe board' });
    expect(within(board).getAllByRole('button')).toHaveLength(9);
    await user.click(screen.getByRole('button', { name: 'Row 2, column 2: empty' }));
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(4);
  });

  it('guards occupied and locked cells despite remaining focusable', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    const { rerender } = render(
      <Board
        board={['X', null, null, null, null, null, null, null, null]}
        winningCells={[]}
        isLocked={false}
        onPlay={onPlay}
      />,
    );
    const occupied = screen.getByRole('button', { name: 'Row 1, column 1: X' });
    occupied.focus();
    expect(occupied).toHaveFocus();
    await user.click(occupied);
    expect(onPlay).not.toHaveBeenCalled();
    rerender(
      <Board board={createEmptyBoard()} winningCells={[]} isLocked onPlay={onPlay} />,
    );
    await user.click(screen.getByRole('button', { name: 'Row 1, column 1: empty' }));
    expect(onPlay).not.toHaveBeenCalled();
  });

  it('marks the winning cells', () => {
    render(
      <Board
        board={['X', 'X', 'X', 'O', 'O', null, null, null, null]}
        winningCells={[0, 1, 2]}
        isLocked
        onPlay={vi.fn()}
      />,
    );
    const cells = within(screen.getByRole('group', { name: 'Tic tac toe board' }))
      .getAllByRole('button');
    cells.forEach((cell, index) => {
      expect(cell).toHaveAttribute('data-winning', index < 3 ? 'true' : 'false');
      expect(cell).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('supports Enter and Space on an available cell', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    render(
      <Board board={createEmptyBoard()} winningCells={[]} isLocked={false} onPlay={onPlay} />,
    );
    screen.getByRole('button', { name: 'Row 1, column 1: empty' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onPlay.mock.calls).toEqual([[0], [0]]);
  });
});
