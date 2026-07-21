import { useRef, useState } from 'react';
import { ExperimentHistory } from './components/ExperimentHistory';
import { GraphView } from './components/GraphView';
import { MathLens } from './components/MathLens';
import { MissionPanel, MissionSelector } from './components/Missions';
import { PackageControls } from './components/PackageControls';
import { ReasoningReview } from './components/ReasoningReview';
import { RelationshipMap } from './components/RelationshipMap';
import { RobotWorld } from './components/RobotWorld';
import { calculateState } from './engine/mathEngine';
import { createReview } from './engine/reviewEngine';
import type { ExperimentRecord, LabState, Metric, Mission, Prediction, ReviewOutput } from './types/lab';
import './styles/index.css';

const initialState = calculateState(0);

export default function App() {
  const [current, setCurrent] = useState<LabState>(initialState);
  const [previous, setPrevious] = useState<LabState>(initialState);
  const [mission, setMission] = useState<Mission>('flow');
  const [metric, setMetric] = useState<Metric>('energy');
  const [review, setReview] = useState<ReviewOutput>(() => createReview({ mission: 'flow', current: initialState, previous: initialState }));
  const [prediction, setPrediction] = useState<Prediction>();
  const [predictionRevealed, setPredictionRevealed] = useState(false);
  const [history, setHistory] = useState<ExperimentRecord[]>([]);
  const [pulseKey, setPulseKey] = useState(0);
  const [reflection, setReflection] = useState('');
  const sequence = useRef(1);

  const focusTarget = (selector: string) => window.setTimeout(() => document.querySelector<HTMLElement>(selector)?.focus(), 0);

  const changePackages = (packages: number) => {
    const next = calculateState(packages);
    setPrevious(current);
    setCurrent(next);
    setPulseKey((value) => value + 1);
    setReview(createReview({ mission, current: next, previous: current }));
  };

  const changeMission = (nextMission: Mission) => {
    setMission(nextMission);
    setPrediction(undefined);
    setPredictionRevealed(false);
    setReview(createReview({ mission: nextMission, current, previous }));
  };

  const resetMission = () => {
    setCurrent(initialState);
    setPrevious(initialState);
    setPrediction(undefined);
    setPredictionRevealed(false);
    setReflection('');
    setPulseKey((value) => value + 1);
    setReview(createReview({ mission, current: initialState, previous: initialState }));
  };

  const revealPrediction = (nextPrediction: Prediction) => {
    const target = calculateState(8);
    setPrevious(current);
    setCurrent(target);
    setPrediction(nextPrediction);
    setPredictionRevealed(true);
    setPulseKey((value) => value + 1);
    setReview(createReview({ mission: 'prediction', current: target, previous: current, prediction: nextPrediction, targetPackages: 8 }));
    focusTarget('[data-focus-target="prediction-results"]');
  };

  const reviewCause = (choice: string) => {
    setReview(createReview({ mission: 'cause', current, previous, selectedResponse: choice }));
    focusTarget('[data-focus-target="review-panel"]');
  };

  const reflect = () => {
    setReview({
      ...createReview({ mission, current, previous, prediction }),
      observation: reflection.trim() ? `You wrote: “${reflection.trim()}”` : 'You paused to inspect the experiment before explaining it.',
      encouragement: 'You put your observation into words, making your mathematical model easier to test.',
    });
    focusTarget('[data-focus-target="review-panel"]');
  };

  const recordState = () => {
    const record: ExperimentRecord = { ...current, mission, sequence: sequence.current++ };
    setHistory((records) => [...records, record]);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KidsPiggy Math With Purpose home"><span className="brand-mark">kp</span><span><small>KidsPiggy /</small><strong>Math With Purpose</strong></span></a>
        <nav aria-label="Main navigation"><a href="#lab">Lab</a><a href="#how-it-works">How it works</a><a href="#boundaries">Boundaries</a></nav>
        <span className="header-status"><i /> Prototype online</span>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="hero-copy">
            <span className="status-label">Interactive <i /> deterministic <i /> no answer generation</span>
            <p className="hero-kicker">Learning to think through mathematics.</p>
            <h1 id="hero-title">Math is the language of <em>relationships.</em></h1>
            <p>Change one variable. Watch an entire system respond. Discover the relationship behind the numbers.</p>
            <a className="primary-button" href="#lab">Start exploring relationships <span>↘</span></a>
            <blockquote>“We don’t solve for X. We understand why X exists.”</blockquote>
          </div>
          <div className="hero-system" aria-hidden="true">
            <div className="system-node main"><small>INPUT</small><strong>p</strong><span>packages</span></div>
            <div className="system-line line-one"><b>+2</b></div><div className="system-line line-two"><b>+1</b></div><div className="system-line line-three"><b>+1.5</b></div>
            <div className="system-node output energy"><small>ENERGY</small><strong>E</strong></div><div className="system-node output time"><small>TIME</small><strong>T</strong></div><div className="system-node output cost"><small>COST</small><strong>C</strong></div>
            <span className="system-caption">One change. A connected response.</span>
          </div>
        </section>

        <section className="onboarding" aria-labelledby="onboarding-title">
          <div><span className="eyebrow">Quick start</span><h2 id="onboarding-title">Try it in 20 seconds</h2></div>
          <ol><li><span>01</span>Change the number of packages</li><li><span>02</span>Watch every representation respond</li><li><span>03</span>Make a prediction</li><li><span>04</span>Explain what you discovered</li></ol>
        </section>

        <div id="lab" className="lab-anchor" />
        <MissionSelector mission={mission} onMissionChange={changeMission} />
        <MissionPanel mission={mission} onMissionChange={changeMission} current={current} previous={previous} onCauseReview={reviewCause} onPredictionReveal={revealPrediction} onReset={resetMission} predictionRevealed={predictionRevealed} prediction={prediction} review={review} />

        <section className="lab-workspace" aria-label="Robot delivery lab">
          <div className="world-column"><RobotWorld state={current} previousPackages={previous.packages} /><PackageControls value={current.packages} onChange={changePackages} /></div>
          <RelationshipMap state={current} pulseKey={pulseKey} />
        </section>

        <section className="analysis-grid" aria-label="Graph and equation representations">
          <GraphView metric={metric} packages={current.packages} onMetricChange={setMetric} />
          <MathLens metric={metric} packages={current.packages} />
        </section>

        <section className="reflection panel" aria-labelledby="reflection-title">
          <div><span className="eyebrow">Your turn</span><h2 id="reflection-title">What relationship did you discover?</h2><p>Explain what changed, what caused it, or what you would test next. More than one useful explanation is possible.</p></div>
          <div className="reflection-entry"><label htmlFor="reflection">My observation</label><textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="I noticed that when packages…" /><button className="secondary-button" type="button" onClick={reflect}>Reflect on my observation →</button></div>
        </section>

        <ReasoningReview review={review} />
        <ExperimentHistory records={history} onRecord={recordState} onClear={() => setHistory([])} />

        <section id="how-it-works" className="how-section" aria-labelledby="how-title">
          <div className="section-intro"><span className="eyebrow">Under the surface</span><h2 id="how-title">How the lab thinks</h2><p>A transparent pipeline turns one learner action into four synchronized ways of seeing.</p></div>
          <div className="pipeline"><article><span>01</span><h3>Change</h3><p>You control one variable: packages.</p></article><i>→</i><article><span>02</span><h3>Calculate</h3><p>Pure rules compute every output.</p></article><i>→</i><article><span>03</span><h3>Represent</h3><p>World, map, graph and equation update together.</p></article><i>→</i><article><span>04</span><h3>Reflect</h3><p>Prompts turn a result into a relationship.</p></article></div>
        </section>

        <section className="build-week panel" aria-labelledby="build-week-title">
          <div className="section-heading"><div><span className="eyebrow">Build Week contribution</span><h2 id="build-week-title">Built on a learning philosophy, focused into one new lab</h2></div></div>
          <div className="contribution-grid"><article><h3>Before Build Week</h3><p>The broader KidsPiggy platform already explored education, transforming notes into study materials, developing children’s doodles into illustrations, creative learning, and prior AI Review Engine research.</p></article><article className="new-work"><h3>Built during Build Week</h3><p>Math With Purpose, this Robot Delivery Relationship Lab, its four synchronized representations, three missions, prediction-before-reveal, deterministic review rules, experiment history, accessibility, tests and documentation.</p></article></div>
          <div className="tool-roles"><p><strong>GPT-5.6</strong> supported product development: philosophy, lab design, synchronized representations, Socratic boundaries and interface decisions. It is not called at runtime.</p><p><strong>Codex</strong> implemented, tested, reviewed and documented the prototype. Final educational and product decisions remain human-led.</p></div>
        </section>

        <section id="boundaries" className="boundaries" aria-labelledby="boundaries-title">
          <div className="section-intro"><span className="eyebrow">Learning & safety boundaries</span><h2 id="boundaries-title">A thinking aid, with clear limits</h2></div>
          <ul><li>The lab supports exploration; it does not replace a teacher.</li><li>A reasoning review is a learning prompt, not a judgement of ability.</li><li>More than one explanation may demonstrate useful understanding.</li><li>The prototype uses prepared deterministic relationships.</li><li>It does not assess intelligence, diagnose learning difficulties or create learner profiles.</li><li>No personal information is required.</li><li>No runtime AI or external model call is used in this demo.</li></ul>
        </section>
      </main>

      <footer><a className="brand" href="#top"><span className="brand-mark">kp</span><span><small>KidsPiggy /</small><strong>Math With Purpose</strong></span></a><p>Learning to think through mathematics.</p><span>Standalone Build Week prototype · 2026</span></footer>
      <div className="sr-only" aria-live="polite">Package count {current.packages}. Energy {current.energy}. Time {current.time}. Cost {current.cost}.</div>
    </div>
  );
}
