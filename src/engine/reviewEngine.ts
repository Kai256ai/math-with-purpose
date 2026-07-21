import { differenceBetween, formatSigned } from './mathEngine';
import type { ReviewInput, ReviewOutput } from '../types/lab';

const causeLabels: Record<string, string> = {
  packages: 'the package count changed',
  time: 'trip time changed',
  robot: 'the robot moved along the route',
};

export function createReview(input: ReviewInput): ReviewOutput {
  const difference = differenceBetween(input.previous, input.current);

  if (input.mission === 'prediction' && input.prediction) {
    const energyGap = input.current.energy - input.prediction.energy;
    return {
      observation: `You predicted all three outputs before revealing the ${input.current.packages}-package experiment.`,
      evidence: `Your energy prediction was ${input.prediction.energy}; the experiment showed ${input.current.energy}, a difference of ${formatSigned(energyGap)}.`,
      relationshipToInspect: 'Each output combines a fixed starting value with a constant amount per package.',
      nextQuestion: 'Which part of your prediction came from the starting value, and which part came from the packages?',
      suggestedExperiment: `Compare ${Math.max(0, input.current.packages - 1)} and ${input.current.packages} packages to isolate one step.`,
      encouragement: 'You committed to a prediction before seeing the result—that gives you useful evidence to revise your model.',
    };
  }

  if (input.mission === 'cause') {
    const selected = input.selectedResponse ?? 'packages';
    return {
      observation: `You chose “${causeLabels[selected] ?? selected}” as the cause to inspect.`,
      evidence: `Packages changed by ${formatSigned(difference.packages)} while energy changed by ${formatSigned(difference.energy)}.`,
      relationshipToInspect: selected === 'packages'
        ? 'Packages → Energy: every added package contributes 2 energy units.'
        : 'Change only the package count and watch whether energy follows it consistently.',
      nextQuestion: 'If one more package is added, how much energy should be added?',
      suggestedExperiment: `Compare ${input.previous.packages} packages with ${input.current.packages} packages, then move exactly one step.`,
      encouragement: 'You named a possible cause and can now test it against the controlled experiment.',
    };
  }

  return {
    observation: difference.packages === 0
      ? `You held the package count at ${input.current.packages}.`
      : `You ${difference.packages > 0 ? 'added' : 'removed'} ${Math.abs(difference.packages)} ${Math.abs(difference.packages) === 1 ? 'package' : 'packages'}.`,
    evidence: `Energy changed by ${formatSigned(difference.energy)}, time by ${formatSigned(difference.time)}, and cost by ${formatSigned(difference.cost)}.`,
    relationshipToInspect: 'All three outputs respond to the same input, but at different constant rates.',
    nextQuestion: 'Which output changes fastest for each package you add?',
    suggestedExperiment: 'Move the package count by exactly one and compare every output.',
    encouragement: 'You changed one input and created a clean comparison across the whole system.',
  };
}
