import { Story, Chapter, Character, StoryMemory, StoryBranch } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const LOCAL_STORAGE_PREFIX = 'storynex_data_v1';

// Seed demo data for initial exploration
export const getInitialDemoData = (userId: string) => {
  const storyId = `demo_story_${Date.now()}`;
  const char1Id = `char_donald_${Date.now()}`;
  const char2Id = `char_lyra_${Date.now()}`;
  const chap1Id = `chap_prologue_${Date.now()}`;
  const chap2Id = `chap_archive_${Date.now()}`;
  const branch1Id = `branch_reveal_${Date.now()}`;
  const branch2Id = `branch_hide_${Date.now()}`;

  const demoStory: Story = {
    id: storyId,
    ownerId: userId,
    title: "The Obsidian Archive",
    genre: "Sci-Fi / Cosmic Mystery",
    writingStyle: "Atmospheric, introspective, with sharp cinematic pacing",
    premise: "In a submerged orbital relay drifting over Kepler-186f, an archivist uncovers a temporal distress signal recorded by his own future self.",
    status: "active",
    chapterCount: 2,
    characterCount: 2,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000,
  };

  const characters: Character[] = [
    {
      id: char1Id,
      storyId,
      name: "Donald Vance",
      role: "Lead Relic Archivist",
      personality: ["Meticulous", "Skeptical", "Haunted by past expeditions", "Quietly rebellious"],
      background: "Former surveyor for the Stellar Cartography Bureau who requested isolation on the Kepler relay after the Titan anomaly.",
      motivation: "To uncover the true cause of the frequency shifts before the bureau decommissions the station.",
      goals: ["Decrypt the subterranean data vault", "Protect the remaining signal beacons"],
      fears: ["Losing his cognitive continuity", "Trusting the synthetic intelligence overseers"],
      dialogueStyle: "Measured, cadence-conscious, questions underlying motives before answering.",
      developmentNotes: "Gradually recognizes that his handwriting matches the symbols found on the station's hull.",
      relationships: [
        {
          characterId: char2Id,
          characterName: "Lyra Thorne",
          description: "Reluctant ally; respects her technical acumen but suspects she reports to planetary security."
        }
      ],
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: char2Id,
      storyId,
      name: "Lyra Thorne",
      role: "Sub-Surface Cryptographer",
      personality: ["Pragmatic", "Hyper-observant", "Guarded", "Morally flexible"],
      background: "Dispatched under sealed orders from the orbital high council to verify quantum entanglement decay.",
      motivation: "Retrieve the primary chronometer sequence without alerting station automated defense arrays.",
      goals: ["Secure the station's core memory logs", "Prevent catastrophic pressure breach"],
      fears: ["Total orbital de-orbiting into Kepler's ionosphere"],
      dialogueStyle: "Direct, technical precision, uses dry irony under acute pressure.",
      relationships: [
        {
          characterId: char1Id,
          characterName: "Donald Vance",
          description: "Finds his stubborn adherence to physical records nostalgic yet dangerously slow."
        }
      ],
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    }
  ];

  const chapters: Chapter[] = [
    {
      id: chap1Id,
      storyId,
      order: 1,
      title: "Prologue: Static Over Kepler",
      status: "final",
      wordCount: 384,
      content: `The hum of the hydro-coolers was the only pulse left inside Sector Four. Donald leaned over the phosphor display, his sleeve catching on the rusted bracket of the chronometer. 

Three years of white noise had conditioned him to ignore the rhythmic stutter of atmospheric storms. But this tone was neither storm nor satellite flutter. It was a ternary cadence, repeating every forty-two seconds with terrifying mathematical symmetry.

"Lyra," Donald called into the comm conduit, his voice rasping against the station's dry air. "The transponder on Sub-Level Nine just tripped the security relay."

The comm speaker crackled. Lyra's voice sounded remote, filtered through layers of leaded bulkhead. "Nothing on Nine is powered, Vance. We vented that bay during the solar flare."

"Then look at the pressure monitors," he murmured, his fingertips pressing against the cold glass. "Something down there just drew half a megawatt from the auxiliary batteries. And it's broadcasting in our private frequency."`,
      summary: "Donald detects an impossible ternary signal from Sub-Level Nine. Despite Lyra's skepticism that the bay is unpowered, auxiliary power is drained by an unknown transmitter broadcasting on their secure channel.",
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: chap2Id,
      storyId,
      order: 2,
      title: "Chapter 1: The Sealed Conduit",
      status: "draft",
      wordCount: 422,
      content: `The bulkhead to Sub-Level Nine was secured with heavy manual hydraulic clamps, coated in a crust of crystallized coolant. Donald held the arc-torch while Lyra knelt in front of the bypass terminal.

"Someone overrode the lock from the inside," Lyra said, her flashlight beam cutting through the suspended dust motes. "The biometric signature is corrupted, but the authorization code was issued forty hours ago."

"Forty hours ago we were locked in the centrifuge during solar flare lockdown," Donald said.

"I know," Lyra replied, glancing up at him. Her eyes reflected the blue glare of her optical scanner. "And the cipher key used was yours, Vance."

Before Donald could answer, the heavy steel portal let out a pressurized groan. The air that seeped through smelled not of machine oil or frozen nitrogen, but of cedar smoke and ozone—an organic fragrance that had not existed on this relay in twenty generations.

Resting on the metal grate just inside the threshold was a mechanical cylinder, etched with deep circular incisions.

Donald took a step toward it, his pulse thudding in his temples. He had two choices: open the cylinder here in front of Lyra, or secure it in his personal hazard chest before planetary command intercepted the beacon.`,
      summary: "Donald and Lyra unlock Sub-Level Nine to find Donald's personal cipher was used during lockdown. Inside the chamber, they discover an impossible scent of cedar and a mechanical cylinder etched with circular runes.",
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 1800000,
    }
  ];

  const memories: StoryMemory[] = [
    {
      id: `mem_kepler_relay_${Date.now()}`,
      storyId,
      type: "world_fact",
      title: "Relay 186-Kepler Isolation",
      content: "The station orbits Kepler-186f in extreme atmospheric isolation; planetary communications take 22 hours each way.",
      importance: 5,
      status: "approved",
      sourceChapterId: chap1Id,
      sourceChapterTitle: "Prologue: Static Over Kepler",
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: `mem_cipher_${Date.now()}`,
      storyId,
      type: "event",
      title: "Sub-Level Nine Breach",
      content: "Sub-Level Nine was unlocked using Donald's personal biometric code while Donald and Lyra were supposedly trapped in the centrifuge.",
      importance: 5,
      status: "approved",
      sourceChapterId: chap2Id,
      sourceChapterTitle: "Chapter 1: The Sealed Conduit",
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: `mem_lyra_orders_${Date.now()}`,
      storyId,
      type: "relationship",
      title: "Lyra's Hidden Directives",
      content: "Lyra has sealed orders from the orbital high council to secure chronometer data before station decommissioning.",
      importance: 4,
      status: "approved",
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: `mem_cedar_smoke_${Date.now()}`,
      storyId,
      type: "world_fact",
      title: "Organic Anomaly",
      content: "Air leaking from Sub-Level Nine carried the scent of cedar smoke and ozone, impossible in a sealed inorganic station.",
      importance: 3,
      status: "approved",
      sourceChapterId: chap2Id,
      sourceChapterTitle: "Chapter 1: The Sealed Conduit",
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
    }
  ];

  const branches: StoryBranch[] = [
    {
      id: branch1Id,
      storyId,
      parentChapterId: chap2Id,
      parentChapterTitle: "Chapter 1: The Sealed Conduit",
      choiceText: "Open the cylinder immediately and decipher the inscription with Lyra.",
      label: "Choice A: Immediate Disclosure",
      status: "active",
      createdAt: Date.now() - 3600000,
    },
    {
      id: branch2Id,
      storyId,
      parentChapterId: chap2Id,
      parentChapterTitle: "Chapter 1: The Sealed Conduit",
      choiceText: "Conceal the cylinder in the biohazard carrier and investigate the chronometer alone.",
      label: "Choice B: Solitary Investigation",
      status: "draft",
      createdAt: Date.now() - 3600000,
    }
  ];

  return { demoStory, characters, chapters, memories, branches };
};

