import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Activity, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Filter,
  Users,
  Ban,
  Sparkles,
  Stethoscope,
  Presentation,
  GitCompare,
  Download,
  Layers,
  Send
} from 'lucide-react';
import { CDSSResponse, Citation } from '../types';
import { cn } from '../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';

// Helper to render inline content (bold, citations)
const renderInlineContent = (
  text: string, 
  citations: Citation[] | undefined, 
  onClick: (c: Citation) => void, 
  onHover: ((id: string | null) => void) | undefined
) => {
  // Split by citation markers like [1]
  const parts = text.split(/(\[\d+\])/g);
  
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const index = parseInt(match[1]);
      const citation = citations?.find(c => c.index === index);
      
      if (citation) {
        return (
          <sup 
            key={i}
            className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded cursor-pointer hover:bg-indigo-100 hover:scale-110 transition-all ml-0.5 align-top"
            onClick={(e) => {
              e.stopPropagation();
              onClick(citation);
            }}
            onMouseEnter={() => onHover?.(citation.id)}
            onMouseLeave={() => onHover?.(null)}
            title={citation.title}
          >
            {index}
          </sup>
        );
      }
    }
    
    // Handle bold **text**
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={j} className="font-bold text-slate-900">{bp.slice(2, -2)}</strong>;
          }
          return bp;
        })}
      </span>
    );
  });
};

