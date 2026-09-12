import React, { useState } from 'react';
import { Chapter } from '../types';
import { X, BookOpen, Copy, Download, Check } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  notes: Record<string, string>;
  onSelectChapter: (chapter: Chapter) => void;
  darkMode: boolean;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  chapters,
  notes,
  onSelectChapter,
  darkMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const chaptersWithNotes = chapters.filter((c) => notes[c.id] && notes[c.id].trim().length > 0);

  const fullJournalText = chapters
    .map((c) => {
      const note = notes[c.id];
      if (!note || !note.trim()) return null;
      return `### ${c.num}: ${c.title}\nScripture: "${c.scripture}" (${c.scriptureRef})\n\nMy Reflection:\n${note}\n\n---`;
    })
    .filter(Boolean)
    .join('\n\n');

  const handleCopyJournal = () => {
    if (!fullJournalText) return;
    navigator.clipboard.writeText(fullJournalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!fullJournalText) return;
    const blob = new Blob([fullJournalText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'The-Laws-of-Money-My-Journal.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="journal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
    >
      <div
        className={`w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">My Covenant Reflections</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {chaptersWithNotes.length} of {chapters.length} chapters documented
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {fullJournalText && (
              <>
                <button
                  onClick={handleCopyJournal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  title="Copy full journal to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="p-1.5 rounded-lg border text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  title="Download as .txt"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chaptersWithNotes.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="font-serif italic text-stone-500 dark:text-stone-400 text-base">
                You haven't written any reflections yet.
              </p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Open any chapter and write your thoughts, covenant decisions, and action plans in the reflection section.
              </p>
            </div>
          ) : (
            chaptersWithNotes.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border transition-colors ${
                  darkMode ? 'bg-stone-950/50 border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {c.num} — {c.title}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectChapter(c);
                    }}
                    className="text-xs text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 underline"
                  >
                    Open Chapter
                  </button>
                </div>
                <p className="text-xs italic text-stone-500 dark:text-stone-400 mb-2">
                  "{c.reflection}"
                </p>
                <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm font-sans whitespace-pre-wrap text-stone-800 dark:text-stone-200">
                  {notes[c.id]}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
