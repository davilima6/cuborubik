import { describe, it, expect } from 'vitest';
import { getStepByGlobalIndex, getTotalTutorialSteps, TUTORIAL_PHASES } from '../tutorial';

describe('Tutorial data', () => {
  it('getTotalTutorialSteps should match the sum of steps in TUTORIAL_PHASES', () => {
    const expected = TUTORIAL_PHASES.reduce((acc, phase) => acc + phase.steps.length, 0);
    expect(getTotalTutorialSteps()).toBe(expected);
  });

  it('getStepByGlobalIndex should return the first step at index 0', () => {
    const res = getStepByGlobalIndex(0);
    expect(res).not.toBeNull();
    expect(res!.phaseIndex).toBe(0);
    expect(res!.stepIndex).toBe(0);
    expect(res!.step.id).toBe(TUTORIAL_PHASES[0].steps[0].id);
  });

  it('getStepByGlobalIndex should return the last step at index totalSteps-1', () => {
    const total = getTotalTutorialSteps();
    const res = getStepByGlobalIndex(total - 1);
    expect(res).not.toBeNull();

    const lastPhaseIndex = TUTORIAL_PHASES.length - 1;
    const lastStepIndex = TUTORIAL_PHASES[lastPhaseIndex].steps.length - 1;

    expect(res!.phaseIndex).toBe(lastPhaseIndex);
    expect(res!.stepIndex).toBe(lastStepIndex);
    expect(res!.step.id).toBe(TUTORIAL_PHASES[lastPhaseIndex].steps[lastStepIndex].id);
  });

  it('getStepByGlobalIndex should return null for out-of-range indices', () => {
    expect(getStepByGlobalIndex(-1 as any)).toBeNull();
    expect(getStepByGlobalIndex(getTotalTutorialSteps())).toBeNull();
    expect(getStepByGlobalIndex(9999)).toBeNull();
  });
});
