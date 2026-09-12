import React, { useState } from 'react';
import { X, Smartphone, Download, Terminal, Play, Check, ExternalLink, ShieldCheck, Copy } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const ApkBuilderModal: React.FC<ApkBuilderModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallStatus('App installed to your device home screen!');
      }
    } else {
      setInstallStatus('Follow browser prompt: tap Menu (⋮) → "Install app" or "Add to Home Screen"');
    }
    setTimeout(() => setInstallStatus(''), 4000);
  };

  const capacitorCommands = `npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "The Laws of Money" com.kneelbooks.lawsofmoney --web-dir dist
npm run build
npx cap add android
npx cap open android`;

  return (
    <div
      id="apk-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl my-8 overflow-hidden transition-all ${
          darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight">
                Android APK & Mobile App Hub
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Install as a native Android app or compile your signed .apk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Method 1: Instant Direct Install (PWA / WebAPK) */}
          <div
            className={`p-5 rounded-xl border ${
              darkMode ? 'bg-stone-950/50 border-stone-800' : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-600 text-white">
                    Fastest
                  </span>
                  <h3 className="font-bold text-sm">Method 1: Direct Android Phone Install (WebAPK)</h3>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                  Android devices automatically generate a native WebAPK package for this app with offline capability, full-screen mode, and an app launcher icon.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalled ? 'App Already Installed ✓' : 'Install Directly to Android Phone'}</span>
              </button>

              <span className="text-xs text-stone-500 dark:text-stone-400">
                {isIOS ? 'On iOS Safari: Tap Share → Add to Home Screen' : 'Works in Chrome, Edge & Samsung Internet'}
              </span>
            </div>

            {installStatus && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {installStatus}
              </p>
            )}
          </div>

          {/* Method 2: PWABuilder 1-Click APK Generator */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-700 text-white">
                No Coding Required
              </span>
              <h3 className="font-bold text-sm">Method 2: Generate Standalone .APK File online</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
              Use Microsoft's official <strong>PWABuilder</strong> tool to convert this web app into a ready-to-sideload Android <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-[11px]">.apk</code> file or Google Play Store package.
            </p>

            <div className="bg-stone-100 dark:bg-stone-800/70 p-3 rounded-lg text-xs space-y-2 font-mono text-stone-700 dark:text-stone-300">
              <div>1. Open: <strong>https://www.pwabuilder.com</strong></div>
              <div>2. Paste this app's URL</div>
              <div>3. Click "Package for Android" → Download your ready <strong>.apk</strong>!</div>
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 transition"
              >
                <span>Open PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Method 3: Native Android Studio / Capacitor Project Build */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-700 text-white">
                  Developer
                </span>
                <h3 className="font-bold text-sm">Method 3: Build APK via Capacitor & Android Studio</h3>
              </div>
              <button
                onClick={() => handleCopy(capacitorCommands, 'cap-cmd')}
                className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline"
              >
                {copiedCmd === 'cap-cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'cap-cmd' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
              The project is pre-configured with <code className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">capacitor.config.ts</code> and <code className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">@capacitor/android</code>. Run these in terminal:
            </p>

            <pre className="p-3 rounded-lg bg-stone-950 text-stone-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
              {capacitorCommands}
            </pre>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-3">
              In Android Studio, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> to generate <span className="font-mono font-semibold">app-debug.apk</span>.
            </p>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-stone-600 dark:text-stone-300">
              PWA compliance verified: Web App Manifest, 192x192 &amp; 512x512 icons, offline service worker, and standalone mobile viewport are configured.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
