export type StoryStatus = 'draft' | 'active' | 'completed';

export interface Story {
  id: string;
  ownerId: string;
  title: string;
  premise: string;
  genre: string;
  writingStyle: string;
  status: StoryStatus;
  createdAt: number;
  updatedAt: number;
  chapterCount: number;
  characterCount: number;
}

export type ChapterStatus = 'draft' | 'generated' | 'final';

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  order: number;
  content: string;
  summary: string;
  status: ChapterStatus;
  wordCount: number;
  branchId?: string | null;
  parentChapterId?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterRelationship {
  characterId: string;
  characterName: string;
  description: string;
}

export interface Character {
  id: string;
  storyId: string;
  name: string;
  role: string;
  personality: string[];
  background: string;
  motivation: string;
  goals: string[];
  fears: string[];
  dialogueStyle: string;
  developmentNotes?: string;
  avatarUrl?: string;
  relationships: CharacterRelationship[];
  createdAt: number;
  updatedAt: number;
}

export type MemoryType = 
  | 'character_fact'
  | 'world_fact'
  | 'event'
  | 'relationship'
  | 'chapter_summary';

export interface StoryMemory {
  id: string;
  storyId: string;
  type: MemoryType;
  title?: string;
  content: string;
  sourceChapterId?: string;
  sourceChapterTitle?: string;
  importance: number; // 1 to 5
  status?: 'suggested' | 'approved';
  createdAt: number;
  updatedAt: number;
}

export type BranchStatus = 'draft' | 'active' | 'completed';

export interface StoryBranch {
  id: string;
  storyId: string;
  parentChapterId: string;
  parentChapterTitle?: string;
  choiceText: string;
  label: string;
  nextChapterId?: string;
  status: BranchStatus;
  createdAt: number;
}

export interface ContinuityWarning {
  id: string;
  type: 'character_conflict' | 'contradictory_event' | 'relationship_mismatch' | 'worldbuilding_conflict';
  severity: 'low' | 'medium' | 'high';
  issue: string;
  relatedEntity: string;
  sourceChapterId?: string;
  sourceChapterTitle?: string;
  suggestedResolution: string;
}

export interface GeneratedChapterDraft {
  title: string;
  content: string;
  summary: string;
  continuityNotes: string[];
  unresolvedThreads: string[];
  extractedFacts?: Array<{
    type: MemoryType;
    content: string;
    importance: number;
  }>;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

export interface AISettings {
  geminiApiKey: string;
  useBackendProxy: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
}
