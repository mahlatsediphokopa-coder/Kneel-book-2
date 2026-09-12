import React from 'react';
import { GROWTH_STAGES } from '../data/laws';
import { Chapter } from '../types';
import { Check } from 'lucide-react';

interface StageProgressProps {
  chapters: Chapter[];
  completedChapterIds: string[];
  darkMode: boolean;
}

export const StageProgress: React.FC<StageProgressProps> = ({
  chapters,
  completedChapterIds,
  darkMode,
}) => {
  const totalCompleted = completedChapterIds.length;
  const overallPercent = Math.round((totalCompleted / chapters.length) * 100);

  return (
    <div
      id="growth-milestones"
      className={`rounded-2xl p-5 sm:p-6 border shadow-sm transition-colors ${
        darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-serif font-semibold text-base sm:text-lg text-stone-900 dark:text-stone-100">
            Stages of Dominion Growth
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            From buried seed-thought to the fruitful tree shading nations.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          {overallPercent}% Harvest
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden my-4">
        <div
          className="h-full bg-amber-700 dark:bg-amber-600 transition-all duration-500 rounded-full"
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      {/* Stage Milestones */}
      <div className="grid grid-cols-5 gap-2 pt-2">
        {GROWTH_STAGES.map((stage, idx) => {
          const stageChapters = chapters.filter((c) => c.stageIdx === idx);
          const stageDone = stageChapters.filter((c) => completedChapterIds.includes(c.id)).length;
          const isComplete = stageChapters.length > 0 && stageDone === stageChapters.length;
          const isStarted = stageDone > 0;

          return (
            <div key={stage.id} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-1.5 transition-all ${
                  isComplete
                    ? 'bg-amber-700 text-white shadow-sm'
                    : isStarted
                    ? 'border-2 border-amber-700 text-amber-700 dark:text-amber-400 dark:border-amber-400'
                    : darkMode
                    ? 'bg-stone-800 text-stone-500'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span className="font-serif text-[11px] sm:text-xs font-medium text-stone-800 dark:text-stone-200 leading-tight">
                {stage.label}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {stage.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
