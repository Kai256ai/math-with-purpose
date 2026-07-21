import { describe, expect, it } from 'vitest';
import { relationships } from '../data/relationships';
import type { ExperimentRecord } from '../types/lab';
import { calculateState, compareExperiments, differenceBetween, equationFor, rateBetween } from './mathEngine';
import { createReview } from './reviewEngine';

describe('deterministic math engine', () => {
  it('calculates energy, time and cost from package count', () => {
    expect(calculateState(4)).toEqual({ packages: 4, energy: 12, time: 7, cost: 11 });
  });

  it('keeps non-zero fixed values at p = 0', () => {
    expect(calculateState(0)).toEqual({ packages: 0, energy: 4, time: 3, cost: 5 });
  });

  it('calculates the p = 10 boundary', () => {
    expect(calculateState(10)).toEqual({ packages: 10, energy: 24, time: 13, cost: 20 });
  });

  it('clamps and rounds inputs to the supported integer range', () => {
    expect(calculateState(-5).packages).toBe(0);
    expect(calculateState(99).packages).toBe(10);
    expect(calculateState(3.7).packages).toBe(4);
  });

  it('calculates differences between experiment states', () => {
    expect(differenceBetween(calculateState(2), calculateState(5))).toEqual({ packages: 3, energy: 6, time: 3, cost: 4.5 });
  });

  it('preserves constant rates of change', () => {
    const a = calculateState(1);
    const b = calculateState(7);
    expect(rateBetween(a, b, 'energy')).toBe(relationships.energy.rate);
    expect(rateBetween(a, b, 'time')).toBe(relationships.time.rate);
    expect(rateBetween(a, b, 'cost')).toBe(relationships.cost.rate);
  });

  it('formats the substituted Math Lens equation', () => {
    expect(equationFor('energy', 4)).toMatchObject({ symbolic: 'E = 4 + 2p', substituted: 'E = 4 + 2 × 4', result: 'E = 12' });
  });

  it('creates a complete experiment comparison including constant rates', () => {
    const a: ExperimentRecord = { ...calculateState(1), mission: 'flow', sequence: 1 };
    const b: ExperimentRecord = { ...calculateState(3), mission: 'flow', sequence: 2 };
    const comparison = compareExperiments(a, b);
    expect(comparison).toContain('Energy changed by +4.');
    expect(comparison.at(-1)).toContain('rates stayed constant');
  });
});

describe('reasoning review engine', () => {
  it('returns deterministic output for identical Flow input', () => {
    const input = { mission: 'flow' as const, previous: calculateState(2), current: calculateState(3) };
    expect(createReview(input)).toEqual(createReview(input));
    expect(createReview(input).evidence).toContain('Energy changed by +2');
  });

  it('handles Cause & Effect choices without binary judgement', () => {
    const review = createReview({ mission: 'cause', previous: calculateState(2), current: calculateState(3), selectedResponse: 'time' });
    expect(review.observation).toContain('trip time changed');
    expect(JSON.stringify(review)).not.toMatch(/wrong|failed/i);
    expect(review.nextQuestion).toContain('one more package');
  });

  it('compares a prediction after reveal', () => {
    const review = createReview({ mission: 'prediction', previous: calculateState(2), current: calculateState(8), prediction: { energy: 19, time: 11, cost: 17 } });
    expect(review.evidence).toContain('difference of +1');
    expect(review.encouragement).toContain('before seeing the result');
  });
});
