import { describe, it, expect } from 'vitest';
import { build8FactorPrompt } from '../src/services/ai-service';
import { Story, Character, StoryMemory, Chapter } from '../src/types';

describe('8-Factor Context Assembly', () => {
  const story: Story = {
    id: 'story_1',
    ownerId: 'author_1',
    title: 'The Obsidian Archive',
    genre: 'Sci-Fi / Space Mystery',
    writingStyle: 'Atmospheric, introspective',
    premise: 'An archivist uncovers a temporal distress signal.',
    status: 'active',
    chapterCount: 1,
    characterCount: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const character: Character = {
    id: 'char_1',
    storyId: 'story_1',
    name: 'Donald Vance',
    role: 'Lead Relic Archivist',
    personality: ['Skeptical'],
    background: 'Station surveyor.',
    motivation: 'Uncover signal truth.',
    goals: ['Decrypt vault'],
    fears: ['Synthetic AI'],
    dialogueStyle: 'Measured cadence',
    relationships: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const memory: StoryMemory = {
    id: 'mem_1',
    storyId: 'story_1',
    type: 'world_fact',
    content: 'Atmospheric storms block infrared scanners.',
    importance: 4,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('constructs an 8-factor prompt containing all narrative pillars', () => {
    const prompt = build8FactorPrompt({
      story,
      objective: 'Breach the sealed conduit',
      characters: [character],
      memories: [memory],
      length: 'medium',
      userInstructions: 'Emphasize cedar scent anomaly'
    });

    expect(prompt).toContain('1. STORY PREMISE:');
    expect(prompt).toContain('The Obsidian Archive');
    expect(prompt).toContain('2. GENRE & WRITING STYLE:');
    expect(prompt).toContain('Atmospheric, introspective');
    expect(prompt).toContain('3. CHAPTER OBJECTIVE:');
    expect(prompt).toContain('Breach the sealed conduit');
    expect(prompt).toContain('4. ACTIVE CHARACTERS & PSYCHOLOGY:');
    expect(prompt).toContain('Donald Vance');
    expect(prompt).toContain('Synthetic AI');
    expect(prompt).toContain('6. ESTABLISHED STORY FACTS & LORE:');
    expect(prompt).toContain('Atmospheric storms block infrared scanners.');
    expect(prompt).toContain('8. AUTHOR\'S SPECIFIC INSTRUCTIONS:');
    expect(prompt).toContain('Emphasize cedar scent anomaly');
  });
});
