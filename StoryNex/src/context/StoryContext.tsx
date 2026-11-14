import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Story, Chapter, Character, StoryMemory, StoryBranch } from '../types';
import { storageAdapter } from '../services/storage-adapter';
import { useAuth } from './AuthContext';

interface StoryContextType {
  stories: Story[];
  currentStory: Story | null;
  chapters: Chapter[];
  characters: Character[];
  memories: StoryMemory[];
  branches: StoryBranch[];
  loading: boolean;
  selectStory: (storyId: string) => Promise<void>;
  createStory: (data: Omit<Story, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'chapterCount' | 'characterCount'>) => Promise<Story>;
  updateStory: (story: Story) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
  refreshCurrentStoryData: () => Promise<void>;
  refreshStories: () => Promise<void>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [memories, setMemories] = useState<StoryMemory[]>([]);
  const [branches, setBranches] = useState<StoryBranch[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = currentUser?.uid || 'demo_author';

  const refreshStories = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const list = await storageAdapter.getStories(userId);
      setStories(list);
      setCurrentStory(prev => {
        if (!prev && list.length > 0) return list[0];
        if (prev) {
          const matching = list.find(s => s.id === prev.id);
          return matching || prev;
        }
        return null;
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshCurrentStoryData = useCallback(async () => {
    if (!currentStory) return;
    const [chaps, chars, mems, brs] = await Promise.all([
      storageAdapter.getChapters(userId, currentStory.id),
      storageAdapter.getCharacters(userId, currentStory.id),
      storageAdapter.getMemories(userId, currentStory.id),
      storageAdapter.getBranches(userId, currentStory.id),
    ]);
    setChapters(chaps);
    setCharacters(chars);
    setMemories(mems);
    setBranches(brs);

    // Update counts on story if changed
    if (currentStory.chapterCount !== chaps.length || currentStory.characterCount !== chars.length) {
      const updatedStory = {
        ...currentStory,
        chapterCount: chaps.length,
        characterCount: chars.length,
        updatedAt: Date.now(),
      };
      await storageAdapter.saveStory(updatedStory);
      setCurrentStory(updatedStory);
    }
  }, [currentStory, userId]);

  useEffect(() => {
    refreshStories();
  }, [refreshStories]);

  useEffect(() => {
    if (currentStory) {
      refreshCurrentStoryData();
    } else {
      setChapters([]);
      setCharacters([]);
      setMemories([]);
      setBranches([]);
    }
  }, [currentStory?.id]);

  const selectStory = async (storyId: string) => {
    const found = stories.find(s => s.id === storyId) || await storageAdapter.getStory(userId, storyId);
    if (found) {
      setCurrentStory(found);
    }
  };

  const createStory = async (data: Omit<Story, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'chapterCount' | 'characterCount'>) => {
    const newStory: Story = {
      ...data,
      id: `story_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ownerId: userId,
      status: 'active',
      chapterCount: 0,
      characterCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await storageAdapter.saveStory(newStory);
    setStories(prev => [newStory, ...prev]);
    setCurrentStory(newStory);
    return newStory;
  };

  const updateStory = async (story: Story) => {
    const updated = { ...story, updatedAt: Date.now() };
    await storageAdapter.saveStory(updated);
    setStories(prev => prev.map(s => s.id === story.id ? updated : s));
    if (currentStory?.id === story.id) {
      setCurrentStory(updated);
    }
  };

  const deleteStory = async (storyId: string) => {
    await storageAdapter.deleteStory(userId, storyId);
    setStories(prev => prev.filter(s => s.id !== storyId));
    if (currentStory?.id === storyId) {
      const remaining = stories.filter(s => s.id !== storyId);
      setCurrentStory(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        currentStory,
        chapters,
        characters,
        memories,
        branches,
        loading,
        selectStory,
        createStory,
        updateStory,
        deleteStory,
        refreshCurrentStoryData,
        refreshStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) throw new Error("useStory must be used within a StoryProvider");
  return context;
};
