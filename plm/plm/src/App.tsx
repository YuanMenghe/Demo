import React, { useState } from 'react';
import { LeftPanel } from '@/components/LeftPanel';
import { CenterPanel } from '@/components/CenterPanel';
import { RightPanel } from '@/components/RightPanel';
import { ActionBar } from '@/components/ActionBar';
import { SettingsPage } from '@/components/SettingsPage';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Citation } from '@/types';

export default function App() {
  const logic = useCDSSLogic();
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [highlightedCitationId, setHighlightedCitationId] = useState<string | null>(null);
  const [view, setView] = useState<'workbench' | 'settings'>('workbench');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Handle analysis trigger
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  if (view === 'settings') {
    return <SettingsPage onBack={() => setView('workbench')} />;
  }

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans text-slate-900">
      {/* Main Grid Layout with Framer Motion */}
      <div className="flex-1 flex h-full overflow-hidden relative">
        {/* Left Panel */}
        <motion.div 
          initial={false}
          animate={{ 
            width: hasAnalyzed ? '60px' : '100%',
            flexGrow: hasAnalyzed ? 0 : 1
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="h-full bg-white border-r border-slate-200 overflow-hidden whitespace-nowrap z-20 relative"
        >
          <div className={cn("h-full transition-all duration-500", hasAnalyzed ? "w-[60px]" : "w-screen")}> 
            <LeftPanel 
              logic={logic} 
              collapsed={hasAnalyzed}
              onToggleCollapse={() => setHasAnalyzed(!hasAnalyzed)}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </motion.div>

        {/* Center Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ 
            opacity: hasAnalyzed ? 1 : 0,
            x: hasAnalyzed ? 0 : 100,
            width: hasAnalyzed ? (selectedCitation ? '55%' : '65%') : '0%'
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="h-full bg-slate-50/50 overflow-hidden border-r border-slate-200 relative z-10"
        >
          {hasAnalyzed && (
            <CenterPanel 
              logic={logic} 
              onCitationClick={(citation) => setSelectedCitation(citation)}
              selectedCitationId={selectedCitation?.id}
              onCitationHover={(id) => setHighlightedCitationId(id)}
            />
          )}
        </motion.div>

        {/* Right Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ 
            opacity: hasAnalyzed ? 1 : 0,
            x: hasAnalyzed ? 0 : 100,
            width: hasAnalyzed ? (selectedCitation ? 'calc(45% - 60px)' : 'calc(35% - 60px)') : '0%'
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="h-full bg-white overflow-hidden z-10"
        >
          {hasAnalyzed && (
            <RightPanel 
              logic={logic}
              selectedCitation={selectedCitation}
              onClose={() => setSelectedCitation(null)}
              onSelectCitation={(citation) => setSelectedCitation(citation)}
              highlightedCitationId={highlightedCitationId}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
