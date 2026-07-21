export type Mission = 'flow' | 'cause' | 'prediction';
export type Metric = 'energy' | 'time' | 'cost';

export interface LabState {
  packages: number;
  energy: number;
  time: number;
  cost: number;
}

export interface StateDifference {
  packages: number;
  energy: number;
  time: number;
  cost: number;
}

export interface ExperimentRecord extends LabState {
  mission: Mission;
  sequence: number;
}

export interface Prediction {
  energy: number;
  time: number;
  cost: number;
}

export interface ReviewInput {
  mission: Mission;
  current: LabState;
  previous: LabState;
  selectedResponse?: string;
  prediction?: Prediction;
  targetPackages?: number;
}

export interface ReviewOutput {
  observation: string;
  evidence: string;
  relationshipToInspect: string;
  nextQuestion: string;
  suggestedExperiment: string;
  encouragement: string;
}
