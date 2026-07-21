import type { LabState } from '../types/lab';

interface RobotWorldProps {
  state: LabState;
  previousPackages: number;
}

export function RobotWorld({ state, previousPackages }: RobotWorldProps) {
  const energyPercent = Math.round((state.energy / 24) * 100);
  const direction = state.packages === previousPackages ? 'steady' : state.packages > previousPackages ? 'forward' : 'back';

  return (
    <section className="world-card panel" aria-labelledby="world-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Representation 01</span>
          <h2 id="world-title">Robot world</h2>
        </div>
        <span className="live-badge"><i /> System live</span>
      </div>

      <div className="world-stage" data-direction={direction}>
        <div className="world-grid" aria-hidden="true" />
        <div className="route" aria-hidden="true">
          <span className="route-dot start" />
          <span className="route-line" />
          <span className="route-dot finish" />
          <span className="route-label">Delivery route</span>
        </div>

        <div className="robot-and-cargo">
          <div className="robot" aria-label="Friendly delivery robot">
            <span className="antenna"><i /></span>
            <div className="robot-head">
              <span className="robot-eye left" /><span className="robot-eye right" />
              <span className="robot-smile" />
            </div>
            <div className="robot-body"><span className="robot-heart">↗</span><span className="robot-id">RP–01</span></div>
            <span className="robot-arm left" /><span className="robot-arm right" />
            <span className="robot-wheel left" /><span className="robot-wheel right" />
          </div>

          <div className="cargo" aria-label={`${state.packages} package${state.packages === 1 ? '' : 's'} loaded`}>
            {Array.from({ length: state.packages }, (_, index) => (
              <span className="package" key={index} style={{ '--package-index': index } as React.CSSProperties} aria-hidden="true">
                <i />
              </span>
            ))}
            {state.packages === 0 && <span className="empty-cargo">No packages yet</span>}
          </div>
        </div>

        <div className="world-readouts">
          <div className="meter-readout">
            <span>Energy used</span><strong>{state.energy}</strong>
            <div className="meter" role="meter" aria-label="Energy used" aria-valuemin={4} aria-valuemax={24} aria-valuenow={state.energy}>
              <i style={{ width: `${energyPercent}%` }} />
            </div>
          </div>
          <div><span>Trip time</span><strong>{state.time}<small> min</small></strong></div>
          <div><span>Delivery cost</span><strong>{state.cost}<small> units</small></strong></div>
        </div>
      </div>
    </section>
  );
}
