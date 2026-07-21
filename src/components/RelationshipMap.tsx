import { metricOrder, relationships } from '../data/relationships';
import type { LabState } from '../types/lab';

export function RelationshipMap({ state, pulseKey }: { state: LabState; pulseKey: number }) {
  return (
    <section className="map-card panel" aria-labelledby="map-title">
      <div className="section-heading">
        <div><span className="eyebrow">Representation 02</span><h2 id="map-title">Relationship map</h2></div>
        <span className="section-note">One input · three effects</span>
      </div>
      <div className="relationship-map" key={pulseKey} role="img" aria-label={`Packages connect to energy at plus 2 per package, time at plus 1 per package, and cost at plus 1.5 per package. Current values: ${state.packages} packages, ${state.energy} energy, ${state.time} minutes, ${state.cost} cost units.`}>
        <div className="input-node"><span>Input variable</span><strong>{state.packages}</strong><b>Packages · p</b></div>
        <div className="edges" aria-hidden="true">
          {metricOrder.map((metric) => <span key={metric} className={`edge ${relationships[metric].accent}`}><i />+{relationships[metric].rate} per package</span>)}
        </div>
        <div className="output-nodes">
          {metricOrder.map((metric) => {
            const relation = relationships[metric];
            return <div key={metric} className={`output-node ${relation.accent}`}><span>{relation.label}</span><strong>{state[metric]}</strong><small>{relation.symbol} · starts at {relation.fixed}</small></div>;
          })}
        </div>
      </div>
      <div className="fixed-values"><span>Fixed starting values</span><b>Energy 4</b><b>Time 3</b><b>Cost 5</b></div>
    </section>
  );
}
