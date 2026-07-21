import { metricOrder, relationships } from '../data/relationships';
import { calculateState } from '../engine/mathEngine';
import type { Metric } from '../types/lab';

interface GraphViewProps { metric: Metric; packages: number; onMetricChange: (metric: Metric) => void; }

export function GraphView({ metric, packages, onMetricChange }: GraphViewProps) {
  const relation = relationships[metric];
  const points = Array.from({ length: 11 }, (_, p) => ({ p, value: calculateState(p)[metric] }));
  const max = Math.max(...points.map((point) => point.value));
  const x = (p: number) => 45 + p * 34;
  const y = (value: number) => 210 - (value / max) * 165;
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.p)} ${y(point.value)}`).join(' ');
  const current = points[packages];

  return (
    <section className="graph-card panel" aria-labelledby="graph-title">
      <div className="section-heading graph-heading">
        <div><span className="eyebrow">Representation 03</span><h2 id="graph-title">Graph view</h2></div>
        <div className="segmented-control" aria-label="Graph metric">
          {metricOrder.map((item) => <button key={item} type="button" className={metric === item ? 'active' : ''} aria-pressed={metric === item} onClick={() => onMetricChange(item)}>{relationships[item].label}</button>)}
        </div>
      </div>
      <div className={`chart ${relation.accent}`}>
        <svg viewBox="0 0 410 245" role="img" aria-labelledby="chart-title chart-description">
          <title id="chart-title">{relation.label} by package count</title>
          <desc id="chart-description">At {packages} packages, {relation.label.toLowerCase()} is {current.value}. The graph rises by {relation.rate} {relation.unit} per package from a starting value of {relation.fixed}.</desc>
          {[45, 100, 155, 210].map((gridY) => <line key={gridY} className="grid-line" x1="45" y1={gridY} x2="385" y2={gridY} />)}
          <line className="axis" x1="45" y1="210" x2="385" y2="210" /><line className="axis" x1="45" y1="25" x2="45" y2="210" />
          <path className="trend-line" d={path} />
          {points.map((point) => <circle key={point.p} className={point.p === packages ? 'data-point current' : 'data-point'} cx={x(point.p)} cy={y(point.value)} r={point.p === packages ? 7 : 3.5} />)}
          <line className="guide" x1={x(packages)} y1={y(current.value)} x2={x(packages)} y2="210" />
          <g className="point-label" transform={`translate(${Math.min(x(packages) + 10, 322)}, ${Math.max(y(current.value) - 22, 18)})`}><rect width="66" height="24" rx="7" /><text x="33" y="16" textAnchor="middle">({packages}, {current.value})</text></g>
          {[0, 2, 4, 6, 8, 10].map((tick) => <text key={tick} className="tick" x={x(tick)} y="230" textAnchor="middle">{tick}</text>)}
          <text className="axis-label" x="215" y="244" textAnchor="middle">Packages (p)</text>
        </svg>
      </div>
      <p className="text-alternative"><span>Trend in words</span> {relation.label} starts at {relation.fixed} and increases by {relation.rate} {relation.unit} for every package. Selected point: ({packages}, {current.value}).</p>
    </section>
  );
}
