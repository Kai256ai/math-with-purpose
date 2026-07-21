# Math With Purpose — Relationship Lab

> Learning to think through mathematics.

**Manifest:** We don’t solve for X. We understand why X exists.

Math With Purpose is a standalone, accessible learning prototype that asks a different mathematical question: not only “What is the answer?”, but “What changed, what caused it, and what relationship did you discover?”

The MVP develops one world deeply: a friendly delivery robot carrying 0–10 packages. One package-count control synchronizes a visual world, relationship map, native SVG graph, equation lens, three learning missions, a deterministic reasoning review, and a session-only experiment notebook.

## Run locally

Requires Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm test
pnpm build
```

The prototype has no runtime network calls, API keys, accounts, tracking, database, analytics, remote fonts, CDN assets, or saved learner profiles.

## The deterministic model

All calculations live in pure TypeScript under `src/engine/` and are independent of React:

| Quantity | Relationship | Fixed start | Rate per package |
| --- | --- | ---: | ---: |
| Energy | `E = 4 + 2p` | 4 | +2 |
| Trip time | `T = 3 + p` | 3 | +1 minute |
| Delivery cost | `C = 5 + 1.5p` | 5 | +1.5 cost units |

At `p = 0`, the non-zero values make fixed costs visible: powering on, preparing the route, and starting the service.

## Learning experience

- **Flow:** freely change packages and compare the new state with the immediately previous state.
- **Cause & Effect:** choose a causal explanation and receive evidence plus a next experiment, without a humiliating failure state.
- **Prediction:** predict energy, time, and cost for 8 packages before the simulated state can be revealed.
- **Experiment history:** record session states, select two, and compare input/output differences and invariant rates.
- **Reasoning review:** an inspectable local rule engine returns an observation, evidence, relationship to inspect, smallest next question, suggested experiment, and action-specific encouragement.

## Architecture

```text
src/
  components/     UI representations and learning interactions
  data/           relationship definitions and boundaries
  engine/         pure calculations, comparisons and review rules
  hooks/          reserved for reusable interaction hooks
  styles/         responsive visual system and original CSS robot
  test/           shared test setup
  types/          domain types
  App.tsx         synchronized application state
  main.tsx        React entry point
```

State is intentionally local and in memory. There is no persistence layer because the MVP needs a safe experiment session, not a learner profile. React components never duplicate formulas; every representation consumes the same calculated state.

## Accessibility

The lab uses semantic landmarks and headings, native buttons and inputs, an accessible range input plus large stepper alternatives, visible focus styles, live value announcements, text alternatives for the relationship map and graph, labelled controls, accessible mission tabs, result focus management, strong contrast, 44px+ touch targets, and reduced-motion handling. The layout is designed for 1440×900, 1280×800, and 375×800 without horizontal page overflow.

## Learning and safety boundaries

- The lab supports exploration; it does not replace a teacher.
- A reasoning review is a learning prompt, not a judgement of ability.
- More than one explanation may demonstrate useful understanding.
- The prototype uses prepared deterministic relationships.
- It does not assess intelligence, diagnose learning difficulties, or create learner profiles.
- No personal information is required.
- No runtime AI or external model call is used.

## Build Week attribution

### Before Build Week

The broader KidsPiggy platform already included educational experiences, collecting notes and transforming them into study materials, transforming children’s doodles into developed illustrations, a wider philosophy of learning through creativity, and prior research experience from AI Review Engine. Those capabilities are prior work and are not claimed as part of this project.

### Built during Build Week

The new contribution is Math With Purpose as a standalone module; the Robot Delivery Relationship Lab; synchronized world, relationship-map, graph, and equation representations; Flow, Cause & Effect, and Prediction missions; prediction-before-reveal; the deterministic Reasoning Review Engine; Socratic next-step prompts; experiment history and comparison; responsive accessibility; tests; and documentation.

### GPT-5.6 and Codex

GPT-5.6 was used during product development to define the educational philosophy, convert mathematics from answer-solving into relationship exploration, design the Robot Delivery Lab, structure synchronized representations, design Socratic prompts and reasoning-review boundaries, and support product, learning, and interface decisions. The submitted prototype does not make runtime GPT-5.6 calls.

Codex was used to scaffold and implement the standalone application, separate the deterministic engine from React, implement synchronized representations and missions, write tests, review accessibility and responsiveness, verify lint and production build, improve documentation, and distinguish prior KidsPiggy work from the Build Week contribution. Codex did not make the final educational or product decisions.

## Key product, engineering and design decisions

### One deeply developed world

One coherent delivery system lets learners see the same cause through several representations without first decoding a new context. Depth creates space for prediction, comparison, explanation, and repeated controlled experiments; several shallow modules would dilute those connections.

### Prediction before reveal

A prediction externalizes the learner’s current model. Hiding the simulation until all three predictions are committed prevents the result from becoming a copying exercise and makes the difference useful evidence rather than a score.

### Review without binary judgement

The goal is to inspect reasoning, not classify a child. Reviews therefore name the submitted action, cite experiment evidence, identify a relationship to inspect, and offer the smallest next question. A surprising prediction becomes the start of another experiment.

### A deterministic engine

Prepared rules make the system transparent, private, fast, reproducible, and straightforward to test. The prototype never pretends to understand more than the learner’s submitted interaction, and its review behavior can be inspected directly in TypeScript.

### Equations follow visual relationships

The world and relationship map establish what changes and why before symbols compress the pattern. The Math Lens is deliberately the fourth representation so algebra describes a relationship the learner has already seen.

### Accessibility shapes the representation

Accessibility is structural rather than decorative: steppers supplement the slider, graphics have complete text alternatives, colour is paired with labels and position, animations are causal and optional, focus moves to revealed feedback, and the responsive layout preserves touch targets and reading order.

## License

MIT. See [LICENSE](LICENSE).
