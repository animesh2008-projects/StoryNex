import { describe, it, expect } from 'vitest';
import { runContinuityAudit } from '../src/services/continuity-checker';
import { Character, StoryMemory } from '../src/types';

describe('Continuity Checker Engine', () => {
  const characters: Character[] = [
    {
      id: 'char_donald',
      storyId: 'story_kepler',
      name: 'Donald Vance',
      role: 'Lead Relic Archivist',
      personality: ['Meticulous', 'Skeptical'],
      background: 'Surveyor on Kepler relay.',
      motivation: 'Uncover signal truth.',
      goals: ['Protect beacons'],
      fears: ['Synthetic AI', 'Cognitive continuity loss'],
      dialogueStyle: 'Measured, cadence-conscious',
      relationships: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];

  const memories: StoryMemory[] = [
    {
      id: 'mem_delay',
      storyId: 'story_kepler',
      type: 'world_fact',
      content: 'Planetary communications take 22 hours each way.',
      importance: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];

  it('detects character fear violations when Donald has blind faith in synthetic AI', () => {
    const draftText = "Donald had blind faith in the station core and trusted the AI without checking the telemetry.";
    const warnings = runContinuityAudit(draftText, characters, memories);

    expect(warnings.length).toBeGreaterThan(0);
    const fearWarning = warnings.find(w => w.type === 'character_conflict');
    expect(fearWarning).toBeDefined();
    expect(fearWarning?.issue).toContain('acting against their fundamental fear');
  });

  it('detects lore contradiction when instant radio communication is attempted', () => {
    const draftText = "Donald initiated an instant radio call to Earth to report the discovery.";
    const warnings = runContinuityAudit(draftText, characters, memories);

    const loreWarning = warnings.find(w => w.type === 'worldbuilding_conflict');
    expect(loreWarning).toBeDefined();
    expect(loreWarning?.issue).toContain('22 hours');
  });

  it('passes cleanly when narrative respects character fears and world rules', () => {
    const draftText = "Donald hesitated, checking the physical chronometer thrice. He refused to interface directly with the relay's synthetic core.";
    const warnings = runContinuityAudit(draftText, characters, memories);

    expect(warnings.length).toBe(0);
  });
});
