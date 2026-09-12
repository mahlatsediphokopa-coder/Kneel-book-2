import React from 'react';
import { X, Feather, Sparkles } from 'lucide-react';
import { FINAL_LAWS } from '../data/laws';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
    >
      <div
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-amber-900/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-700 text-white shadow-sm">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">About KneelBooks</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                We publish only what grows. Dominion comes after bowing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              The Product Principle House
            </h3>
            <p className="text-stone-600 dark:text-stone-300">
              KneelBooks exists to take kingdom revelation and make it readable, holdable, and actionable. We believe that spiritual anointing combined with strategic execution and financial discipline leads to generational dominion.
            </p>
          </div>

          {/* 7 Final Laws */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/30">
            <h3 className="font-serif font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>The Seven Final Laws of Money</span>
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-serif">
              {FINAL_LAWS.map((law, idx) => (
                <li key={idx} className="leading-snug">
                  <span className="font-semibold">{law}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              Core Principles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="font-bold block text-amber-800 dark:text-amber-300 mb-1">Faith + Brain</span>
                Fasting does not substitute budgeting. Diligence in labor honors the God who gives the power to create wealth.
              </div>
              <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="font-bold block text-amber-800 dark:text-amber-300 mb-1">Covenant Foundation</span>
                True wealth exists to establish God’s covenant on earth, bless households, and fund benevolent works.
              </div>
            </div>
          </div>
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