// Helper to render text with citation markers [1] and basic markdown
const RichTextRenderer = ({ 
  text, 
  citations, 
  onCitationClick,
  onCitationHover 
}: { 
  text: string, 
  citations?: Citation[], 
  onCitationClick: (c: Citation) => void,
  onCitationHover?: (id: string | null) => void
}) => {
  if (!text) return null;
  
  // Split text by newlines to handle block elements
  const lines = text.split('\n');
  
  return (
    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-1">
      {lines.map((line, lineIdx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={lineIdx} className="h-2" />; // Spacer

        // Handle Headers
        if (line.startsWith('#### ')) {
          return (
            <h4 key={lineIdx} className="text-sm font-bold text-slate-800 mt-3 mb-1 uppercase tracking-wide">
              {line.replace(/^####\s+/, '')}
            </h4>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={lineIdx} className="text-base font-bold text-slate-900 mt-4 mb-2">
              {line.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={lineIdx} className="text-lg font-bold text-slate-900 mt-5 mb-3 border-b border-slate-100 pb-2">
              {line.replace(/^##\s+/, '')}
            </h2>
          );
        }
        
        // Handle Bullet points * or -
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
           return (
             <div key={lineIdx} className="flex gap-2 pl-4 mb-1">
               <span className="text-slate-400 mt-2 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
               <div>
                 {renderInlineContent(line.replace(/^[\*\-]\s+/, ''), citations, onCitationClick, onCitationHover)}
               </div>
             </div>
           );
        }

        // Standard paragraph
        return (
          <p key={lineIdx} className="mb-1">
            {renderInlineContent(line, citations, onCitationClick, onCitationHover)}
          </p>
        );
      })}
    </div>
  );
};

interface CenterPanelProps {
  logic: ReturnType<typeof useCDSSLogic>;
  isAnalyzing?: boolean;
  onCitationClick: (citation: Citation) => void;
  selectedCitationId?: string;
  onCitationHover?: (id: string | null) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ 
  logic, 
  isAnalyzing: isAnalyzingProp,
  onCitationClick,
  selectedCitationId,
  onCitationHover
}) => {
  const { response, isAnalyzing: isAnalyzingFromLogic } = logic;
  const isAnalyzing = isAnalyzingProp ?? isAnalyzingFromLogic;
  const [activeTab, setActiveTab] = useState<'integrated' | 'guidelines' | 'evidence'>('integrated');

  if (!response && !isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 px-10 py-12 gap-10">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Activity className="w-7 h-7 text-teal-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">智能诊疗方案</h2>
          <p className="text-sm text-slate-400 leading-relaxed">在左侧输入患者病历，系统将自动匹配指南、检索文献并生成个性化方案。</p>
        </div>
      </div>
    );
  }


  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            className="absolute inset-0 border-4 border-slate-100 rounded-full"
          />
          <motion.div
            className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            <Activity className="w-8 h-8 text-indigo-500" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">正在分析病例...</h3>
        <div className="flex flex-col gap-2 text-sm text-slate-500 items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            正在匹配 CSCO/NCCN 指南...
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            正在检索真实世界数据库...
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            正在生成个性化治疗建议...
          </motion.span>
        </div>
      </div>
    );
  }

  const CitationBadge = ({ indices }: { indices?: number[] }) => {
    if (!indices || indices.length === 0) return null;
    
    return (
      <span className="inline-flex gap-1 ml-1 align-super text-[10px]">
        <Tooltip.Provider delayDuration={300}>
          {indices.map(idx => {
            const citation = response?.citations?.find(c => c.index === idx);
            if (!citation) return null;
            
            return (
              <Tooltip.Root key={idx}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCitationClick(citation);
                    }}
                    className={cn(
                      "inline-flex items-center justify-center min-w-[16px] h-[16px] px-0.5 rounded text-white font-bold transition-all hover:scale-110 cursor-pointer",
                      selectedCitationId === citation.id ? "ring-2 ring-offset-1 ring-teal-500 scale-110" : "",
                      citation.sourceType === 'guideline' ? "bg-teal-600" :
                      citation.sourceType === 'pubmed' ? "bg-blue-600" : "bg-purple-600"
                    )}
                  >
                    {idx}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="z-50 max-w-xs bg-slate-900 text-white text-xs p-2 rounded shadow-lg animate-in fade-in zoom-in-95 duration-200" sideOffset={5}>
                    <p className="font-bold mb-1">{citation.sourceType.toUpperCase()}</p>
                    <p>{citation.title}</p>
                    <Tooltip.Arrow className="fill-slate-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </Tooltip.Provider>
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Header Tabs */}
      <div className="flex-none px-6 pt-6 pb-4 border-b border-slate-100 bg-white z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            MDT_Beone 诊疗方案
          </h2>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              response?.diagnosisStatus === 'confirmed' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {response?.diagnosisStatus === 'confirmed' ? '诊断明确' : '疑似诊断'}
            </span>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-100/50 p-1 rounded-lg">
          {[
            { id: 'integrated', label: '综合', icon: Layers },
            { id: 'guidelines', label: '指南问答', icon: FileText },
            { id: 'evidence', label: 'PubMed 问答', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mx-auto w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {activeTab === 'guidelines' ? (
            <motion.div
              key="guidelines"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="text-xs text-slate-500">
                共参考 {response?.guidelines?.length ?? 0} 部指南
              </div>

              {response?.guidelines?.filter(g => g.recommendations?.length).map((g, idx) => (
                <section key={g.id ?? idx} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-baseline gap-2">
                    {g.name}
                    {g.type === 'primary' && (
                      <span className="text-[11px] font-medium text-teal-700">主要依据</span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {g.recommendations?.map((rec, ri) => (
                      <div key={ri} className="text-sm leading-relaxed">
                        <div className="text-slate-900">
                          <span className="font-semibold">{rec.topic}</span>
                          {rec.evidenceLevel && (
                            <span className="text-xs text-slate-500 ml-2">· {rec.evidenceLevel}</span>
                          )}
                        </div>
                        <div className="text-slate-700 mt-0.5">
                          <RichTextRenderer
                            text={rec.content}
                            citations={response?.citations}
                            onCitationClick={onCitationClick}
                            onCitationHover={onCitationHover}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          ) : activeTab === 'evidence' ? (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {response?.comprehensiveAnalysis && (
                <section className="text-sm text-slate-700 leading-relaxed">
                  <RichTextRenderer
                    text={response.comprehensiveAnalysis}
                    citations={response.citations}
                    onCitationClick={onCitationClick}
                    onCitationHover={onCitationHover}
                  />
                </section>
              )}

              {response?.citations?.some(c => c.sourceType === 'pubmed') && (
                <section className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">关键临床研究</h3>
                  <ul className="space-y-3">
                    {response?.citations?.filter(c => c.sourceType === 'pubmed').map((cit) => (
                      <li
                        key={cit.id}
                        onClick={() => onCitationClick(cit)}
                        onMouseEnter={() => onCitationHover?.(cit.id)}
                        onMouseLeave={() => onCitationHover?.(null)}
                        className="group cursor-pointer text-sm leading-relaxed"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-mono text-slate-400 shrink-0 w-5">[{cit.index}]</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                              {cit.title}
                            </span>
                            <span className="text-slate-400"> · </span>
                            <span className="text-xs text-slate-500">{cit.journal}</span>
                            {cit.year && <span className="text-xs text-slate-500"> {cit.year}</span>}
                            {cit.impactFactor && (
                              <span className="text-xs text-slate-400"> · IF {cit.impactFactor}</span>
                            )}
                            {cit.abstract && (
                              <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                                {cit.abstract}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="integrated"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* 1. 诊断 —— 平铺标题 + 概念 chip */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {response?.diagnosisTitle}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {response?.concepts.filter(c => c.confirmed).map(c => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded"
                    >
                      {c.text}
                    </span>
                  ))}
                </div>
              </section>

              {/* 2. 推荐方案 —— 核心焦点,左 teal 粗竖线 */}
              {response?.treatments && response.treatments.length > 0 && (
                <section className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    推荐方案
                  </h3>
                  {response.treatments.map((treatment) => (
                    <div
                      key={treatment.id}
                      className="border-l-[3px] border-teal-500 pl-5 py-1 space-y-3"
                    >
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900">{treatment.name}</h4>
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {treatment.evidenceLevel} 类推荐
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {treatment.description}
                      </p>

                      {/* 禁忌 —— inline 红色行 */}
                      {treatment.contraindications && treatment.contraindications.length > 0 && (
                        <div className="space-y-1">
                          {treatment.contraindications.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-rose-700">
                              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <span>
                                <span className="font-semibold">禁忌 · </span>
                                {c.reason}
                                <CitationBadge indices={c.citationIndices} />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 替代 —— inline 蓝色行 */}
                      {treatment.alternatives && treatment.alternatives.length > 0 && (
                        <div className="space-y-1">
                          {treatment.alternatives.map((alt, altIdx) => (
                            <div key={altIdx} className="flex items-start gap-2 text-sm text-blue-700">
                              <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                              <span>
                                <span className="font-semibold">替代 · {alt.name}</span>
                                <span className="text-blue-600"> —— {alt.reason}</span>
                                <CitationBadge indices={alt.citationIndices} />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 引用来源 —— 极简内联链接 */}
                      {treatment.citationIndices && treatment.citationIndices.length > 0 && (
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                          <span className="text-slate-400">依据：</span>
                          {treatment.citationIndices.map(idx => {
                            const cit = response.citations?.find(c => c.index === idx);
                            if (cit?.sourceType !== 'guideline') return null;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onCitationClick(cit); }}
                                onMouseEnter={() => onCitationHover?.(cit.id)}
                                onMouseLeave={() => onCitationHover?.(null)}
                                className="text-teal-700 hover:underline truncate max-w-[260px]"
                                title={cit.title}
                              >
                                {cit.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* 3. 循证医学分析 —— 平铺,只留小标题 */}
              {response?.comprehensiveAnalysis && (
                <section className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    循证医学分析
                  </h3>
                  <RichTextRenderer
                    text={response.comprehensiveAnalysis}
                    citations={response.citations}
                    onCitationClick={onCitationClick}
                    onCitationHover={onCitationHover}
                  />
                </section>
              )}

              {/* 4. 参考指南 + 建议完善检查 —— 并排,纯文本列表 */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    参考指南
                  </h3>
                  <ul className="space-y-1.5">
                    {response?.guidelines.map((g, i) => (
                      <li key={g.id ?? i} className="text-sm text-slate-700 flex items-baseline gap-2">
                        <span className="text-slate-300 shrink-0">·</span>
                        <span className="flex-1">{g.name}</span>
                        {g.type === 'primary' && (
                          <span className="text-[11px] text-teal-700 font-medium shrink-0">主要</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    建议完善检查
                  </h3>
                  <ul className="space-y-1.5">
                    {response?.exams.map((e) => (
                      <li key={e.id} className="text-sm text-slate-700">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-300 shrink-0">·</span>
                          <span className="font-medium">{e.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-3 mt-0.5">{e.purpose}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </motion.div>
          )}
        
        </AnimatePresence>

        {/* 模块追问功能 */}
        {(activeTab === 'guidelines' || activeTab === 'evidence') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-slate-200/60"
          >
            <div className="relative flex items-center bg-white border border-indigo-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(99,102,241,0.1)] focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-300 transition-all p-1.5 group">
              <input 
                type="text" 
                placeholder={
                  activeTab === 'guidelines'
                    ? '基于当前指南推荐提问，例如：为什么没有推荐放疗？'
                    : '基于文献证据提问，例如：是否有关于高龄患者生存率的补充数据？'
                }
                className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button className="flex-shrink-0 bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm active:scale-95 flex items-center gap-1.5 group-focus-within:bg-indigo-500">
                <span className="text-xs font-semibold pl-1 hidden sm:inline">发送</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 px-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-slate-400">AI 将结合当前患者特征与 <strong className="text-slate-500 font-medium">{
                activeTab === 'guidelines' ? '指南推荐' : 'PubMed 文献证据'
              }</strong> 为您解答</span>
            </div>
          </motion.div>
        )}

          </div>
        </div>

      {/* Bottom Action Bar */}
      {response?.diagnosisStatus !== 'unclear' && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <div className="flex items-center gap-2">
            <ActionButton icon={<Stethoscope className="w-4 h-4" />} label="MDT查房" />
            <ActionButton icon={<Presentation className="w-4 h-4" />} label="生成PPT" />
            <ActionButton icon={<GitCompare className="w-4 h-4" />} label="匹配研究" />
          </div>
          
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            生成决策报告
          </button>
        </div>
      )}
    </div>
  );
};

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-700 hover:bg-teal-50 transition-all shadow-sm">
      {icon}
      {label}
    </button>
  );
}

