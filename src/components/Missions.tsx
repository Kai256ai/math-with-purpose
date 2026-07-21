import { useState } from 'react';
import { calculateState, differenceBetween, formatSigned } from '../engine/mathEngine';
import type { LabState, Mission, Prediction, ReviewOutput } from '../types/lab';

const missionInfo: Record<Mission, { number: string; name: string; prompt: string }> = {
  flow: { number: '01', name: 'Flow', prompt: 'What changes when the number of packages changes?' },
  cause: { number: '02', name: 'Cause & effect', prompt: 'Which change caused the energy increase?' },
  prediction: { number: '03', name: 'Prediction', prompt: 'What will happen if the robot carries 8 packages?' },
};

interface MissionsProps {
  mission: Mission;
  onMissionChange: (mission: Mission) => void;
  current: LabState;
  previous: LabState;
  onCauseReview: (choice: string) => void;
  onPredictionReveal: (prediction: Prediction) => void;
  onReset: () => void;
  predictionRevealed: boolean;
  prediction?: Prediction;
  review?: ReviewOutput;
}

export function MissionSelector({ mission, onMissionChange }: Pick<MissionsProps, 'mission' | 'onMissionChange'>) {
  return (
    <section className="missions" aria-labelledby="missions-title">
      <div className="section-intro"><span className="eyebrow">Choose your inquiry</span><h2 id="missions-title">Three ways to think</h2></div>
      <div className="mission-tabs" role="tablist" aria-label="Learning missions">
        {(Object.keys(missionInfo) as Mission[]).map((item) => {
          const info = missionInfo[item];
          return <button key={item} id={`tab-${item}`} role="tab" aria-selected={mission === item} aria-controls="mission-panel" className={mission === item ? 'active' : ''} onClick={() => onMissionChange(item)}><span>{info.number}</span><b>{info.name}</b><small>{info.prompt}</small></button>;
        })}
      </div>
    </section>
  );
}

export function MissionPanel(props: MissionsProps) {
  const { mission, current, previous, onCauseReview, onPredictionReveal, onReset, predictionRevealed, prediction } = props;
  const [causeChoice, setCauseChoice] = useState('');
  const [draft, setDraft] = useState({ energy: '', time: '', cost: '' });
  const difference = differenceBetween(previous, current);
  const target = calculateState(8);

  const submitPrediction = (event: React.FormEvent) => {
    event.preventDefault();
    onPredictionReveal({ energy: Number(draft.energy), time: Number(draft.time), cost: Number(draft.cost) });
  };

  const resetLocal = () => {
    setCauseChoice('');
    setDraft({ energy: '', time: '', cost: '' });
    onReset();
  };

  return (
    <section id="mission-panel" className="mission-panel panel" role="tabpanel" aria-labelledby={`tab-${mission}`}>
      <div className="mission-prompt"><div><span className="eyebrow">Mission {missionInfo[mission].number}</span><h2>{missionInfo[mission].prompt}</h2></div><button className="text-button" type="button" onClick={resetLocal}>↻ Reset mission</button></div>

      {mission === 'flow' && (
        <div className="flow-comparison">
          {difference.packages === 0 ? <p className="mission-instruction">Move the package control to create a comparison. Keep your eye on what changes together.</p> : <>
            <p className="change-lead">You {difference.packages > 0 ? 'added' : 'removed'} <strong>{Math.abs(difference.packages)}</strong> {Math.abs(difference.packages) === 1 ? 'package' : 'packages'}.</p>
            <div className="delta-grid"><span>Energy <b>{formatSigned(difference.energy)}</b></span><span>Time <b>{formatSigned(difference.time)}</b></span><span>Cost <b>{formatSigned(difference.cost)}</b></span></div>
          </>}
        </div>
      )}

      {mission === 'cause' && (
        <form className="cause-form" onSubmit={(event) => { event.preventDefault(); onCauseReview(causeChoice); }}>
          <p>Choose the change you want to test as the cause. The review will help you inspect your evidence.</p>
          <div className="choice-grid">
            {[['packages', 'The package count changed'], ['time', 'The trip time changed'], ['robot', 'The robot moved along the route']].map(([value, label]) => <label key={value} className={causeChoice === value ? 'selected' : ''}><input type="radio" name="cause" value={value} checked={causeChoice === value} onChange={(event) => setCauseChoice(event.target.value)} /> <span>{label}</span></label>)}
          </div>
          <button className="primary-button compact" type="submit" disabled={!causeChoice}>Review my reasoning <span>→</span></button>
        </form>
      )}

      {mission === 'prediction' && !predictionRevealed && (
        <form className="prediction-form" onSubmit={submitPrediction}>
          <p>The simulated values stay hidden until you commit to all three predictions.</p>
          <div className="prediction-inputs">
            {(['energy', 'time', 'cost'] as const).map((metric) => <label key={metric}><span>{metric[0].toUpperCase() + metric.slice(1)}</span><input type="number" min="0" step="0.5" required value={draft[metric]} onChange={(event) => setDraft({ ...draft, [metric]: event.target.value })} aria-label={`Predicted ${metric} for 8 packages`} placeholder="?" /></label>)}
          </div>
          <button className="primary-button compact" type="submit">Lock prediction & reveal <span>→</span></button>
        </form>
      )}

      {mission === 'prediction' && predictionRevealed && prediction && (
        <div className="prediction-results" tabIndex={-1} data-focus-target="prediction-results">
          <p className="change-lead">Prediction preserved. Now compare it with the 8-package experiment.</p>
          <div className="result-table" role="table" aria-label="Prediction compared with simulated result">
            <div role="row"><b role="columnheader">Measure</b><b role="columnheader">You predicted</b><b role="columnheader">Experiment</b><b role="columnheader">Difference</b></div>
            {(['energy', 'time', 'cost'] as const).map((metric) => <div role="row" key={metric}><span role="cell">{metric}</span><span role="cell">{prediction[metric]}</span><span role="cell">{target[metric]}</span><strong role="cell">{formatSigned(target[metric] - prediction[metric])}</strong></div>)}
          </div>
          <p className="reflection-question">What part of the relationship would you use to revise your next prediction?</p>
        </div>
      )}
    </section>
  );
}
