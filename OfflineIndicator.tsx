import React from 'react';
import { useOnlineStatus } from '../utils/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg animate-in slide-in-from-bottom duration-300">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Vanlyn-modus aktief — plaaslike data en Bybelverse word gebruik.</span>
    </div>
  );
};
