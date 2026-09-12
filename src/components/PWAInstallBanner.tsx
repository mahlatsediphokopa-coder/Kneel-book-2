import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone, Share } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <div
        id="pwa-install-banner"
        className="p-4 rounded-2xl bg-amber-800 text-white shadow-md flex items-center justify-between gap-3 my-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-900/50 text-amber-200">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold leading-tight">
              Install "The Laws of Money" App
            </h4>
            <p className="text-[11px] text-amber-200/90 mt-0.5">
              Instant mobile app with offline reading, daily laws &amp; audio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-amber-900 text-xs font-bold shadow-sm hover:bg-stone-100 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          ) : isIOS ? (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-amber-900 text-xs font-bold shadow-sm hover:bg-stone-100 transition active:scale-95"
            >
              <Share className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          ) : null}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-amber-300 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-stone-900 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Install on iPhone or iPad
            </h3>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>1. Tap the <strong>Share</strong> icon in your Safari toolbar.</p>
              <p>2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
              <p>3. Tap <strong>Add</strong> in the top-right corner to place the app on your home screen.</p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
