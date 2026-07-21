import { useState } from 'react';
import { compareExperiments } from '../engine/mathEngine';
import type { ExperimentRecord } from '../types/lab';

interface HistoryProps { records: ExperimentRecord[]; onRecord: () => void; onClear: () => void; }

export function ExperimentHistory({ records, onRecord, onClear }: HistoryProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (sequence: number) => setSelected((current) => current.includes(sequence) ? current.filter((item) => item !== sequence) : current.length < 2 ? [...current, sequence] : [current[1], sequence]);
  const compared = selected.length === 2 ? compareExperiments(records.find((record) => record.sequence === selected[0])!, records.find((record) => record.sequence === selected[1])!) : null;
  return (
    <section className="history panel" aria-labelledby="history-title">
      <div className="section-heading"><div><span className="eyebrow">Experiment notebook</span><h2 id="history-title">State history</h2></div><div className="history-actions"><button className="secondary-button" type="button" onClick={onRecord}>+ Record this state</button><button className="text-button" type="button" onClick={() => { setSelected([]); onClear(); }} disabled={!records.length}>Clear</button></div></div>
      {!records.length ? <div className="empty-history"><span>◎</span><p>No states recorded yet.</p><small>Record two states to compare what changed and what stayed constant.</small></div> : <>
        <p className="history-help">Select two records to compare them.</p>
        <div className="record-list">
          {records.map((record) => <button type="button" className={selected.includes(record.sequence) ? 'record selected' : 'record'} key={record.sequence} aria-pressed={selected.includes(record.sequence)} onClick={() => toggle(record.sequence)}><span>#{String(record.sequence).padStart(2, '0')} · {record.mission}</span><strong>{record.packages} packages</strong><small>E {record.energy} · T {record.time} · C {record.cost}</small></button>)}
        </div>
        {compared && <div className="history-comparison" aria-live="polite"><h3>What the two experiments show</h3><ul>{compared.map((line) => <li key={line}>{line}</li>)}</ul></div>}
      </>}
    </section>
  );
}
