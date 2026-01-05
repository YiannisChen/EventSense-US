export const RUN_STATUS_STEPS = [
  "ET alignment",
  "Initial retrieval",
  "Miner → Event IR",
  "Critic → Audit checks",
  "Second-pass retrieval (≤1) + optional 1-hop",
  "Judge → Top causes + Report IR",
] as const;

export type RunStatusStepLabel = (typeof RUN_STATUS_STEPS)[number];


