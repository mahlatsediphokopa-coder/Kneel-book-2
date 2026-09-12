import React, { useState, useEffect, useRef } from 'react';
import { Chapter } from '../types';
import { X, Volume2, VolumeX, CheckCircle, ChevronLeft, ChevronRight, Bookmark, Sparkles, BookOpen } from 'lucide-react';
import { useSpeechAudio } from '../hooks/useSpeechAudio';

interface ReaderModalProps {
  chapter: Chapter | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapter: Chapter) => void;
  allChapters: Chapter[];
  isCompleted: boolean;
  onToggleCompleted: (chapterId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (chapterId: string) => void;
  notes: Record<string, string>;
  onSaveNote: (chapterId: string, note: string) => void;
  darkMode: boolean;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  chapter,
  isOpen,
  onClose,
  onSelectChapter,
  allChapters,
  isCompleted,
  onToggleCompleted,
  isBookmarked,
  onToggleBookmark,
  notes,
  onSaveNote,
  darkMode,
}) => {
  const [fontSize, setFontSize] = useState<number>(18);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [activeParaIdx, setActiveParaIdx] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (chapter) {
      setCurrentNote(notes[chapter.id] || '');
      setActiveParaIdx(-1);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [chapter, notes]);

  // Combine scripture and paragraphs for voice narration
  const allSpeechTexts = chapter ? [chapter.scripture, ...chapter.content] : [];

  const {
    isPlaying,
    isPaused,
    currentIndex,
    playbackRate,
    setPlaybackRate,
    isSupported,
    togglePlay,
    stop,
  } = useSpeechAudio(allSpeechTexts, (idx) => {
    setActiveParaIdx(idx);
    const targetEl = paraRefs.current[idx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  if (!isOpen || !chapter) return null;

  const currentIndexInAll = allChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndexInAll > 0 ? allChapters[currentIndexInAll - 1] : null;
  const nextChapter = currentIndexInAll < allChapters.length - 1 ? allChapters[currentIndexInAll + 1] : null;

  const handleNoteChange = (text: string) => {
    setCurrentNote(text);
    onSaveNote(chapter.id, text);
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  return (
    <div
      id="chapter-reader-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-hidden"
    >
      <div
        className={`w-full max-w-3xl h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-[#fdfbf7] border-stone-200 text-stone-900'
        }`}
      >
        {/* Reader Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              {chapter.num}
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <h2 className="font-serif font-semibold text-sm truncate max-w-[200px] sm:max-w-[340px]">
              {chapter.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Font size controls */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-200/60 dark:bg-stone-800 text-xs font-mono">
              <button
                onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-stone-300 dark:hover:bg-stone-700"
                title="Decrease font"
              >
                A-
              </button>
              <span className="w-6 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-stone-300 dark:hover:bg-stone-700"
                title="Increase font"
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(chapter.id)}
              className={`p-2 rounded-lg transition ${
                isBookmarked
                  ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
              }`}
              title="Bookmark Chapter"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Audio narration button */}
            {isSupported && (
              <button
                onClick={togglePlay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isPlaying && !isPaused
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 hover:bg-stone-300'
                }`}
                title="Listen to audio"
              >
                {isPlaying && !isPaused ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPlaying && !isPaused ? 'Playing' : 'Listen'}</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Audio Progress Bar (if playing) */}
        {isPlaying && (
          <div className="flex items-center justify-between px-4 py-2 text-xs bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
            <span className="truncate">Reading paragraph {currentIndex + 1} of {allSpeechTexts.length}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPlaybackRate((r) => (r === 1 ? 1.25 : r === 1.25 ? 1.5 : 1))}
                className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 font-mono text-[10px]"
              >
                {playbackRate}x
              </button>
              <button onClick={stop} className="text-stone-500 hover:text-stone-700">
                <VolumeX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Reading Content */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-6"
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Header */}
          <div className="text-center pb-6 border-b border-stone-200 dark:border-stone-800">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
              {chapter.num}
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-4xl mt-2 tracking-tight text-stone-900 dark:text-stone-100">
              {chapter.title}
            </h1>
          </div>

          {/* Scripture Anchor */}
          <div
            ref={(el) => (paraRefs.current[0] = el as any)}
            className={`p-5 rounded-2xl border text-center transition-all ${
              activeParaIdx === 0
                ? 'bg-amber-100/70 dark:bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/20'
                : darkMode
                ? 'bg-stone-950/60 border-stone-800'
                : 'bg-stone-50 border-stone-200'
            }`}
          >
            <p className="font-serif italic font-medium leading-relaxed text-stone-800 dark:text-stone-200 text-lg sm:text-xl">
              "{chapter.scripture}"
            </p>
            <p className="mt-2 text-xs font-mono font-semibold tracking-wider text-amber-700 dark:text-amber-400 uppercase">
              — {chapter.scriptureRef}
            </p>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-6 text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
            {chapter.content.map((paragraph, idx) => {
              const paraSpeechIdx = idx + 1;
              const isNarrating = activeParaIdx === paraSpeechIdx;

              return (
                <p
                  key={idx}
                  ref={(el) => (paraRefs.current[paraSpeechIdx] = el)}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isNarrating
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-l-4 border-amber-600 pl-4 text-stone-950 dark:text-stone-50'
                      : ''
                  }`}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Chapter Reflection & Journal Note */}
          <div className="pt-8 border-t border-stone-200 dark:border-stone-800 space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Chapter Reflection Prompt:</span>
              </div>
              <p className="font-serif italic text-sm text-stone-700 dark:text-stone-300">
                "{chapter.reflection}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                My Private Journal Note for this Chapter (Saved in App Storage):
              </label>
              <textarea
                value={currentNote}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Type your insights, covenants made, or action items here..."
                rows={3}
                className={`w-full p-3 rounded-xl border text-sm font-sans outline-none focus:ring-2 focus:ring-amber-500/20 transition ${
                  darkMode ? 'bg-stone-950 border-stone-800 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Reader Bottom Navigation & Complete Action */}
        <div className="p-3.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-950/80">
          <button
            onClick={() => prevChapter && onSelectChapter(prevChapter)}
            disabled={!prevChapter}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border disabled:opacity-30 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={() => onToggleCompleted(chapter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 hover:bg-stone-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'Completed ✓' : 'Mark Completed'}</span>
          </button>

          <button
            onClick={() => nextChapter && onSelectChapter(nextChapter)}
            disabled={!nextChapter}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 disabled:opacity-30 transition"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
