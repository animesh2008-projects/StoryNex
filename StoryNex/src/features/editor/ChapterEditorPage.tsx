import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { Chapter, GeneratedChapterDraft, ContinuityWarning, Character } from '../../types';
import { storageAdapter } from '../../services/storage-adapter';
import { aiService, getAISettings } from '../../services/ai-service';
import { runContinuityAudit } from '../../services/continuity-checker';
import { 
  PenTool, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  PlusCircle, 
  Users, 
  BrainCircuit, 
  GitFork, 
  Wand2, 
  MessageSquare, 
  RotateCcw, 
  Check, 
  X, 
  Eye, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const ChapterEditorPage: React.FC = () => {
  const { storyId, chapterId } = useParams();
  const { currentStory, stories, chapters, characters, memories, branches, refreshCurrentStoryData } = useStory();
  const navigate = useNavigate();

  // Active chapter state
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<'draft' | 'generated' | 'final'>('draft');

  // UI state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [focusMode, setFocusMode] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<'ai' | 'characters' | 'memory' | 'continuity'>('ai');

  // AI & Generation state
  const [objective, setObjective] = useState('');
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewDraft, setReviewDraft] = useState<GeneratedChapterDraft | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Continuity warnings state
  const [continuityWarnings, setContinuityWarnings] = useState<ContinuityWarning[]>([]);

  // Dialogue doctor state
  const [selectedDialogue, setSelectedDialogue] = useState('');
  const [dialogueSpeakerId, setDialogueSpeakerId] = useState('');
  const [dialogueResults, setDialogueResults] = useState<string | null>(null);
  const [isDoctoringDialogue, setIsDoctoringDialogue] = useState(false);

  // Autosave and loading refs
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedChapterIdRef = useRef<string | null>(null);
  const isCreatingRef = useRef<boolean>(false);
  const chapterRef = useRef<Chapter | null>(null);

  const activeStory = currentStory || stories.find(s => s.id === storyId);

  useEffect(() => {
    chapterRef.current = chapter;
  }, [chapter]);

  // Load chapter data reliably without overwriting active edits
  useEffect(() => {
    if (!storyId || !chapterId) return;

    if (chapterId === 'new') {
      if (isCreatingRef.current) return;
      isCreatingRef.current = true;

      const newChap: Chapter = {
        id: `chap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        storyId,
        order: chapters.length + 1,
        title: `Chapter ${chapters.length + 1}`,
        content: '',
        summary: '',
        status: 'draft',
        wordCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setChapter(newChap);
      setTitle(newChap.title);
      setContent('');
      setSummary('');
      setStatus('draft');
      setSaveStatus('saved');
      loadedChapterIdRef.current = newChap.id;

      storageAdapter.saveChapter(newChap, activeStory?.ownerId).then(async () => {
        isCreatingRef.current = false;
        await refreshCurrentStoryData();
        navigate(`/app/stories/${storyId}/chapters/${newChap.id}`, { replace: true });
      });
      return;
    }

    // Only load from storage/context when the active chapter ID actually changes
    if (loadedChapterIdRef.current !== chapterId) {
      const found = chapters.find(c => c.id === chapterId);
      if (found) {
        loadedChapterIdRef.current = chapterId;
        setChapter(found);
        setTitle(found.title);
        setContent(found.content);
        setSummary(found.summary);
        setStatus(found.status);
        setSaveStatus('saved');
      } else {
        // Fallback for direct page refresh before context has loaded
        const uid = activeStory?.ownerId || 'author_default_uid';
        storageAdapter.getChapter(uid, storyId, chapterId).then(directChap => {
          if (directChap) {
            loadedChapterIdRef.current = chapterId;
            setChapter(directChap);
            setTitle(directChap.title);
            setContent(directChap.content);
            setSummary(directChap.summary);
            setStatus(directChap.status);
            setSaveStatus('saved');
          }
        });
      }
    }
  }, [chapterId, chapters, storyId, activeStory?.ownerId, refreshCurrentStoryData, navigate]);

  // Run continuity check whenever content or characters change
  useEffect(() => {
    if (content) {
      const warnings = runContinuityAudit(content, characters, memories);
      setContinuityWarnings(warnings);
    } else {
      setContinuityWarnings([]);
    }
  }, [content, characters, memories]);

  // Calculate word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Debounced autosave
  const triggerAutosave = useCallback((newTitle: string, newContent: string, newSummary: string, newStatus: any) => {
    const currentBase = chapterRef.current;
    if (!currentBase || !activeStory) return;
    setSaveStatus('saving');

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(async () => {
      const updated: Chapter = {
        ...currentBase,
        title: newTitle,
        content: newContent,
        summary: newSummary,
        status: newStatus,
        wordCount: newContent.trim() ? newContent.trim().split(/\s+/).length : 0,
        updatedAt: Date.now(),
      };
      await storageAdapter.saveChapter(updated, activeStory.ownerId);
      setChapter(updated);
      setSaveStatus('saved');
    }, 1200);
  }, [activeStory]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSaveStatus('unsaved');
    triggerAutosave(val, content, summary, status);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setSaveStatus('unsaved');
    triggerAutosave(title, val, summary, status);
  };

  // Keyboard shortcut listener (Ctrl+S, Ctrl+Shift+F focus mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (chapter && activeStory) {
          setSaveStatus('saving');
          const updated: Chapter = {
            ...chapter,
            title,
            content,
            summary,
            status,
            wordCount,
            updatedAt: Date.now(),
          };
          storageAdapter.saveChapter(updated, activeStory.ownerId).then(() => {
            setChapter(updated);
            setSaveStatus('saved');
            refreshCurrentStoryData();
          });
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setFocusMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapter, activeStory, title, content, summary, status, wordCount, refreshCurrentStoryData]);

  // AI Chapter Generation
  const handleGenerateChapterDraft = async () => {
    if (!activeStory) return;
    setIsGenerating(true);
    setAiError(null);
    setReviewDraft(null);

    try {
      const selectedCharacters = characters.filter(c => selectedCharIds.includes(c.id));
      const prevChapter = chapters.find(c => c.order === (chapter ? chapter.order - 1 : 0)) || null;

      const draft = await aiService.generateChapter({
        story: activeStory,
        objective,
        characters: selectedCharacters.length > 0 ? selectedCharacters : characters,
        previousChapter: prevChapter,
        memories,
        branch: branches[0] || null,
        length: 'medium',
      });

      setReviewDraft(draft);
    } catch (err: any) {
      setAiError(err.message || 'AI generation failed. Check your Gemini API key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Scene continuation
  const handleContinueScene = async () => {
    if (!activeStory) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const continuation = await aiService.continueScene(content, activeStory, characters);
      const newText = content ? `${content}\n\n${continuation}` : continuation;
      setContent(newText);
      triggerAutosave(title, newText, summary, status);
    } catch (err: any) {
      setAiError(err.message || 'Scene continuation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Dialogue Doctor
  const handleDoctorDialogue = async () => {
    if (!selectedDialogue.trim() || !dialogueSpeakerId) {
      setAiError('Please enter dialogue text and select a speaker character.');
      return;
    }
    const speaker = characters.find(c => c.id === dialogueSpeakerId);
    if (!speaker) return;

    setIsDoctoringDialogue(true);
    setAiError(null);
    try {
      const result = await aiService.improveDialogue(selectedDialogue, speaker);
      setDialogueResults(result);
    } catch (err: any) {
      setAiError(err.message || 'Dialogue enhancement failed.');
    } finally {
      setIsDoctoringDialogue(false);
    }
  };

  // Draft review actions
  const handleAcceptDraftReplace = () => {
    if (!reviewDraft) return;
    setContent(reviewDraft.content);
    if (reviewDraft.title && reviewDraft.title !== 'Untitled Chapter') {
      setTitle(reviewDraft.title);
    }
    if (reviewDraft.summary) {
      setSummary(reviewDraft.summary);
    }
    triggerAutosave(
      reviewDraft.title || title, 
      reviewDraft.content, 
      reviewDraft.summary || summary, 
      'generated'
    );
    setReviewDraft(null);
  };

  const handleAcceptDraftAppend = () => {
    if (!reviewDraft) return;
    const combined = content ? `${content}\n\n${reviewDraft.content}` : reviewDraft.content;
    setContent(combined);
    triggerAutosave(title, combined, summary, status);
    setReviewDraft(null);
  };

  if (!activeStory) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No story universe selected.</p>
        <Link to="/app/stories" className="text-primary hover:underline text-xs mt-2 inline-block">
          Return to Story Archives
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-background ${focusMode ? 'fixed inset-0 z-50 h-screen' : ''}`}>
      {/* Editor Sub-Header Toolbar */}
      <div className="h-12 border-b border-border bg-surface px-4 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/app/stories/${activeStory.id}`)}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-secondary"
            title="Return to Universe Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-text-muted uppercase">Chapter</span>
            <span className="font-mono text-primary font-bold">#{chapter?.order || 1}</span>
            <span className="text-text-muted font-mono">|</span>
            <span className="font-semibold text-text-primary truncate max-w-xs">{title || 'Untitled'}</span>
          </div>
        </div>

        {/* Center / Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-text-muted font-mono text-[11px]">
            {saveStatus === 'saving' && (
              <span className="text-status-warning flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-status-warning animate-ping"></span>
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-status-success flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-text-muted">Unsaved changes</span>
            )}
          </div>

          <div className="font-mono text-text-muted text-[11px]">
            {wordCount} words
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center space-x-2">
          {continuityWarnings.length > 0 && (
            <button
              onClick={() => {
                setRightPanelOpen(true);
                setActiveRightTab('continuity');
              }}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-status-warning/10 text-status-warning border border-status-warning/30 hover:bg-status-warning/20 transition-colors"
              title={`${continuityWarnings.length} Continuity Warnings`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px]">{continuityWarnings.length} Warnings</span>
            </button>
          )}

          <button
            onClick={() => setFocusMode(prev => !prev)}
            className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-secondary"
            title={focusMode ? "Exit Focus Mode (Ctrl+Shift+F)" : "Focus Mode (Ctrl+Shift+F)"}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reviewable AI Draft Banner (Never Overwrites Author Content Silently) */}
      {reviewDraft && (
        <div className="bg-surface-secondary border-b border-primary/40 p-4 shrink-0 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-primary font-mono text-xs">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">REVIEWABLE GENERATED DRAFT READY</span>
              <span className="text-text-muted">({reviewDraft.content.split(/\s+/).length} words)</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAcceptDraftReplace}
                className="px-3 py-1.5 rounded bg-primary text-black font-semibold text-xs flex items-center space-x-1 hover:bg-primary-strong transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Replace Chapter</span>
              </button>
              <button
                onClick={handleAcceptDraftAppend}
                className="px-3 py-1.5 rounded bg-surface border border-border text-text-primary text-xs flex items-center space-x-1 hover:border-primary/50 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-accent" />
                <span>Append to End</span>
              </button>
              <button
                onClick={() => setReviewDraft(null)}
                className="p-1.5 text-text-muted hover:text-text-primary rounded"
                title="Discard Draft"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-36 overflow-y-auto p-3 rounded bg-background/80 border border-border text-xs font-editor text-text-secondary leading-relaxed whitespace-pre-wrap">
            {reviewDraft.content}
          </div>

          {reviewDraft.continuityNotes.length > 0 && (
            <div className="text-[11px] font-mono text-text-muted flex items-center gap-2">
              <span className="text-status-success">Continuity Anchored:</span>
              <span>{reviewDraft.continuityNotes.join(' • ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Main 3-Panel Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Chapter Outline & Branch Decisions */}
        {!focusMode && leftPanelOpen && (
          <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-border flex items-center justify-between text-xs font-mono uppercase text-text-muted">
              <span>Outline & Branches</span>
              <Link
                to={`/app/stories/${activeStory.id}/chapters/new`}
                className="text-primary hover:text-primary-strong flex items-center gap-1 font-semibold"
                title="New Chapter"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add</span>
              </Link>
            </div>

            {/* Chapters list */}
            <div className="p-2 space-y-1">
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => navigate(`/app/stories/${activeStory.id}/chapters/${ch.id}`)}
                  className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors flex items-center justify-between ${
                    ch.id === chapter?.id 
                      ? 'bg-primary/10 border border-primary/30 text-primary font-semibold' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[10px] text-text-muted mr-1.5">#{ch.order}</span>
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted shrink-0">
                    {ch.wordCount}w
                  </span>
                </div>
              ))}
            </div>

            {/* Narrative Decisions & Branches for this chapter */}
            <div className="p-3 border-t border-border mt-auto bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-text-muted">
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3 text-purple-400" />
                  <span>Multiverse Branches</span>
                </span>
                <Link to="/app/branches" className="text-primary hover:underline text-[10px]">
                  Tree
                </Link>
              </div>

              {branches.length === 0 ? (
                <p className="text-[11px] text-text-muted">
                  No active alternate branches. You can fork this scene in the Branch Explorer.
                </p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {branches.slice(0, 3).map(b => (
                    <div key={b.id} className="p-2 rounded bg-surface border border-border text-[11px] space-y-0.5">
                      <span className="font-semibold text-accent block">{b.label}</span>
                      <p className="text-text-muted line-clamp-1">{b.choiceText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* CENTER PANEL: Writing Editor */}
        <section className="flex-1 flex flex-col bg-background overflow-y-auto">
          <div className="max-w-3xl w-full mx-auto px-6 py-8 sm:px-12 flex-1 flex flex-col space-y-6">
            {/* Chapter Title Input */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Chapter Title..."
              className="w-full bg-transparent text-2xl sm:text-3xl font-heading font-extrabold text-text-primary focus:outline-none placeholder:text-text-muted border-b border-transparent focus:border-border transition-colors pb-2"
            />

            {/* Writing Area */}
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Begin writing your scene... The hydro-coolers hummed in the dark..."
              className="w-full flex-1 bg-transparent text-base sm:text-lg font-editor text-text-primary focus:outline-none placeholder:text-text-muted/60 leading-relaxed resize-none min-h-[500px]"
            />
          </div>
        </section>

        {/* RIGHT PANEL: Character Psychology, Memory & AI Co-Writer */}
        {!focusMode && rightPanelOpen && (
          <aside className="w-80 border-l border-border bg-surface flex flex-col shrink-0 overflow-y-auto">
            {/* Panel Tabs */}
            <div className="grid grid-cols-4 border-b border-border bg-surface-secondary text-[11px] font-mono">
              <button
                onClick={() => setActiveRightTab('ai')}
                className={`py-2.5 transition-colors border-b-2 flex justify-center items-center gap-1 ${
                  activeRightTab === 'ai' 
                    ? 'border-primary text-primary font-bold bg-surface' 
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI</span>
              </button>

              <button
                onClick={() => setActiveRightTab('characters')}
                className={`py-2.5 transition-colors border-b-2 flex justify-center items-center gap-1 ${
                  activeRightTab === 'characters' 
                    ? 'border-primary text-primary font-bold bg-surface' 
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Cast</span>
              </button>

              <button
                onClick={() => setActiveRightTab('memory')}
                className={`py-2.5 transition-colors border-b-2 flex justify-center items-center gap-1 ${
                  activeRightTab === 'memory' 
                    ? 'border-primary text-primary font-bold bg-surface' 
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Memory</span>
              </button>

              <button
                onClick={() => setActiveRightTab('continuity')}
                className={`py-2.5 transition-colors border-b-2 flex justify-center items-center gap-1 ${
                  activeRightTab === 'continuity' 
                    ? 'border-status-warning text-status-warning font-bold bg-surface' 
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Audit</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 space-y-4 flex-1">
              {/* TAB 1: AI CO-WRITER */}
              {activeRightTab === 'ai' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-primary uppercase tracking-wider block">
                      8-Factor Chapter Generator
                    </span>
                    <p className="text-xs text-text-muted">
                      Draft a complete scene anchored in character psychology and story memory.
                    </p>
                  </div>

                  {aiError && (
                    <div className="p-3 rounded bg-status-error/10 border border-status-error/30 text-status-error text-xs space-y-1">
                      <p className="font-semibold">AI Assistant Notice:</p>
                      <p>{aiError}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">
                        Chapter Objective
                      </label>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="e.g., Reveal the biometric code anomaly..."
                        className="w-full px-3 py-1.5 bg-background border border-border rounded text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">
                        Cast in Scene (Select to Anchor Voice)
                      </label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {characters.map(c => (
                          <label key={c.id} className="flex items-center space-x-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary">
                            <input
                              type="checkbox"
                              checked={selectedCharIds.includes(c.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedCharIds(prev => [...prev, c.id]);
                                else setSelectedCharIds(prev => prev.filter(id => id !== c.id));
                              }}
                              className="rounded border-border text-primary focus:ring-0 bg-background"
                            />
                            <span>{c.name} ({c.role})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateChapterDraft}
                      disabled={isGenerating}
                      className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-strong disabled:opacity-50 text-black font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-md"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Chapter Draft'}</span>
                    </button>
                  </div>

                  {/* Scene Continuation */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <span className="text-[11px] font-mono text-accent uppercase tracking-wider block">
                      Scene Continuation
                    </span>
                    <button
                      onClick={handleContinueScene}
                      disabled={isGenerating || !content}
                      className="w-full py-1.5 px-3 rounded bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-text-primary text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <PenTool className="w-3.5 h-3.5 text-accent" />
                      <span>Continue Next Dramatic Beat</span>
                    </button>
                  </div>

                  {/* Dialogue Doctor */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                      Dialogue Doctor
                    </span>
                    <select
                      value={dialogueSpeakerId}
                      onChange={(e) => setDialogueSpeakerId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-text-primary"
                    >
                      <option value="">Select speaking character...</option>
                      {characters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={selectedDialogue}
                      onChange={(e) => setSelectedDialogue(e.target.value)}
                      placeholder='Line to doctor: "I don&#39;t know if we can trust this."'
                      className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-text-primary"
                    />

                    <button
                      onClick={handleDoctorDialogue}
                      disabled={isDoctoringDialogue}
                      className="w-full py-1.5 px-3 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isDoctoringDialogue ? 'Doctoring...' : 'Doctor Character Voice'}</span>
                    </button>

                    {dialogueResults && (
                      <div className="p-2.5 rounded bg-background border border-border text-xs text-text-secondary whitespace-pre-wrap">
                        {dialogueResults}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CAST & PSYCHOLOGY */}
              {activeRightTab === 'characters' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-muted uppercase">Cast in this Universe</span>
                    <Link to="/app/characters" className="text-xs text-primary hover:underline">
                      Studio
                    </Link>
                  </div>

                  {characters.length === 0 ? (
                    <p className="text-xs text-text-muted">No characters created yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {characters.map(c => (
                        <div key={c.id} className="p-3 rounded-lg bg-surface-secondary border border-border space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-text-primary">{c.name}</span>
                            <span className="text-[10px] font-mono text-text-muted">{c.role}</span>
                          </div>
                          <p className="text-[11px] text-text-muted">
                            <strong className="text-text-secondary">Fear:</strong> {c.fears.join(', ') || 'None'}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            <strong className="text-text-secondary">Voice:</strong> {c.dialogueStyle}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: 3-LAYER STORY MEMORY */}
              {activeRightTab === 'memory' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-muted uppercase">Active Lore Anchors</span>
                    <Link to="/app/memory" className="text-xs text-accent hover:underline">
                      Memory Hub
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {memories.length === 0 ? (
                      <p className="text-text-muted">No memory facts registered.</p>
                    ) : (
                      memories.slice(0, 5).map(m => (
                        <div key={m.id} className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-primary uppercase">
                              [{m.type.replace('_', ' ')}]
                            </span>
                            <span className="text-[10px] font-mono text-text-muted">Imp: {m.importance}/5</span>
                          </div>
                          <p className="text-text-secondary text-[11px] leading-relaxed">
                            {m.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTINUITY WARNINGS */}
              {activeRightTab === 'continuity' && (
                <div className="space-y-3 text-xs">
                  <span className="text-[11px] font-mono text-status-warning uppercase tracking-wider block">
                    Continuity Audit
                  </span>

                  {continuityWarnings.length === 0 ? (
                    <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/30 text-status-success text-center space-y-1">
                      <CheckCircle2 className="w-5 h-5 mx-auto" />
                      <p className="font-semibold text-xs">No Continuity Violations</p>
                      <p className="text-[11px] text-text-muted">Character motivations and timeline rules are respected.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {continuityWarnings.map((w, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/40 space-y-1.5 text-xs text-text-primary">
                          <div className="flex items-center justify-between font-mono text-[10px] text-status-warning font-semibold uppercase">
                            <span>{w.type.replace('_', ' ')}</span>
                            <span>{w.severity}</span>
                          </div>
                          <p className="text-text-primary font-medium">{w.issue}</p>
                          <p className="text-text-muted text-[11px] leading-relaxed">
                            <strong className="text-status-warning">Suggested fix:</strong> {w.suggestedResolution}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
