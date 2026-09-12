import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-40 flex items-center gap-2 p-3 rounded-xl bg-amber-600 text-white text-xs font-medium shadow-lg animate-fade-in"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode Active — All 15 chapters & notes cached locally.</span>
    </div>
  );
};
