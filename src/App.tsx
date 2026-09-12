import React, { useState, useEffect } from 'react';
import { CHAPTERS } from './data/chapters';
import { Chapter, ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { StageProgress } from './components/StageProgress';
import { DailyLawCard } from './components/DailyLawCard';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ChapterListView } from './components/ChapterListView';
import { ReaderModal } from './components/ReaderModal';
import { ApkBuilderModal } from './components/ApkBuilderModal';
import { JournalModal } from './components/JournalModal';
import { AboutModal } from './components/AboutModal';
import { BottomBar } from './components/BottomBar';
import { OfflineBanner } from './components/OfflineBanner';
import { BookOpen, Sparkles, Smartphone, Award, ArrowRight, Bookmark } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('laws_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeReaderChapter, setActiveReaderChapter] = useState<Chapter | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('laws_completed') || '[]');
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('laws_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('laws_notes') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('laws_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('laws_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('laws_completed', JSON.stringify(completedIds));
  }, [completedIds]);

  useEffect(() => {
    localStorage.setItem('laws_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('laws_notes', JSON.stringify(notes));
  }, [notes]);

  const handleToggleCompleted = (chapterId: string) => {
    setCompletedIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  const handleToggleBookmark = (chapterId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  const handleSaveNote = (chapterId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [chapterId]: note }));
  };

  const handleOpenReader = (chapter: Chapter) => {
    setActiveReaderChapter(chapter);
  };

  // Find next unread chapter
  const nextUnreadChapter = CHAPTERS.find((c) => !completedIds.includes(c.id)) || CHAPTERS[0];

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'apk') {
      setIsApkModalOpen(true);
      return;
    }
    if (tab === 'about') {
      setIsAboutModalOpen(true);
      return;
    }
    if (tab === 'journal') {
      setIsJournalModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="main-app-container"
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode ? 'bg-stone-950 text-stone-100' : 'bg-[#fbf9f5] text-stone-900'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((d) => !d)}
        completedCount={completedIds.length}
        totalChapters={CHAPTERS.length}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Hero / Cover Card */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden transition-all ${
                darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>Covenant Economics &amp; Value Dominion</span>
                  </div>

                  <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
                    The Laws of Money
                  </h2>

                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif max-w-xl">
                    "Money is not paper. Money is a witness. It answers to laws as fixed as gravity, as covenantal as marriage, as alive as a seed planted in fertile ground."
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      id="btn-resume-reading"
                      onClick={() => handleOpenReader(nextUnreadChapter)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-700 hover:bg-amber-800 text-white shadow-sm transition active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{completedIds.length === 0 ? 'Start Reading' : `Continue: ${nextUnreadChapter.num}`}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>

                    <button
                      id="btn-view-all-chapters"
                      onClick={() => setActiveTab('library')}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                    >
                      <span>Explore 15 Chapters</span>
                    </button>
                  </div>
                </div>

                {/* Badge Seal */}
                <div className="hidden sm:flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-900/10 border border-amber-800/20 text-center shrink-0 w-36">
                  <div className="w-12 h-12 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-md mb-2">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    KneelBooks
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Authentic Edition
                  </span>
                </div>
              </div>
            </div>

            {/* PWA In-App Install Banner */}
            <PWAInstallBanner />

            {/* Daily Law Card */}
            <DailyLawCard darkMode={darkMode} />

            {/* 5 Growth Milestones */}
            <StageProgress
              chapters={CHAPTERS}
              completedChapterIds={completedIds}
              darkMode={darkMode}
            />

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Android APK Card */}
              <button
                id="btn-card-apk"
                onClick={() => setIsApkModalOpen(true)}
                className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm active:scale-98 ${
                  darkMode ? 'bg-stone-900 border-stone-800 hover:border-stone-700' : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 w-fit mb-2">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm">Download Android APK</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  Install via WebAPK or build signed APK via Capacitor.
                </p>
              </button>

              {/* Reflection Journal Card */}
              <button
                id="btn-card-journal"
                onClick={() => setIsJournalModalOpen(true)}
                className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm active:scale-98 ${
                  darkMode ? 'bg-stone-900 border-stone-800 hover:border-stone-700' : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 w-fit mb-2">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm">My Covenant Notes</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  Review and export your personal chapter reflections.
                </p>
              </button>

              {/* 7 Laws & Mission Card */}
              <button
                id="btn-card-about"
                onClick={() => setIsAboutModalOpen(true)}
                className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm active:scale-98 ${
                  darkMode ? 'bg-stone-900 border-stone-800 hover:border-stone-700' : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 w-fit mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm">The 7 Final Laws</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  Read the foundational tenets and reader testimonies.
                </p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                  Chapters &amp; Manuals
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Read, reflect, listen, and build your value in the marketplace.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800">
                {completedIds.length} / {CHAPTERS.length} Done
              </span>
            </div>

            <ChapterListView
              chapters={CHAPTERS}
              onSelectChapter={handleOpenReader}
              completedIds={completedIds}
              bookmarkedIds={bookmarkedIds}
              darkMode={darkMode}
            />
          </div>
        )}
      </main>

      {/* Offline Status Toast */}
      <OfflineBanner />

      {/* Bottom Floating Navigation Dock */}
      <BottomBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        darkMode={darkMode}
      />

      {/* Chapter Reader Modal */}
      <ReaderModal
        chapter={activeReaderChapter}
        isOpen={!!activeReaderChapter}
        onClose={() => setActiveReaderChapter(null)}
        onSelectChapter={(c) => setActiveReaderChapter(c)}
        allChapters={CHAPTERS}
        isCompleted={activeReaderChapter ? completedIds.includes(activeReaderChapter.id) : false}
        onToggleCompleted={handleToggleCompleted}
        isBookmarked={activeReaderChapter ? bookmarkedIds.includes(activeReaderChapter.id) : false}
        onToggleBookmark={handleToggleBookmark}
        notes={notes}
        onSaveNote={handleSaveNote}
        darkMode={darkMode}
      />

      {/* Android APK & Mobile App Hub Modal */}
      <ApkBuilderModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        darkMode={darkMode}
      />

      {/* Journal Modal */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        chapters={CHAPTERS}
        notes={notes}
        onSelectChapter={handleOpenReader}
        darkMode={darkMode}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
