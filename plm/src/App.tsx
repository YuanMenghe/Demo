import React, { useState } from 'react';
import { LeftPanel } from '@/components/LeftPanel';
import { CenterPanel } from '@/components/CenterPanel';
import { RightPanel } from '@/components/RightPanel';
import { SettingsPage } from '@/components/SettingsPage';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Citation } from '@/types';
import { Settings, Stethoscope, Share2, Download, Presentation } from 'lucide-react';

// 四个阶段：输入 → 分析中 → 查看结果 → 查看引用详情
// 每个阶段下三栏各占不同比例，焦点区展开、其余收窄
type Stage = 'input' | 'analyzing' | 'results' | 'citation';

const STAGE_WIDTHS: Record<Stage, [string, string, string]> = {
  //                左(输入/摘要)   中(方案主区)   右(证据侧栏)
  input:           ['100%',        '0%',          '0%'  ],
  analyzing:       ['25%',         '75%',         '0%'  ],
  results:         ['25%',         '75%',         '0%'  ],
  citation:        ['20%',         '45%',         '35%' ],
};

const SPRING = { type: 'spring', stiffness: 180, damping: 28 } as const;

export default function App() {
  const logic = useCDSSLogic();
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [highlightedCitationId, setHighlightedCitationId] = useState<string | null>(null);
  const [view, setView] = useState<'workbench' | 'settings'>('workbench');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    logic.runAnalysis();
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  const handleResetInput = () => {
    setHasAnalyzed(false);
    setSelectedCitation(null);
  };

  const stage: Stage =
    !hasAnalyzed && !isAnalyzing ? 'input'
    : isAnalyzing               ? 'analyzing'
    : selectedCitation          ? 'citation'
                                : 'results';

  const [lw, cw, rw] = STAGE_WIDTHS[stage];

  if (view === 'settings') {
    return <SettingsPage onBack={() => setView('workbench')} />;
  }

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans text-slate-900">

      {/* ── 顶部导航栏 ── */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-800 tracking-tight">Patient Like Me</div>
            <div className="text-[11px] text-slate-500 -mt-0.5">数字孪生</div>
          </div>
          <AnimatePresence>
            {hasAnalyzed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-slate-400 ml-0.5 hidden md:inline"
              >
                / 诊疗方案
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5">
          <AnimatePresence>
            {hasAnalyzed && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1"
              >
                <button className="text-xs flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> MDT 查房
                </button>
                <button className="text-xs flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Presentation className="w-3.5 h-3.5" /> 生成 PPT
                </button>
                <button className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                  <Download className="w-3.5 h-3.5" /> 生成报告
                </button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            data-testid="settings-btn"
            aria-label="设置"
            onClick={() => setView('settings')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 三栏工作区 ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* 左栏：输入面板 / 患者摘要侧栏 */}
        <motion.div
          animate={{ width: lw }}
          transition={SPRING}
          className="h-full bg-white border-r border-slate-200 overflow-hidden shrink-0"
          style={{ minWidth: 0 }}
        >
          <LeftPanel
            logic={logic}
            slim={stage === 'results' || stage === 'citation' || stage === 'analyzing'}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            onResetToInput={handleResetInput}
          />
        </motion.div>

        {/* 中栏：方案主展示区（始终渲染，自行管理空/loading/结果三态） */}
        <motion.div
          animate={{ width: cw }}
          transition={SPRING}
          className="h-full bg-slate-50 overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <CenterPanel
            logic={logic}
            onCitationClick={(citation) => setSelectedCitation(citation)}
            selectedCitationId={selectedCitation?.id}
            onCitationHover={(id) => setHighlightedCitationId(id)}
          />
        </motion.div>

        {/* 右栏：证据 / 引用详情侧栏 */}
        <motion.div
          animate={{ width: rw }}
          transition={SPRING}
          className="h-full bg-white border-l border-slate-200 overflow-hidden shrink-0"
          style={{ minWidth: 0 }}
        >
          {(stage === 'results' || stage === 'citation') && (
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
