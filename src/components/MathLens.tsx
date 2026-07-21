import { relationships } from '../data/relationships';
import { equationFor } from '../engine/mathEngine';
import type { Metric } from '../types/lab';

export function MathLens({ metric, packages }: { metric: Metric; packages: number }) {
  const relation = relationships[metric];
  const equation = equationFor(metric, packages);
  return (
    <section className="math-card panel" aria-labelledby="math-title">
      <div className="section-heading"><div><span className="eyebrow">Representation 04</span><h2 id="math-title">Math lens</h2></div><span className="section-note">See the structure</span></div>
      <div className="equation-stack" aria-label={`${equation.symbolic}. ${equation.substituted}. ${equation.result}.`}>
        <p><span className="token variable">{relation.symbol}</span> = <span className="token fixed">{relation.fixed}</span> + <span className="token rate">{relation.rate}</span><span className="token variable">p</span></p>
        <p><span className="token variable">{relation.symbol}</span> = <span className="token fixed">{relation.fixed}</span> + <span className="token rate">{relation.rate}</span> × <span className="token current">{packages}</span></p>
        <p className="equation-result"><span className="token variable">{relation.symbol}</span> = <span className="token result">{equation.value}</span></p>
      </div>
      <div className="equation-key">
        <span><i className="variable" /> variable</span><span><i className="fixed" /> fixed start</span><span><i className="rate" /> rate</span><span><i className="current" /> current input</span><span><i className="result" /> result</span>
      </div>
    </section>
  );
}
