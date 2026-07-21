interface PackageControlsProps {
  value: number;
  onChange: (value: number) => void;
}

export function PackageControls({ value, onChange }: PackageControlsProps) {
  return (
    <div className="package-controls" aria-label="Package controls">
      <div className="control-label-row">
        <label htmlFor="package-slider">Packages</label>
        <output htmlFor="package-slider" aria-live="polite"><strong>{value}</strong> / 10</output>
      </div>
      <div className="slider-row">
        <button type="button" className="stepper" onClick={() => onChange(value - 1)} disabled={value === 0} aria-label="Decrease packages">−</button>
        <input id="package-slider" type="range" min="0" max="10" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} aria-valuetext={`${value} package${value === 1 ? '' : 's'}`} />
        <button type="button" className="stepper" onClick={() => onChange(value + 1)} disabled={value === 10} aria-label="Increase packages">+</button>
      </div>
      <div className="range-labels" aria-hidden="true"><span>0 · start</span><span>10 · full load</span></div>
      {value === 0 && <p className="fixed-note"><span>Why not zero?</span> The robot still powers on, prepares the route and starts the service. These are fixed costs.</p>}
    </div>
  );
}
