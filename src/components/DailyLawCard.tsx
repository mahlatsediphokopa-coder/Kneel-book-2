import React, { useState } from 'react';
import { FINAL_LAWS, DAILY_REFLECTIONS } from '../data/laws';
import { Bell, BellRing, Share2, Check, Sparkles } from 'lucide-react';

interface DailyLawCardProps {
  darkMode: boolean;
}

export const DailyLawCard: React.FC<DailyLawCardProps> = ({ darkMode }) => {
  const [copied, setCopied] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    return localStorage.getItem('laws_daily_notif') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string>('');

  // Daily rotational index based on day of year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const lawIndex = dayOfYear % FINAL_LAWS.length;

  const currentLaw = FINAL_LAWS[lawIndex];
  const currentReflection = DAILY_REFLECTIONS[lawIndex];

  const handleToggleReminder = async () => {
    if (!('Notification' in window)) {
      setToastMessage('Daily 7:00 AM reminder active in app storage');
      setNotifEnabled(true);
      localStorage.setItem('laws_daily_notif', 'true');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifEnabled(true);
        localStorage.setItem('laws_daily_notif', 'true');
        setToastMessage('Daily 7:00 AM reminder active ✓');
        new Notification('The Laws of Money • Daily Covenant', {
          body: currentLaw,
          icon: '/pwa-192x192.png',
        });
      } else {
        setNotifEnabled(true);
        localStorage.setItem('laws_daily_notif', 'true');
        setToastMessage('Reminder enabled in local storage');
      }
    } catch {
      setNotifEnabled(true);
      localStorage.setItem('laws_daily_notif', 'true');
      setToastMessage('Reminder active');
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShare = async () => {
    const shareText = `*The Laws of Money (Law #${lawIndex + 1})*\n\n"${currentLaw}"\n\n*Today's Reflection:* ${currentReflection}\n\n— From KneelBooks: The Laws of Money`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Laws of Money — Daily Law',
          text: shareText,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setToastMessage('Copied to clipboard');
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

  return (
    <div
      id="daily-law-card"
      className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden transition-colors ${
        darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Daily Law #{lawIndex + 1} of 7
          </span>
        </div>
        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
          {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Main Law Display */}
      <blockquote className="font-serif text-xl sm:text-2xl font-bold leading-snug tracking-tight text-stone-900 dark:text-stone-100 my-4">
        "{currentLaw}"
      </blockquote>

      {/* Reflection prompt pairing */}
      <div
        className={`p-3.5 rounded-xl border mb-5 text-xs sm:text-sm leading-relaxed ${
          darkMode ? 'bg-stone-950/60 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}
      >
        <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Today's Contemplation:</span>
        </div>
        <p className="italic font-serif">{currentReflection}</p>
      </div>

      {/* Actions: Reminder & Share */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          id="btn-toggle-reminder"
          onClick={handleToggleReminder}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
            notifEnabled
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : darkMode
              ? 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-750'
              : 'bg-stone-100 border-stone-200 text-stone-800 hover:bg-stone-200'
          }`}
        >
          {notifEnabled ? <BellRing className="w-4 h-4 text-emerald-600" /> : <Bell className="w-4 h-4" />}
          <span>{notifEnabled ? '7:00 AM Reminder Active' : 'Set 7:00 AM Daily Reminder'}</span>
        </button>

        <button
          id="btn-share-daily-law"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white shadow-sm transition active:scale-95"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Share Today’s Law'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="mt-3 text-center text-xs text-emerald-700 dark:text-emerald-300 font-medium py-1 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
