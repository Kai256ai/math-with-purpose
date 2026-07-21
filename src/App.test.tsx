import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Relationship Lab interactions', () => {
  it('provides accessible package controls and updates synchronized values', async () => {
    const user = userEvent.setup();
    render(<App />);
    const slider = screen.getByRole('slider', { name: /packages/i });
    expect(slider).toHaveAttribute('min', '0');
    await user.click(screen.getByRole('button', { name: /increase packages/i }));
    expect(slider).toHaveValue('1');
    expect(screen.getByRole('meter', { name: /energy used/i })).toHaveAttribute('aria-valuenow', '6');
    expect(screen.getByText(/you added 1 package/i)).toBeInTheDocument();
  });

  it('supports keyboard interaction with the package stepper', async () => {
    const user = userEvent.setup();
    render(<App />);
    const increase = screen.getByRole('button', { name: /increase packages/i });
    increase.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('slider', { name: /packages/i })).toHaveValue('1');
  });

  it('switches missions using accessible tabs', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('tab', { name: /cause & effect/i }));
    expect(screen.getByRole('tab', { name: /cause & effect/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/choose the change you want to test/i)).toBeInTheDocument();
  });

  it('resets the active mission and package state', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /increase packages/i }));
    await user.click(screen.getByRole('button', { name: /reset mission/i }));
    expect(screen.getByRole('slider', { name: /packages/i })).toHaveValue('0');
    expect(screen.getByText(/why not zero/i)).toBeInTheDocument();
  });

  it('does not reveal prediction results before submission', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('tab', { name: /prediction/i }));
    expect(screen.queryByRole('table', { name: /prediction compared/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/predicted energy/i)).toBeInTheDocument();
  });

  it('preserves and compares a prediction after reveal', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('tab', { name: /prediction/i }));
    await user.type(screen.getByLabelText(/predicted energy/i), '19');
    await user.type(screen.getByLabelText(/predicted time/i), '10');
    await user.type(screen.getByLabelText(/predicted cost/i), '17');
    await user.click(screen.getByRole('button', { name: /lock prediction/i }));
    const table = screen.getByRole('table', { name: /prediction compared/i });
    expect(within(table).getByText('19')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /packages/i })).toHaveValue('8');
  });

  it('handles a Cause & Effect response with evidence-based review', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /increase packages/i }));
    await user.click(screen.getByRole('tab', { name: /cause & effect/i }));
    await user.click(screen.getByLabelText(/package count changed/i));
    await user.click(screen.getByRole('button', { name: /review my reasoning/i }));
    expect(screen.getByText(/every added package contributes 2 energy units/i)).toBeInTheDocument();
  });

  it('switches the graph metric and updates its text alternative', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Cost' }));
    expect(screen.getByText(/cost starts at 5 and increases by 1.5/i)).toBeInTheDocument();
  });

  it('shows Math Lens substitution after a package change', async () => {
    const user = userEvent.setup();
    render(<App />);
    const increase = screen.getByRole('button', { name: /increase packages/i });
    await user.click(increase);
    await user.click(increase);
    await user.click(increase);
    await user.click(increase);
    expect(screen.getByLabelText(/E = 4 \+ 2p\. E = 4 \+ 2 × 4\. E = 12/i)).toBeInTheDocument();
  });

  it('records and compares two experiments', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /record this state/i }));
    await user.click(screen.getByRole('button', { name: /increase packages/i }));
    await user.click(screen.getByRole('button', { name: /record this state/i }));
    const records = screen.getAllByRole('button', { name: /packages E/i });
    await user.click(records[0]);
    await user.click(records[1]);
    expect(screen.getByText(/rates stayed constant/i)).toBeInTheDocument();
  });

  it('clears experiment history', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /record this state/i }));
    await user.click(screen.getByRole('button', { name: /^clear$/i }));
    expect(screen.getByText(/no states recorded yet/i)).toBeInTheDocument();
  });
});
