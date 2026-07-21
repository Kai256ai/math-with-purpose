import type { ReviewOutput } from '../types/lab';

export function ReasoningReview({ review }: { review: ReviewOutput }) {
  const items = [
    ['What you noticed', review.observation],
    ['Evidence from the experiment', review.evidence],
    ['Relationship to inspect', review.relationshipToInspect],
    ['Smallest next question', review.nextQuestion],
  ];
  return (
    <section className="review-panel panel" aria-labelledby="review-title" tabIndex={-1} data-focus-target="review-panel">
      <div className="review-header"><div className="review-orbit" aria-hidden="true"><span>?</span></div><div><span className="eyebrow">Deterministic reasoning review</span><h2 id="review-title">Your experiment, reflected back</h2></div><span className="local-chip">Local rules · no AI call</span></div>
      <div className="review-grid">
        {items.map(([label, value], index) => <article key={label}><span>0{index + 1}</span><h3>{label}</h3><p>{value}</p></article>)}
      </div>
      <div className="review-next"><div><span>Try next</span><p>{review.suggestedExperiment}</p></div><blockquote>“{review.encouragement}”</blockquote></div>
    </section>
  );
}
