import { describe, it, expect, beforeEach } from 'vitest';
import { storageAdapter, getInitialDemoData } from '../src/services/storage-adapter';
import { Story, Chapter, Character } from '../src/types';

describe('Storage Adapter & Demo Seed Generator', () => {
  const userId = 'test_author_123';

  it('generates rich initial demo data with 2 characters, 2 chapters, memories, and branches', () => {
    const seed = getInitialDemoData(userId);
    expect(seed.demoStory.title).toBe('The Obsidian Archive');
    expect(seed.characters.length).toBe(2);
    expect(seed.chapters.length).toBe(2);
    expect(seed.memories.length).toBe(4);
    expect(seed.branches.length).toBe(2);

    expect(seed.characters[0].name).toBe('Donald Vance');
    expect(seed.characters[1].name).toBe('Lyra Thorne');
  });

  it('preserves story metadata with correct ownerId', () => {
    const seed = getInitialDemoData(userId);
    expect(seed.demoStory.ownerId).toBe(userId);
    expect(seed.demoStory.status).toBe('active');
  });
});