function resolveUserId(userId?: string): string {
  if (userId && userId !== 'demo') return userId;
  try {
    const raw = localStorage.getItem('storynex_current_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.uid) return u.uid;
    }
  } catch {}
  return 'author_default_uid';
}

// Generic storage engine
export const storageAdapter = {
  // STORIES
  async getStories(userId: string): Promise<Story[]> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'users', uid, 'stories'), orderBy('updatedAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Story));
      } catch (e) {
        console.warn("Firestore error in getStories, falling back to local:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_stories`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Seed demo data on first visit
      const seed = getInitialDemoData(uid);
      await this.saveStory(seed.demoStory);
      for (const c of seed.characters) await this.saveCharacter(c, uid);
      for (const ch of seed.chapters) await this.saveChapter(ch, uid);
      for (const m of seed.memories) await this.saveMemory(m, uid);
      for (const b of seed.branches) await this.saveBranch(b, uid);
      return [seed.demoStory];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async getStory(userId: string, storyId: string): Promise<Story | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', userId, 'stories', storyId);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { ...snap.data(), id: snap.id } as Story;
      } catch (e) {
        console.warn("Firestore error in getStory:", e);
      }
    }
    const stories = await this.getStories(userId);
    return stories.find(s => s.id === storyId) || null;
  },

  async saveStory(story: Story): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', story.ownerId, 'stories', story.id);
        await setDoc(docRef, story, { merge: true });
      } catch (e) {
        console.warn("Firestore saveStory error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${story.ownerId}_stories`;
    const list = await this.getStories(story.ownerId);
    const idx = list.findIndex(s => s.id === story.id);
    if (idx >= 0) {
      list[idx] = story;
    } else {
      list.unshift(story);
    }
    localStorage.setItem(key, JSON.stringify(list));
  },

  async deleteStory(userId: string, storyId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'stories', storyId));
      } catch (e) {
        console.warn("Firestore deleteStory error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${userId}_stories`;
    const list = (await this.getStories(userId)).filter(s => s.id !== storyId);
    localStorage.setItem(key, JSON.stringify(list));
  },

  // CHARACTERS
  async getCharacters(userId: string, storyId: string): Promise<Character[]> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'users', uid, 'stories', storyId, 'characters'));
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Character));
      } catch (e) {
        console.warn("Firestore getCharacters error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_characters`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  async saveCharacter(character: Character, userId?: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', uid, 'stories', character.storyId, 'characters', character.id);
        await setDoc(docRef, character, { merge: true });
      } catch (e) {
        console.warn("Firestore saveCharacter error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${character.storyId}_characters`;
    const list = await this.getCharacters(uid, character.storyId);
    const idx = list.findIndex(c => c.id === character.id);
    if (idx >= 0) list[idx] = character;
    else list.push(character);
    localStorage.setItem(key, JSON.stringify(list));
  },

  async deleteCharacter(userId: string, storyId: string, characterId: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'stories', storyId, 'characters', characterId));
      } catch (e) {
        console.warn("Firestore deleteCharacter error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_characters`;
    const list = (await this.getCharacters(uid, storyId)).filter(c => c.id !== characterId);
    localStorage.setItem(key, JSON.stringify(list));
  },

  // CHAPTERS
  async getChapters(userId: string, storyId: string): Promise<Chapter[]> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'users', uid, 'stories', storyId, 'chapters'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Chapter));
      } catch (e) {
        console.warn("Firestore getChapters error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_chapters`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  async getChapter(userId: string, storyId: string, chapterId: string): Promise<Chapter | null> {
    const uid = resolveUserId(userId);
    const list = await this.getChapters(uid, storyId);
    return list.find(c => c.id === chapterId) || null;
  },

  async saveChapter(chapter: Chapter, userId?: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', uid, 'stories', chapter.storyId, 'chapters', chapter.id);
        await setDoc(docRef, chapter, { merge: true });
      } catch (e) {
        console.warn("Firestore saveChapter error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${chapter.storyId}_chapters`;
    const list = await this.getChapters(uid, chapter.storyId);
    const idx = list.findIndex(c => c.id === chapter.id);
    if (idx >= 0) list[idx] = chapter;
    else list.push(chapter);
    list.sort((a, b) => a.order - b.order);
    localStorage.setItem(key, JSON.stringify(list));
  },

  async deleteChapter(userId: string, storyId: string, chapterId: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'stories', storyId, 'chapters', chapterId));
      } catch (e) {
        console.warn("Firestore deleteChapter error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_chapters`;
    const list = (await this.getChapters(uid, storyId)).filter(c => c.id !== chapterId);
    localStorage.setItem(key, JSON.stringify(list));
  },

  // MEMORIES (3-LAYER)
  async getMemories(userId: string, storyId: string): Promise<StoryMemory[]> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'users', uid, 'stories', storyId, 'memories'));
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as StoryMemory));
      } catch (e) {
        console.warn("Firestore getMemories error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_memories`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  async saveMemory(memory: StoryMemory, userId?: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', uid, 'stories', memory.storyId, 'memories', memory.id);
        await setDoc(docRef, memory, { merge: true });
      } catch (e) {
        console.warn("Firestore saveMemory error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${memory.storyId}_memories`;
    const list = await this.getMemories(uid, memory.storyId);
    const idx = list.findIndex(m => m.id === memory.id);
    if (idx >= 0) list[idx] = memory;
    else list.unshift(memory);
    localStorage.setItem(key, JSON.stringify(list));
  },

  async deleteMemory(userId: string, storyId: string, memoryId: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'stories', storyId, 'memories', memoryId));
      } catch (e) {
        console.warn("Firestore deleteMemory error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_memories`;
    const list = (await this.getMemories(uid, storyId)).filter(m => m.id !== memoryId);
    localStorage.setItem(key, JSON.stringify(list));
  },

  // BRANCHES
  async getBranches(userId: string, storyId: string): Promise<StoryBranch[]> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'users', uid, 'stories', storyId, 'branches'));
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as StoryBranch));
      } catch (e) {
        console.warn("Firestore getBranches error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_branches`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  async saveBranch(branch: StoryBranch, userId?: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', uid, 'stories', branch.storyId, 'branches', branch.id);
        await setDoc(docRef, branch, { merge: true });
      } catch (e) {
        console.warn("Firestore saveBranch error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${branch.storyId}_branches`;
    const list = await this.getBranches(uid, branch.storyId);
    const idx = list.findIndex(b => b.id === branch.id);
    if (idx >= 0) list[idx] = branch;
    else list.push(branch);
    localStorage.setItem(key, JSON.stringify(list));
  },

  async deleteBranch(userId: string, storyId: string, branchId: string): Promise<void> {
    const uid = resolveUserId(userId);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'stories', storyId, 'branches', branchId));
      } catch (e) {
        console.warn("Firestore deleteBranch error:", e);
      }
    }
    const key = `${LOCAL_STORAGE_PREFIX}_${uid}_${storyId}_branches`;
    const list = (await this.getBranches(uid, storyId)).filter(b => b.id !== branchId);
    localStorage.setItem(key, JSON.stringify(list));
  }
};
