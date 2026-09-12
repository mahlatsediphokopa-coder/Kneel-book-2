import React, { useState } from 'react';
import { Chapter } from '../types';
import { GROWTH_STAGES } from '../data/laws';
import { Search, CheckCircle, Bookmark, Clock, Sparkles } from 'lucide-react';

interface ChapterListViewProps {
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  completedIds: string[];
  bookmarkedIds: string[];
  darkMode: boolean;
}

export const ChapterListView: React.FC<ChapterListViewProps> = ({
  chapters,
  onSelectChapter,
  completedIds,
  bookmarkedIds,
  darkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const filteredChapters = chapters.filter((chapter) => {
    if (selectedStage !== 'all' && chapter.stageIdx !== selectedStage) {
      return false;
    }
    if (onlyBookmarks && !bookmarkedIds.includes(chapter.id)) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      chapter.title.toLowerCase().includes(query) ||
      chapter.num.toLowerCase().includes(query) ||
      chapter.scripture.toLowerCase().includes(query) ||
      chapter.content.some((p) => p.toLowerCase().includes(query))
    );
  });

  return (
    <div id="chapter-list-view" className="space-y-5">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, laws, scriptures, principles..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition ${
              darkMode ? 'bg-stone-900 border-stone-800 text-stone-100 placeholder:text-stone-500' : 'bg-white border-stone-200 text-stone-900'
            }`}
          />
        </div>

        {/* Bookmarks Toggle */}
        <button
          onClick={() => setOnlyBookmarks((b) => !b)}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
            onlyBookmarks
              ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
              : darkMode
              ? 'bg-stone-900 border-stone-800 text-stone-400'
              : 'bg-white border-stone-200 text-stone-600'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Saved ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* Stage Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedStage('all')}
          className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition ${
            selectedStage === 'all'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : darkMode
              ? 'bg-stone-800 text-stone-400'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          All (15)
        </button>
        {GROWTH_STAGES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setSelectedStage(idx)}
            className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition ${
              selectedStage === idx
                ? 'bg-amber-700 text-white'
                : darkMode
                ? 'bg-stone-800 text-stone-400'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredChapters.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-stone-400 text-sm italic">
            No chapters match your query.
          </div>
        ) : (
          filteredChapters.map((c) => {
            const isDone = completedIds.includes(c.id);
            const isBookmarked = bookmarkedIds.includes(c.id);
            const wordCount = c.content.join(' ').split(/\s+/).length;
            const readTime = Math.max(2, Math.round(wordCount / 200));

            return (
              <button
                key={c.id}
                onClick={() => onSelectChapter(c)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.99] flex flex-col justify-between hover:shadow-md ${
                  isDone
                    ? darkMode
                      ? 'bg-stone-900/60 border-stone-800/80 text-stone-300'
                      : 'bg-stone-50 border-stone-200 text-stone-800'
                    : darkMode
                    ? 'bg-stone-900 border-stone-800 text-stone-100 hover:border-stone-700'
                    : 'bg-white border-stone-200 text-stone-900 hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {c.num}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isBookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 fill-current" />
                      )}
                      {isDone && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg leading-snug tracking-tight mb-2">
                    {c.title}
                  </h3>

                  <p className="font-serif italic text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                    "{c.scripture}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime} min read
                  </span>
                  <span className="font-mono text-[10px] uppercase">
                    {GROWTH_STAGES[c.stageIdx]?.label}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
