import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/store';
import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function MobileLayout() {
  const isOffline = useAppStore(state => state.isOffline);
  const [showDevTools, setShowDevTools] = useState(false);
  const setOffline = useAppStore(state => state.setOffline);
  
  // To show mobile responsiveness correctly, we center it on desktop
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-sans text-neutral-900">
      
      {/* Dev Tools to toggle state quickly */}
      <button 
        onClick={() => setShowDevTools(!showDevTools)}
        className="fixed bottom-4 left-4 p-2 bg-white rounded-full shadow-lg text-xs z-50 text-neutral-500"
      >
        Tools
      </button>
      
      {showDevTools && (
        <div className="fixed bottom-14 left-4 p-4 bg-white rounded-lg shadow-xl z-50 flex flex-col gap-2 text-sm border border-neutral-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isOffline} onChange={(e) => setOffline(e.target.checked)} />
            Simulate Offline
          </label>
        </div>
      )}

      {/* Simulator Frame */}
      <div className="relative w-full max-w-[400px] h-[100dvh] sm:h-[850px] bg-neutral-50 sm:rounded-[3rem] sm:border-[8px] border-neutral-900 sm:shadow-2xl overflow-hidden flex flex-col">
        
        {/* Notch - aesthetic mainly for desktop view */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-6 bg-neutral-900 w-40 mx-auto rounded-b-2xl z-50"></div>

        {/* Global Offline Banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-yellow-100 text-yellow-800 text-xs px-4 py-2 flex items-center gap-2 font-medium z-40 relative sm:pt-6"
            >
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>网络连接异常，部分功能不可用</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-y-auto w-full relative flex flex-col pt-safe bg-neutral-50">
           <Outlet />
        </div>

      </div>
    </div>
  );
}
