import type { Metric } from '../types/lab';

export const PACKAGE_MIN = 0;
export const PACKAGE_MAX = 10;

export const relationships: Record<Metric, {
  label: string;
  symbol: string;
  fixed: number;
  rate: number;
  unit: string;
  accent: string;
}> = {
  energy: { label: 'Energy', symbol: 'E', fixed: 4, rate: 2, unit: 'energy', accent: 'cyan' },
  time: { label: 'Time', symbol: 'T', fixed: 3, rate: 1, unit: 'minutes', accent: 'purple' },
  cost: { label: 'Cost', symbol: 'C', fixed: 5, rate: 1.5, unit: 'cost units', accent: 'yellow' },
};

export const metricOrder: Metric[] = ['energy', 'time', 'cost'];
