import { PACKAGE_MAX, PACKAGE_MIN, relationships } from '../data/relationships';
import type { ExperimentRecord, LabState, Metric, StateDifference } from '../types/lab';

export function clampPackages(value: number): number {
  return Math.min(PACKAGE_MAX, Math.max(PACKAGE_MIN, Math.round(value)));
}

export function calculateState(packages: number): LabState {
  const p = clampPackages(packages);
  return {
    packages: p,
    energy: relationships.energy.fixed + relationships.energy.rate * p,
    time: relationships.time.fixed + relationships.time.rate * p,
    cost: relationships.cost.fixed + relationships.cost.rate * p,
  };
}

export function differenceBetween(from: LabState, to: LabState): StateDifference {
  return {
    packages: to.packages - from.packages,
    energy: to.energy - from.energy,
    time: to.time - from.time,
    cost: to.cost - from.cost,
  };
}

export function rateBetween(from: LabState, to: LabState, metric: Metric): number | null {
  const packageDifference = to.packages - from.packages;
  if (packageDifference === 0) return null;
  return (to[metric] - from[metric]) / packageDifference;
}

export function compareExperiments(a: ExperimentRecord, b: ExperimentRecord): string[] {
  const difference = differenceBetween(a, b);
  const direction = difference.packages >= 0 ? 'increased' : 'decreased';
  return [
    `Packages ${direction} by ${Math.abs(difference.packages)}.`,
    `Energy changed by ${formatSigned(difference.energy)}.`,
    `Time changed by ${formatSigned(difference.time)}.`,
    `Cost changed by ${formatSigned(difference.cost)}.`,
    'The rates stayed constant: +2 energy, +1 minute and +1.5 cost units per package.',
  ];
}

export function formatSigned(value: number): string {
  if (value === 0) return '0';
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`;
}

export function equationFor(metric: Metric, packages: number) {
  const relation = relationships[metric];
  const value = calculateState(packages)[metric];
  return {
    symbolic: `${relation.symbol} = ${relation.fixed} + ${relation.rate}${packages === -1 ? 'p' : 'p'}`,
    substituted: `${relation.symbol} = ${relation.fixed} + ${relation.rate} × ${clampPackages(packages)}`,
    result: `${relation.symbol} = ${value}`,
    value,
  };
}
