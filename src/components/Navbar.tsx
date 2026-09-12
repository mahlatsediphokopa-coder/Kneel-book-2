import React from 'react';
import { Sun, Moon, Sparkles, Download } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  completedCount: number;
  totalChapters: number;
  onOpenApkModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  completedCount,
  totalChapters,
  onOpenApkModal,
}) => {
  const percent = Math.round((completedCount / totalChapters) * 100);

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-40 h-14 border-b backdrop-blur-md transition-colors ${
        darkMode ? 'bg-stone-900/85 border-stone-800 text-stone-100' : 'bg-stone-50/85 border-stone-200 text-stone-900'
      }`}
    >
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-900/10 border border-amber-800/20 flex items-center justify-center text-amber-800 dark:text-amber-200 font-serif font-bold text-sm">
            KB
          </div>
          <div>
            <h1 className="font-serif font-semibold text-sm tracking-wider uppercase text-stone-900 dark:text-stone-100">
              The Laws of Money
            </h1>
            <p className="text-[10px] tracking-widest text-stone-500 dark:text-stone-400 uppercase">
              KneelBooks • Edition v2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              darkMode ? 'bg-stone-800/60 border-stone-700 text-stone-300' : 'bg-stone-100 border-stone-200 text-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{percent}% Completed</span>
          </div>

          {/* Android APK Hub Button */}
          <button
            id="btn-open-apk-hub"
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-700 hover:bg-amber-800 text-white shadow-sm transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-semibold">Get APK</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-full border transition active:scale-95 ${
              darkMode ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
