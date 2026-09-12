import React from 'react';
import { Home, BookOpen, BookMarked, Smartphone, Info } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  darkMode: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onSelectTab, darkMode }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Chapters', icon: BookOpen },
    { id: 'journal', label: 'Journal', icon: BookMarked },
    { id: 'apk', label: 'Get APK', icon: Smartphone, highlight: true },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav
      id="bottom-dock-nav"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors ${
        darkMode ? 'bg-stone-900/90 border-stone-800 text-stone-300' : 'bg-stone-50/90 border-stone-200 text-stone-700'
      }`}
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as ActiveTab)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition active:scale-95 ${
                isActive
                  ? 'text-amber-800 dark:text-amber-400 font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition ${
                  tab.highlight && !isActive
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                    : isActive
                    ? 'bg-amber-100/70 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                    : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
