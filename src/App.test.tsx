import { StrictMode } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

function renderApp() {
  const user = userEvent.setup();
  render(<StrictMode><App /></StrictMode>);
  const cells = within(screen.getByRole('group', { name: 'Tic tac toe board' }))
    .getAllByRole('button');
  return { user, cells };
}

describe('App integration', () => {
  it('shows initial state with X to move', () => {
    renderApp();
    expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
    expect(screen.getByText('Round 1', { exact: true })).toBeInTheDocument();
    for (const id of ['score-x', 'score-o', 'score-draws']) {
      expect(screen.getByTestId(id)).toHaveTextContent(/^0$/);
    }
  });

  it('alternates turns on legal moves', async () => {
    const { user, cells } = renderApp();
    await user.click(cells[0]);
    expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");
    await user.click(cells[4]);
    expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
  });

  it('scores an X win and locks the board', async () => {
    const { user, cells } = renderApp();
    for (const index of [0, 3, 1, 4, 2]) await user.click(cells[index]);
    expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
    await user.click(cells[8]);
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
  });

  it('scores an O win', async () => {
    const { user, cells } = renderApp();
    for (const index of [0, 3, 1, 4, 8, 5]) await user.click(cells[index]);
    expect(screen.getByRole('status')).toHaveTextContent('Player O wins!');
    expect(screen.getByTestId('score-o')).toHaveTextContent(/^1$/);
  });

  it('scores a draw', async () => {
    const { user, cells } = renderApp();
    for (const index of [0, 1, 2, 4, 3, 5, 7, 6, 8]) await user.click(cells[index]);
    expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    expect(screen.getByTestId('score-draws')).toHaveTextContent(/^1$/);
  });

  it('restarts a partial board keeping round and scores', async () => {
    const { user, cells } = renderApp();
    await user.click(cells[0]);
    await user.click(cells[4]);
    await user.click(screen.getByRole('button', { name: 'Restart round' }));
    expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
    expect(screen.getByText('Round 1', { exact: true })).toBeInTheDocument();
    for (const id of ['score-x', 'score-o', 'score-draws']) {
      expect(screen.getByTestId(id)).toHaveTextContent(/^0$/);
    }
  });

  it('plays again with O starting round 2 and preserves score', async () => {
    const { user, cells } = renderApp();
    for (const index of [0, 3, 1, 4, 2]) await user.click(cells[index]);
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
    await user.click(screen.getByRole('button', { name: 'Play again' }));
    expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");
    expect(screen.getByText('Round 2', { exact: true })).toBeInTheDocument();
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
    await waitFor(() => expect(cells[0]).toHaveFocus());
  });

  it('shows and cancels reset confirmation preserving state', async () => {
    const { user, cells } = renderApp();
    for (const index of [0, 3, 1, 4, 2]) await user.click(cells[index]);
    await user.click(screen.getByRole('button', { name: 'Play again' }));

    await user.click(screen.getByRole('button', { name: 'Reset match' }));
    expect(screen.getByRole('region', { name: 'Reset the match?' })).toBeVisible();
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
    expect(screen.getByRole('button', { name: 'Reset match' })).toHaveFocus();
  });

  it('confirms reset to fresh state and focuses first cell', async () => {
    const { user, cells } = renderApp();
    for (const index of [0, 3, 1, 4, 2]) await user.click(cells[index]);
    await user.click(screen.getByRole('button', { name: 'Play again' }));

    await user.click(screen.getByRole('button', { name: 'Reset match' }));
    await user.click(screen.getByRole('button', { name: 'Confirm reset' }));
    expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
    expect(screen.getByText('Round 1', { exact: true })).toBeInTheDocument();
    for (const id of ['score-x', 'score-o', 'score-draws']) {
      expect(screen.getByTestId(id)).toHaveTextContent(/^0$/);
    }
    await waitFor(() => expect(cells[0]).toHaveFocus());
  });

  it('scores once, alternates starters, and confirms a full reset', async () => {
    const user = userEvent.setup();
    render(<StrictMode><App /></StrictMode>);
    const cells = within(screen.getByRole('group', { name: 'Tic tac toe board' }))
      .getAllByRole('button');
    for (const index of [0, 3, 1, 4, 2]) await user.click(cells[index]);
    expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);

    await user.click(cells[8]);
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
    await user.click(screen.getByRole('button', { name: 'Play again' }));
    expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");
    expect(screen.getByText('Round 2', { exact: true })).toBeInTheDocument();
    await waitFor(() => expect(cells[0]).toHaveFocus());

    await user.click(screen.getByRole('button', { name: 'Reset match' }));
    expect(screen.getByRole('region', { name: 'Reset the match?' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByTestId('score-x')).toHaveTextContent(/^1$/);
    expect(screen.getByRole('button', { name: 'Reset match' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Reset match' }));
    await user.click(screen.getByRole('button', { name: 'Confirm reset' }));
    expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
    expect(screen.getByText('Round 1', { exact: true })).toBeInTheDocument();
    for (const id of ['score-x', 'score-o', 'score-draws']) {
      expect(screen.getByTestId(id)).toHaveTextContent(/^0$/);
    }
    await waitFor(() => expect(cells[0]).toHaveFocus());
  });

  it('Escape cancels confirmation and restores reset button focus', async () => {
    const { user, cells } = renderApp();
    await user.click(cells[0]);
    await user.click(screen.getByRole('button', { name: 'Reset match' }));
    expect(screen.getByRole('region', { name: 'Reset the match?' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region', { name: 'Reset the match?' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset match' })).toHaveFocus();
  });
});
